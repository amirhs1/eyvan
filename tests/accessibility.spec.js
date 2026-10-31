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

  // 1280px is past $bp-layout (64em), where CSS hides the overlays and toggles.
  const overlaysClosedAtLayoutBreakpoint = [
    {
      name: 'mobile menu',
      path: '/',
      toggle: '[data-nav-toggle]',
      overlay: '[data-mobile-menu]',
    },
    {
      name: 'post mobile TOC',
      path: '/projects/field-notes-iceland-2025/',
      toggle: '[data-toc-open]',
      overlay: '[data-mobile-toc]',
    },
  ];

  for (const { name, path, toggle, overlay } of overlaysClosedAtLayoutBreakpoint) {
    test(`${name} closes and releases the page when the layout breakpoint starts matching`, async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseUrl}${path}`);

      await page.locator(toggle).click();
      await expect(page.locator(overlay)).toBeVisible();

      await page.setViewportSize({ width: 1280, height: 900 });

      await expect(page.locator(toggle)).toHaveAttribute('aria-expanded', 'false');
      await expect(page.locator(overlay)).toHaveJSProperty('hidden', true);
      await expect(page.locator('body > [inert]')).toHaveCount(0);
      await expect(page.getByRole('main')).toBeFocused();

      await page.mouse.move(640, 450);
      await page.mouse.wheel(0, 400);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
    });
  }

  // $bp-layout is 64em, 1024px at the default 16px font size
  // (_sass/0-settings/_breakpoints.scss). The desktop post chrome owns the
  // breakpoint value itself (#77), so 1024px gets only the desktop chrome and
  // 1023px only the mobile chrome; the two never apply together.
  const postChromeAtLayoutBreakpoint = [
    { width: 1024, chrome: 'desktop' },
    { width: 1023, chrome: 'mobile' },
  ];

  for (const { width, chrome } of postChromeAtLayoutBreakpoint) {
    test(`post shows only the ${chrome} chrome at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${baseUrl}/projects/field-notes-iceland-2025/`);

      const mobileToolbar = page.locator('[data-toc-toolbar]');
      const desktopToc = page.getByRole('navigation', { name: 'On this page' });
      // The desktop share rail is the share group outside the mobile toolbar;
      // this post has a TOC, so the header renders no share group.
      const desktopShareRail = page
        .getByLabel('Share this post')
        .and(page.locator(':not([data-toc-toolbar] *)'));

      const isDesktop = chrome === 'desktop';
      await expect(mobileToolbar).toBeVisible({ visible: !isDesktop });
      await expect(desktopToc).toBeVisible({ visible: isDesktop });
      await expect(desktopShareRail).toBeVisible({ visible: isDesktop });
    });
  }

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

  // Property test, no reference value: the native widgets' scheme must match
  // the palette in use, whatever the operating system prefers (issue #78).
  const rootColorScheme = (page) => (
    page.evaluate(() => getComputedStyle(document.documentElement).colorScheme)
  );

  test('color-scheme matches the chosen theme, including after the toggle switches it', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`${baseUrl}/`);

    const root = page.locator('html');
    const toggle = page.locator('[data-theme-toggle]:visible');

    await expect(root).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => rootColorScheme(page)).toBe('dark');

    await toggle.click();
    await expect(root).toHaveAttribute('data-theme', 'light');
    await expect.poll(() => rootColorScheme(page)).toBe('light');

    await toggle.click();
    await expect(root).toHaveAttribute('data-theme', 'dark');
    await expect.poll(() => rootColorScheme(page)).toBe('dark');
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false, colorScheme: 'dark' });

    test('color-scheme stays light, matching the light palette that applies without data-theme', async ({ page }) => {
      await page.goto(`${baseUrl}/`);

      await expect(page.locator('html')).not.toHaveAttribute('data-theme');
      await expect.poll(() => rootColorScheme(page)).toBe('light');
    });
  });

  // These five posts have prose tables that overflow a 390px viewport; an axe
  // sweep found scrollable-region-focusable on each of them there (issue #71).
  const wideTablePages = [
    '/projects/building-a-rate-limiter/',
    '/projects/climate-data-analysis/',
    '/projects/eyvan-front-matter-guide/',
    '/projects/eyvan-design-and-architecture/',
    '/projects/setting-up-eyvan/',
  ];

  for (const path of wideTablePages) {
    test(`wide-table page ${path} has no detectable axe violations at 390px in light and dark themes`, async ({ page }, testInfo) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseUrl}${path}`);

      const lightResults = await new AxeBuilder({ page }).analyze();
      await testInfo.attach('axe-incomplete-light', {
        body: JSON.stringify(lightResults.incomplete, null, 2),
        contentType: 'application/json',
      });
      expect(lightResults.violations).toEqual([]);

      // At 390px the only theme toggle sits inside the closed mobile menu, so
      // load the dark theme the head bootstrap picks from prefers-color-scheme.
      await page.emulateMedia({ colorScheme: 'dark' });
      await page.reload();
      await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

      const darkResults = await new AxeBuilder({ page }).analyze();
      await testInfo.attach('axe-incomplete-dark', {
        body: JSON.stringify(darkResults.incomplete, null, 2),
        contentType: 'application/json',
      });
      expect(darkResults.violations).toEqual([]);
    });
  }

  test('overflowing prose tables are focusable, named, and still exposed as tables', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseUrl}/projects/eyvan-front-matter-guide/`);

    // Select by markup, not getByRole('table'), so a table that lost its role
    // fails the role assertion instead of silently dropping out of the set.
    const tables = page.locator('.o-prose table');
    const overflowing = await tables.evaluateAll((elements) => (
      elements
        .map((element, index) => (element.scrollWidth > element.clientWidth ? index : -1))
        .filter((index) => index >= 0)
    ));
    expect(overflowing.length).toBeGreaterThan(0);

    for (const index of overflowing) {
      const table = tables.nth(index);
      await expect(table).toHaveRole('table');
      await expect(table).toHaveAccessibleName(/\S/);
      await expect(table).toHaveAttribute('tabindex', '0');
      await table.focus();
      await expect(table).toBeFocused();
    }
  });

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
