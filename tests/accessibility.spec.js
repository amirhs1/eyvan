const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const baseUrl = process.env.EYVAN_BASE_URL || 'http://127.0.0.1:4000/eyvan';

const globalScriptNames = [
  'back-to-top.js',
  'mobile-menu.js',
  'overlay-isolation.js',
  'social-links-overflow.js',
  'theme-toggle.js',
];

async function localScriptNames(page) {
  return page.locator('script[src*="/assets/js/"]').evaluateAll((scripts) => (
    scripts
      .map((script) => new URL(script.src).pathname.split('/').pop())
      .sort()
  ));
}

test.describe('Eyvan interactive accessibility checks', () => {
  test('home page has no detectable axe violations', async ({ page }) => {
    await page.goto(`${baseUrl}/`);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('mobile menu has no detectable axe violations after opening', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/`);

    await page.locator('[data-nav-toggle]').click();

    const menu = page.locator('[data-mobile-menu]');
    await expect(menu).toHaveAttribute('role', 'dialog');
    await expect(menu).toHaveAttribute('aria-modal', 'true');
    await expect(menu).toHaveAttribute('aria-label', 'Site menu');
    expect(await menu.evaluate((element) => element.parentElement === document.body)).toBe(true);
    await expect(page.locator('#main-content')).toHaveJSProperty('inert', true);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);

    await page.locator('[data-nav-close]').click();
    await expect(page.locator('#main-content')).toHaveJSProperty('inert', false);
    await expect(page.locator('[data-nav-toggle]')).toBeFocused();
  });

  test('post mobile TOC has no detectable axe violations after opening', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/projects/field-notes-iceland-2025/`);

    await page.locator('[data-toc-open]').click();

    const mobileToc = page.locator('[data-mobile-toc]');
    await expect(mobileToc).toHaveAttribute('role', 'dialog');
    await expect(mobileToc).toHaveAttribute('aria-modal', 'true');
    await expect(mobileToc).toHaveAttribute('aria-labelledby', 'mobile-toc-header');
    await expect(page.locator('#main-content')).toHaveJSProperty('inert', true);

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);

    await page.keyboard.press('Escape');
    await expect(page.locator('#main-content')).toHaveJSProperty('inert', false);
    await expect(page.locator('[data-toc-open]')).toBeFocused();
  });

  // Together these two posts render every syntax-token family that has failed
  // contrast before: strings/numbers (front-matter guide) and comment/gutter
  // tokens (rate limiter), in both themes.
  const codeHeavyPages = [
    '/projects/eyvan-front-matter-guide/',
    '/projects/building-a-rate-limiter/',
  ];

  for (const path of codeHeavyPages) {
    test(`code-heavy page ${path} has no detectable axe violations in light and dark themes`, async ({ page }) => {
      await page.goto(`${baseUrl}${path}`);

      const lightResults = await new AxeBuilder({ page }).analyze();
      expect(lightResults.violations).toEqual([]);

      await page.locator('[data-theme-toggle]:visible').click();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

      // Outlast the 0.2s $transition-base color transition so axe samples
      // settled colors rather than mid-fade contrast as false-positive violations.
      await page.waitForTimeout(300);

      const darkResults = await new AxeBuilder({ page }).analyze();
      expect(darkResults.violations).toEqual([]);
    });
  }

  test('page-specific scripts load only when their features are rendered', async ({ page }) => {
    const cases = [
      {
        path: '/',
        expected: globalScriptNames,
      },
      {
        path: '/about/',
        expected: globalScriptNames,
      },
      {
        path: '/projects/building-a-rate-limiter/',
        expected: [
          ...globalScriptNames,
          'code-block-a11y.js',
          'mobile-toc.js',
          'post-share.js',
        ],
      },
      {
        path: '/projects/setting-up-eyvan/',
        expected: [
          ...globalScriptNames,
          'code-block-a11y.js',
          'mobile-toc.js',
          'post-share.js',
          'task-list-a11y.js',
        ],
      },
    ];

    for (const { path, expected } of cases) {
      await page.goto(`${baseUrl}${path}`);
      expect(await localScriptNames(page)).toEqual([...expected].sort());
    }
  });

  test('conditionally loaded enhancements remain interactive', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/projects/building-a-rate-limiter/`);

    const codeBlock = page.locator('pre.highlight').first();
    await expect(codeBlock).toHaveAttribute('data-code-block-a11y', 'true');
    await expect(codeBlock).toHaveAttribute('role', 'region');

    const shareToggle = page.locator('[data-overflow-toggle]:visible');
    await expect(shareToggle).toHaveCount(1);
    const sharePanelId = await shareToggle.getAttribute('aria-controls');
    const sharePanel = page.locator(`#${sharePanelId}`);

    await shareToggle.click();
    await expect(sharePanel).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(sharePanel).toBeHidden();
    await expect(shareToggle).toBeFocused();

    await page.goto(`${baseUrl}/projects/setting-up-eyvan/`);

    const taskCheckbox = page.locator('.task-list-item-checkbox').first();
    await expect(taskCheckbox).toHaveAttribute(
      'aria-label',
      'url and baseurl updated in _config.yml'
    );
  });
});
