const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const baseUrl = 'http://127.0.0.1:4000/eyvan';

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
});
