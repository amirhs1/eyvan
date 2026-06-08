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

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('post mobile TOC has no detectable axe violations after opening', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/projects/field-notes-iceland-2025/`);

    await page.locator('[data-toc-open]').click();

    const results = await new AxeBuilder({ page }).analyze();

    expect(results.violations).toEqual([]);
  });

  test('code-heavy page has no detectable axe violations in light and dark themes', async ({ page }) => {
    await page.goto(`${baseUrl}/projects/eyvan-front-matter-guide/`);

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
});