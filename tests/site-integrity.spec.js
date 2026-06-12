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

test('the curated MathJax runtime is local and complete for shipped content', async ({ page }) => {
  const localOrigin = new URL(baseUrl).origin;
  const externalRuntimeRequests = [];
  const failedRuntimeRequests = [];
  const requestedRuntimePaths = new Set();
  const expectedRuntimePaths = new Set([
    'input/tex/extensions/braket.js',
    'mathjax-newcm/chtml/dynamic/calligraphic.js',
    'mathjax-newcm/chtml/dynamic/double-struck.js',
    'mathjax-newcm/chtml/woff2/mjx-ncm-brk.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-c.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-ds.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-lo.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-n.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-s4.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-s6.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-s7.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-v.woff2',
    'mathjax-newcm/chtml/woff2/mjx-ncm-zero.woff2',
    'sre/mathmaps/base.json',
    'sre/mathmaps/en.json',
    'sre/mathmaps/nemeth.json',
    'sre/speech-worker.js',
    'tex-chtml.js',
  ]);
  const mathPages = [
    'building-a-rate-limiter',
    'climate-data-analysis',
    'eyvan-design-and-architecture',
    'field-notes-iceland-2025',
    'quantum-entanglement-primer',
  ];
  const runtimePrefix = '/assets/vendor/mathjax/4.1.2/';

  page.on('request', (request) => {
    const url = new URL(request.url());

    if (url.origin !== localOrigin && /mathjax/i.test(request.url())) {
      externalRuntimeRequests.push(`${request.resourceType()}: ${request.url()}`);
    }
  });

  page.on('response', (response) => {
    const url = new URL(response.url());
    const prefixIndex = url.pathname.indexOf(runtimePrefix);

    if (prefixIndex === -1) {
      return;
    }

    requestedRuntimePaths.add(url.pathname.slice(prefixIndex + runtimePrefix.length));

    if (!response.ok()) {
      failedRuntimeRequests.push(`${response.status()}: ${response.url()}`);
    }
  });

  for (const slug of mathPages) {
    await page.goto(`${baseUrl}/projects/${slug}/`, { waitUntil: 'networkidle' });
    await page.evaluate(() => window.MathJax.startup.promise);
    await expect(page.locator('mjx-merror')).toHaveCount(0);
  }

  expect([...requestedRuntimePaths].sort()).toEqual([...expectedRuntimePaths].sort());
  expect(failedRuntimeRequests).toEqual([]);
  expect(externalRuntimeRequests).toEqual([]);
});
