const { test, expect } = require('@playwright/test');

const baseUrl = process.env.EYVAN_BASE_URL || 'http://127.0.0.1:4000/eyvan';

function localUrl(canonicalUrl) {
  const url = new URL(canonicalUrl);
  return new URL(`${url.pathname}${url.search}`, `${baseUrl}/`).href;
}

test('sitemap pages and their internal links and assets resolve', async ({ page, request }) => {
  const sitemapResponse = await request.get(`${baseUrl}/sitemap.xml`);
  expect(sitemapResponse.ok()).toBe(true);

  const sitemap = await sitemapResponse.text();
  const pageUrls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)]
    .map((match) => localUrl(match[1]))
    .filter((url) => new URL(url).pathname.endsWith('/'));

  expect(pageUrls.length).toBeGreaterThan(0);

  const resources = new Map();

  for (const pageUrl of pageUrls) {
    const response = await page.goto(pageUrl);
    expect(response, `No response for sitemap page ${pageUrl}`).not.toBeNull();
    expect(response.ok(), `Sitemap page failed: ${pageUrl}`).toBe(true);

    const pageResources = await page.locator(
      'a[href], img[src], script[src], link[href], source[src]'
    ).evaluateAll((elements) => elements.map((element) => ({
      attribute: element.hasAttribute('href') ? 'href' : 'src',
      value: element.getAttribute(element.hasAttribute('href') ? 'href' : 'src'),
    })));

    for (const { attribute, value } of pageResources) {
      if (!value || value.startsWith('#')) {
        continue;
      }

      const resolved = new URL(value, pageUrl);

      if (!['http:', 'https:'].includes(resolved.protocol)) {
        continue;
      }

      if (resolved.origin !== new URL(baseUrl).origin) {
        continue;
      }

      resolved.hash = '';
      resources.set(resolved.href, `${attribute} on ${pageUrl}`);
    }
  }

  for (const [url, source] of [...resources.entries()].sort()) {
    const response = await request.get(url);
    expect(response.ok(), `Broken internal resource ${url} (${source})`).toBe(true);
  }
});

test('chart and math runtimes are local and functional', async ({ page }) => {
  const localOrigin = new URL(baseUrl).origin;
  const externalRuntimeRequests = [];

  page.on('request', (request) => {
    const url = new URL(request.url());

    if (url.origin !== localOrigin) {
      externalRuntimeRequests.push(`${request.resourceType()}: ${request.url()}`);
    }
  });

  await page.goto(`${baseUrl}/projects/climate-data-analysis/`);
  await page.waitForFunction(() =>
    Boolean(window.Chart?.getChart?.('temperatureLineChart'))
  );
  expect(await page.locator('script[src*="/assets/vendor/chart.js/"]').count()).toBe(1);

  await page.goto(`${baseUrl}/projects/quantum-entanglement-primer/`);
  await page.waitForFunction(() => Boolean(window.MathJax?.startup?.promise));
  await page.evaluate(() => window.MathJax.startup.promise);
  await expect.poll(() => page.locator('mjx-container').count()).toBeGreaterThan(0);
  await expect(page.locator('mjx-merror')).toHaveCount(0);
  expect(
    await page.locator('script[src$="/assets/vendor/mathjax/4.1.2/tex-chtml.js"]').count()
  ).toBe(1);

  await page.waitForTimeout(500);
  expect(externalRuntimeRequests).toEqual([]);
});
