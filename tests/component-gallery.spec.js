const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const baseUrl = process.env.EYVAN_GALLERY_BASE_URL || 'http://127.0.0.1:4001/eyvan';

// Every fixture page in the component gallery, by ITCSS layer. The pages
// render only in the dev_only build that _config.gallery.yml overlays.
const galleryPages = [
  // 3-base: element defaults (headings, links, lists, media, code, tables).
  '/tests/3-base/base-elements/',
  // 4-objects: each layout object in _sass/4-objects.
  '/tests/4-objects/container/',
  '/tests/4-objects/grid/',
  '/tests/4-objects/hero/',
  '/tests/4-objects/test-prose/',
  '/tests/4-objects/site-footer/',
  '/tests/4-objects/site-header/',
  // 5-components: each component in _sass/5-components, with the variants
  // and states the demo content never renders.
  '/tests/5-components/test-404/',
  '/tests/5-components/test-back-to-top/',
  '/tests/5-components/test-brand/',
  '/tests/5-components/button/',
  '/tests/5-components/test-contact-card/',
  '/tests/5-components/test-entry-meta/',
  '/tests/5-components/test-hero/',
  '/tests/5-components/test-icon-link/',
  '/tests/5-components/test-label/',
  '/tests/5-components/test-mobile-menu/',
  '/tests/5-components/test-nav/',
  '/tests/5-components/test-page/',
  '/tests/5-components/test-post-card/',
  '/tests/5-components/test-post-navigation/',
  '/tests/5-components/test-post-share/',
  '/tests/5-components/test-post/',
  '/tests/5-components/test-prose-media/',
  '/tests/5-components/test-related-posts/',
  '/tests/5-components/test-section-heading/',
  '/tests/5-components/test-site-footer/',
  '/tests/5-components/test-site-header/',
  '/tests/5-components/test-social-links/',
  '/tests/5-components/test-tag/',
  '/tests/5-components/theme-toggle/',
  '/tests/5-components/test-toc/',
  // 7-trumps: the utilities and state hooks in _sass/7-trumps.
  '/tests/7-trumps/trumps/',
];

// Desktop as #95 decided, and the mobile size tests/accessibility.spec.js
// opens the mobile menu at (#96).
const viewports = [
  { width: 1280, height: 720 },
  { width: 390, height: 844 },
];

// This build sets a placeholder google_analytics ID (_config.gallery.yml), so
// a scan must never reach Google even if the tag loads without consent (#3).
// tests/analytics-consent.spec.js asserts that it does not.
const GOOGLE_HOST_SUFFIXES = [
  'googletagmanager.com',
  'google-analytics.com',
  'google.com',
  'doubleclick.net',
];

function isGoogleRequest(url) {
  return GOOGLE_HOST_SUFFIXES.some((suffix) => (
    url.hostname === suffix || url.hostname.endsWith(`.${suffix}`)
  ));
}

test.describe('Eyvan component gallery accessibility checks', () => {
  test.beforeEach(async ({ context }) => {
    await context.route(isGoogleRequest, (route) => route.abort());
  });

  test('the scan list names exactly the pages the /tests/ index links to', async ({ page }) => {
    await page.goto(`${baseUrl}/tests/`);

    const basePath = new URL(baseUrl).pathname;
    const linkedPages = await page
      .getByRole('main')
      .getByRole('listitem')
      .getByRole('link')
      .evaluateAll((links) => links.map((link) => new URL(link.href).pathname));

    expect(linkedPages.map((path) => path.slice(basePath.length)).sort()).toEqual([...galleryPages].sort());
  });

  for (const theme of ['light', 'dark']) {
    for (const viewport of viewports) {
      const size = `${viewport.width} x ${viewport.height}`;

      test.describe(`${theme} theme at ${size}`, () => {
        // The head script applies data-theme from prefers-color-scheme before
        // first paint, so no colour transition runs and no settle wait is needed.
        test.use({ colorScheme: theme, viewport });

        for (const path of galleryPages) {
          test(`${path} has no detectable axe violations in the ${theme} theme at ${size}`, async ({ page }, testInfo) => {
            await page.goto(`${baseUrl}${path}`);
            await expect(page.locator('html')).toHaveAttribute('data-theme', theme);

            const results = await new AxeBuilder({ page }).analyze();

            await testInfo.attach('axe incomplete', {
              body: JSON.stringify(results.incomplete, null, 2),
              contentType: 'application/json',
            });
            expect(results.violations).toEqual([]);
          });
        }
      });
    }
  }
});

// tests/5-components/test-entry-meta.html renders these entries from its front
// matter through the real _includes/entry-meta.html, so they test the include,
// unlike the static markup elsewhere on that page. The rule is the maintainer's
// decision on #1: a number of minutes, rounded to the nearest whole minute,
// shows as "N min read"; any other value keeps the computed estimate; an
// override never changes whether the read time appears.
test.describe('Entry meta read-time override', () => {
  const fixture = `${baseUrl}/tests/5-components/test-entry-meta/`;

  // Fixture entry id and the text the rule gives it.
  const overrides = [
    { id: 'integer', text: '12 min read' },
    { id: 'numeric-string', text: '7 min read' },
    { id: 'decimal', text: '2 min read' },
  ];
  // Fixture entries whose override is not a positive number of minutes.
  const fallbacks = ['empty-string', 'whitespace', 'false', 'zero', 'non-numeric-text'];

  // Playwright does not normalize whitespace when it matches a regular
  // expression, and read-time.html's template tags leave blank lines around
  // the text; the browser collapses them.
  const estimateText = /^\s*\d+ min read\s*$/;

  const readTime = (page, id) => page.locator(`[data-read-time-case="${id}"]`).getByText(/min read/);

  test('the read-time cases named here are exactly the entries the fixture renders', async ({ page }) => {
    await page.goto(fixture);

    const rendered = await page
      .locator('[data-read-time-case]')
      .evaluateAll((boxes) => boxes.map((box) => box.dataset.readTimeCase));

    expect(rendered.sort()).toEqual(
      ['no-override', 'no-content', ...overrides.map(({ id }) => id), ...fallbacks].sort(),
    );
  });

  test('without a read_time_override an entry shows its computed estimate as "N min read"', async ({ page }) => {
    await page.goto(fixture);

    await expect(readTime(page, 'no-override')).toHaveText(estimateText);
  });

  for (const { id, text } of overrides) {
    test(`read_time_override "${id}" replaces the estimate with "${text}"`, async ({ page }) => {
      await page.goto(fixture);

      await expect(readTime(page, id)).toHaveText(text);
    });
  }

  for (const id of fallbacks) {
    test(`read_time_override "${id}" keeps the computed estimate`, async ({ page }) => {
      await page.goto(fixture);

      // The same body as the no-override entry, so the estimate must be equal.
      const estimate = (await readTime(page, 'no-override').innerText()).trim();
      await expect(readTime(page, id)).toHaveText(estimateText);
      await expect(readTime(page, id)).toHaveText(estimate);
    });
  }

  test('an entry with no content shows no read time even with a read_time_override', async ({ page }) => {
    await page.goto(fixture);

    // Guard against passing because the entry was never rendered.
    await expect(page.locator('[data-read-time-case="no-content"]')).toBeVisible();
    await expect(readTime(page, 'no-content')).toHaveCount(0);
  });
});

// The same entry_meta object goes through the real _includes/entry-meta.html with
// show_read_time omitted, true, and false. Liquid 4.0.4's default filter turns
// false into true, which made the include ignore an explicit false (#150).
test.describe('Entry meta show_read_time argument', () => {
  const fixture = `${baseUrl}/tests/5-components/test-entry-meta/`;

  const entry = (page, argument) => page.locator(`[data-show-read-time-argument="${argument}"]`);

  test('an omitted show_read_time shows the read time', async ({ page }) => {
    await page.goto(fixture);

    await expect(entry(page, 'omitted').getByText(/min read/)).toHaveText(/^\s*\d+ min read\s*$/);
  });

  test('show_read_time=true shows the read time', async ({ page }) => {
    await page.goto(fixture);

    await expect(entry(page, 'true').getByText(/min read/)).toHaveText(/^\s*\d+ min read\s*$/);
  });

  test('show_read_time=false hides the read time but keeps the date', async ({ page }) => {
    await page.goto(fixture);

    // The date is the fixture entry's own, and proves the entry rendered.
    await expect(entry(page, 'false').locator('time')).toHaveText('March 30, 2026');
    await expect(entry(page, 'false').getByText(/min read/)).toHaveCount(0);
  });
});
