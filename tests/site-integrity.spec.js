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

test('the pinned MathJax CDN runtime renders shipped math content', async ({ page }) => {
  const mathJaxRequests = [];
  const mathPages = [
    'building-a-rate-limiter',
    'climate-data-analysis',
    'eyvan-design-and-architecture',
    'field-notes-iceland-2025',
    'quantum-entanglement-primer',
  ];

  page.on('response', (response) => {
    const url = response.url();

    if (url.includes('cdn.jsdelivr.net/npm/') && /mathjax/i.test(url)) {
      mathJaxRequests.push({
        status: response.status(),
        url,
      });
    }
  });

  for (const slug of mathPages) {
    await page.goto(`${baseUrl}/projects/${slug}/`);
    await page.waitForFunction(() => Boolean(window.MathJax?.startup?.promise));
    await page.evaluate(() => window.MathJax.startup.promise);
    await expect(page.locator('mjx-merror')).toHaveCount(0);
  }

  const loader = page.locator('#MathJax-script');

  await expect(loader).toHaveAttribute(
    'src',
    'https://cdn.jsdelivr.net/npm/mathjax@4.1.2/tex-chtml.js'
  );
  await expect(loader).toHaveAttribute(
    'integrity',
    'sha384-zAhQQhdaMeHsMProNntGGg6nOUVcfuF9F22C3d1qJ9NZAVzCplXk1X85D2O5iufn'
  );
  await expect(loader).toHaveAttribute('crossorigin', 'anonymous');
  await expect(loader).toHaveAttribute('referrerpolicy', 'no-referrer');
  await expect(page.locator('mjx-container')).not.toHaveCount(0);

  expect(mathJaxRequests.length).toBeGreaterThan(0);

  for (const response of mathJaxRequests) {
    expect(response.status, response.url).toBeLessThan(400);
    expect(
      response.url.includes('mathjax@4.1.2/')
      || response.url.includes('mathjax-newcm-font@4.1.2/')
    ).toBe(true);
  }
});

test('the climate demo uses the pinned Chart.js CDN runtime', async ({ page }) => {
  const chartJsResponses = [];

  page.on('response', (response) => {
    if (response.url().includes('cdn.jsdelivr.net/npm/chart.js')) {
      chartJsResponses.push({
        status: response.status(),
        url: response.url(),
      });
    }
  });

  await page.goto(`${baseUrl}/projects/climate-data-analysis/`);
  await page.waitForFunction(() =>
    Boolean(
      window.Chart?.getChart?.('temperatureLineChart')
      && window.Chart?.getChart?.('precipitationBarChart')
    )
  );

  const loader = page.locator('#ChartJS-demo-script');

  await expect(loader).toHaveAttribute(
    'src',
    'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'
  );
  await expect(loader).toHaveAttribute(
    'integrity',
    'sha384-jb8JQMbMoBUzgWatfe6COACi2ljcDdZQ2OxczGA3bGNeWe+6DChMTBJemed7ZnvJ'
  );
  await expect(loader).toHaveAttribute('crossorigin', 'anonymous');
  await expect(loader).toHaveAttribute('referrerpolicy', 'no-referrer');
  await expect(page.locator('#temperatureLineChart')).toBeVisible();
  await expect(page.locator('#precipitationBarChart')).toBeVisible();

  expect(chartJsResponses).toHaveLength(1);
  expect(chartJsResponses[0].status).toBeLessThan(400);
  expect(chartJsResponses[0].url).toBe(
    'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'
  );
});
