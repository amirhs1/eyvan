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
      'a[href], img[src], img[srcset], script[src], link[href], source[src], source[srcset]'
    ).evaluateAll((elements) => elements.flatMap((element) => {
      const resources = [];

      if (element.hasAttribute('href')) {
        resources.push({
          attribute: 'href',
          value: element.getAttribute('href'),
        });
      }

      if (element.hasAttribute('src')) {
        resources.push({
          attribute: 'src',
          value: element.getAttribute('src'),
        });
      }

      if (element.hasAttribute('srcset')) {
        const srcset = element.getAttribute('srcset') || '';
        const candidates = srcset.split(',')
          .map((candidate) => candidate.trim())
          .filter(Boolean)
          .map((candidate) => ({
            attribute: 'srcset',
            value: candidate.split(/\s+/)[0],
          }));

        resources.push(...candidates);
      }

      return resources;
    }));

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

  await page.locator('[data-theme-toggle]:visible').click();
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

  const darkThemeChartColors = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement);
    const color = (name) => styles.getPropertyValue(name).trim();
    const temperatureChart = window.Chart.getChart('temperatureLineChart');
    const precipitationChart = window.Chart.getChart('precipitationBarChart');

    return {
      expected: {
        text: color('--color-on-surface'),
        error: color('--color-error'),
        warning: color('--color-warning'),
        info: color('--color-info'),
        success: color('--color-success'),
      },
      temperatureDatasets: temperatureChart.data.datasets.map(
        (dataset) => dataset.borderColor
      ),
      precipitationLegend: precipitationChart.legend.legendItems.map((item) => ({
        fontColor: item.fontColor,
        strokeStyle: item.strokeStyle,
      })),
    };
  });

  expect(darkThemeChartColors.temperatureDatasets).toEqual([
    darkThemeChartColors.expected.error,
    darkThemeChartColors.expected.info,
  ]);
  expect(
    darkThemeChartColors.precipitationLegend.map((item) => item.strokeStyle)
  ).toEqual([
    darkThemeChartColors.expected.info,
    darkThemeChartColors.expected.success,
    darkThemeChartColors.expected.warning,
  ]);
  expect(
    darkThemeChartColors.precipitationLegend.map((item) => item.fontColor)
  ).toEqual([
    darkThemeChartColors.expected.text,
    darkThemeChartColors.expected.text,
    darkThemeChartColors.expected.text,
  ]);

  expect(chartJsResponses).toHaveLength(1);
  expect(chartJsResponses[0].status).toBeLessThan(400);
  expect(chartJsResponses[0].url).toBe(
    'https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js'
  );
});

// Counts the characters on each full line of every paragraph directly inside
// each block, spaces included; each paragraph's last line is dropped because
// it ends early. Also returns what the failure message needs to say which
// `ch` value would bring the average back to 66. Playwright runs it in the
// page, so it uses nothing from this file.
const measureReadingLines = (blocks) => blocks.map((block) => {
  const style = getComputedStyle(block);
  const lineLengths = [];
  let font = '';

  for (const paragraph of block.querySelectorAll(':scope > p')) {
    const paragraphStyle = getComputedStyle(paragraph);
    const lineHeight = parseFloat(paragraphStyle.lineHeight);
    const walker = document.createTreeWalker(paragraph, NodeFilter.SHOW_TEXT);
    const lines = [];
    let lineTop = null;
    let node;

    font = `${paragraphStyle.fontFamily.split(',')[0].replaceAll('"', '')} ${paragraphStyle.fontSize}`;

    while ((node = walker.nextNode())) {
      for (let index = 0; index < node.length; index += 1) {
        const range = document.createRange();
        range.setStart(node, index);
        range.setEnd(node, index + 1);
        const rect = range.getClientRects()[0];

        // Collapsed white space has no box and is not shown.
        if (!rect || rect.width === 0) {
          continue;
        }

        if (lineTop === null || rect.top > lineTop + lineHeight / 2) {
          lines.push(0);
          lineTop = rect.top;
        }

        lines[lines.length - 1] += 1;
      }
    }

    lineLengths.push(...lines.slice(0, -1));
  }

  const probe = document.createElement('span');
  probe.style.cssText = 'display: inline-block; inline-size: 1ch';
  block.append(probe);
  const chWidth = probe.getBoundingClientRect().width;
  probe.remove();

  const width = block.getBoundingClientRect().width;

  return {
    lineLengths,
    font,
    width,
    widthInCh: width / chWidth,
    // The screen, not the measure, sets the width when the block is narrower
    // than its max-inline-size.
    atMeasure: Math.abs(width - parseFloat(style.maxInlineSize)) < 1,
  };
});

// Running text whose width a $text-measure-* token caps
// (_sass/0-settings/_typography.scss). These blocks have no role or data hook;
// the class is what carries the measure.
const readingMeasureBlocks = [
  {
    name: 'post body',
    path: '/projects/field-notes-iceland-2025/',
    block: '.o-prose--measure-wide',
    checkEveryLine: true,
  },
  { name: 'About intro', path: '/about/', block: '.l-about__intro', checkEveryLine: true },
  {
    name: 'About sections',
    path: '/about/',
    block: '.l-about__section-body',
    checkEveryLine: true,
  },
  // A two-to-three-line lead: checked on its average only (#115).
  { name: 'home hero description', path: '/', block: '.c-hero__description', checkEveryLine: false },
];

// From a phone to a large desktop; 1024px is $bp-layout (64em).
const readingViewports = [390, 768, 1024, 1280, 1440];

for (const { name, path, block, checkEveryLine } of readingMeasureBlocks) {
  test(`${name} keeps lines within the reading measure at every viewport`, async ({ page }) => {
    for (const width of readingViewports) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${baseUrl}${path}`);
      await page.evaluate(() => document.fonts.ready);

      const measurements = await page.locator(block).evaluateAll(measureReadingLines);

      expect(measurements.length, `no ${block} on ${path}`).toBeGreaterThan(0);

      for (const [index, measured] of measurements.entries()) {
        const { lineLengths, font, widthInCh, atMeasure } = measured;
        const where = `${name} ${index + 1} at ${width}px (${font})`;

        expect(lineLengths.length, `${where} has no full line to measure`).toBeGreaterThan(0);

        const average = lineLengths.reduce((sum, length) => sum + length, 0) / lineLengths.length;
        const longest = Math.max(...lineLengths);
        // The ch value that would give Bringhurst's ideal of 66 characters.
        const suggestedCh = ((66 / average) * widthInCh).toFixed(1);
        const report = `${where}: average ${average.toFixed(1)}, longest ${longest}; about ${suggestedCh}ch would average 66`;

        // The maintainer's ceiling for the average (#115).
        expect(average, report).toBeLessThanOrEqual(75);

        // WCAG 2.1 SC 1.4.8: "Width is no more than 80 characters or glyphs".
        if (checkEveryLine) {
          expect(longest, report).toBeLessThanOrEqual(80);
        }

        // Bringhurst's lower bound of 45, where the measure, not the screen,
        // sets the width.
        if (atMeasure) {
          expect(average, report).toBeGreaterThanOrEqual(45);
        }
      }
    }
  });
}

// #102 measured these widths: just above $bp-layout (64em), where the rail
// is narrowest, up to where it last held whole words.
for (const width of [1024, 1032, 1100, 1180]) {
  test(`Contents rail keeps every link inside it and every word whole at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseUrl}/projects/field-notes-iceland-2025/`);
    await page.evaluate(() => document.fonts.ready);

    const rail = page.getByRole('navigation', { name: 'On this page' });
    const links = rail.getByRole('link');

    await expect(rail).toBeVisible();
    await expect(links).not.toHaveCount(0);

    const railBox = await rail.boundingBox();
    const problems = await links.evaluateAll((elements, right) => elements.flatMap((link) => {
      const found = [];

      if (link.scrollWidth > link.clientWidth || link.getBoundingClientRect().right > right + 0.5) {
        found.push(`"${link.textContent.trim()}" overflows the rail`);
      }

      // A word broken at a space, hyphen, or dash is whole; one broken
      // anywhere else spans two line boxes.
      for (const node of [...link.childNodes].filter((child) => child.nodeType === Node.TEXT_NODE)) {
        for (const match of node.textContent.matchAll(/[^\s\-–—]+/g)) {
          const range = document.createRange();
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          const lineTops = new Set([...range.getClientRects()].map((rect) => Math.round(rect.top)));

          if (lineTops.size > 1) {
            found.push(`"${match[0]}" is split across lines`);
          }
        }
      }

      return found;
    }), railBox.x + railBox.width);

    expect(problems).toEqual([]);
  });
}

// 768px is where the header stacks and the caption used to outgrow the photo.
for (const width of [390, 768, 1024, 1280]) {
  test(`About portrait caption stays within its photo's width at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseUrl}/about/`);
    await page.evaluate(() => document.fonts.ready);

    const portrait = page.getByRole('figure');
    await expect(portrait).toHaveCount(1);

    const overhang = await portrait.evaluate((figure) => {
      const photo = figure.querySelector('img').getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(figure.querySelector('figcaption'));
      const text = [...range.getClientRects()];

      return {
        left: photo.left - Math.min(...text.map((rect) => rect.left)),
        right: Math.max(...text.map((rect) => rect.right)) - photo.right,
      };
    });

    // A property, not a reference value: no caption text outside the photo.
    expect(overhang.left).toBeLessThanOrEqual(0.5);
    expect(overhang.right).toBeLessThanOrEqual(0.5);
  });
}
