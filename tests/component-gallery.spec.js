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

test.describe('Eyvan component gallery accessibility checks', () => {
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
