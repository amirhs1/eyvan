const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// Search is off in _config.yml; _config.gallery.yml turns it on, and
// `npm run search:index:gallery` writes the Pagefind index into that build.
const baseUrl = process.env.EYVAN_GALLERY_BASE_URL || 'http://127.0.0.1:4001/eyvan';
const basePath = new URL(baseUrl).pathname;

// "kramdown" appears in the body of exactly these two posts and in no post's
// title, subtitle, or tags (grep -il kramdown _posts/*.md, front matter
// checked separately), so finding them shows the full text is indexed.
const bodyOnlyTerm = 'kramdown';
const bodyOnlyPosts = [
  '/projects/eyvan-design-and-architecture/',
  '/projects/eyvan-front-matter-guide/',
];

function searchField(page) {
  return page.getByRole('main').getByRole('searchbox', { name: 'Search posts' });
}

async function resultPaths(page) {
  return page
    .locator('[data-search-results]')
    .getByRole('link')
    .evaluateAll((links) => links.map((link) => new URL(link.href).pathname));
}

async function search(page, term) {
  await page.goto(`${baseUrl}/search/`);
  await searchField(page).fill(term);
  await expect(page.getByRole('status')).toContainText(`for “${term}”`);
}

test.describe('Eyvan search', () => {
  test('a word found only in post bodies finds exactly those posts', async ({ page }) => {
    await search(page, bodyOnlyTerm);

    await expect(page.getByRole('status')).toHaveText(`2 results for “${bodyOnlyTerm}”.`);
    expect((await resultPaths(page)).sort()).toEqual(bodyOnlyPosts.map((path) => `${basePath}${path}`).sort());
  });

  // A property: every indexed page is a post, so every result sits under
  // /projects/ inside the baseurl, and no /tests/ fixture page is indexed even
  // though this dev_only build renders them.
  test('results link only to posts under the baseurl, never to test pages', async ({ page }) => {
    await search(page, 'eyvan');

    const more = page.getByRole('button', { name: 'Show more results' });
    while (await more.isVisible()) {
      await more.click();
    }

    const paths = await resultPaths(page);
    expect(paths.length).toBeGreaterThan(0);
    for (const path of paths) {
      expect(path.startsWith(`${basePath}/projects/`), path).toBe(true);
    }
  });

  test('the status line says when nothing matches', async ({ page }) => {
    await search(page, 'zzqxjv');

    await expect(page.getByRole('status')).toHaveText('No results for “zzqxjv”.');
    await expect(page.locator('[data-search-results]').getByRole('listitem')).toHaveCount(0);
  });

  test('the search field has focus when the search page loads', async ({ page }) => {
    await page.goto(`${baseUrl}/search/`);

    await expect(searchField(page)).toBeFocused();
  });

  test('a ?q= address fills the field and runs the search on load', async ({ page }) => {
    await page.goto(`${baseUrl}/search/?q=${bodyOnlyTerm}`);

    await expect(searchField(page)).toHaveValue(bodyOnlyTerm);
    await expect(page.getByRole('status')).toHaveText(`2 results for “${bodyOnlyTerm}”.`);
  });

  test('typing keeps ?q= in the address without adding history entries', async ({ page }) => {
    await page.goto(`${baseUrl}/search/`);
    const historyLength = await page.evaluate(() => window.history.length);

    await searchField(page).fill(bodyOnlyTerm);
    await expect(page.getByRole('status')).toContainText(`for “${bodyOnlyTerm}”`);

    await expect(page).toHaveURL(`${baseUrl}/search/?q=${bodyOnlyTerm}`);
    expect(await page.evaluate(() => window.history.length)).toBe(historyLength);
  });

  test('the search page has one search landmark', async ({ page }) => {
    await page.goto(`${baseUrl}/search/`);
    await expect(searchField(page)).toBeVisible();

    await expect(page.getByRole('search')).toHaveCount(1);
  });

  test('the status line reports a failure when the index cannot load', async ({ page }) => {
    await page.route(`${baseUrl}/pagefind/**`, (route) => route.abort());
    await page.goto(`${baseUrl}/search/`);

    await expect(page.getByRole('status')).toHaveText('Search could not load.');
    await expect(page.locator('[data-search-notice]').getByRole('link', { name: 'Projects' })).toBeVisible();
    await expect(searchField(page)).toBeHidden();
  });

  test('search.js and the Pagefind bundle load only on the search page', async ({ page }) => {
    const requested = [];
    page.on('request', (request) => requested.push(new URL(request.url()).pathname));

    await page.goto(`${baseUrl}/`);
    await page.waitForLoadState('networkidle');
    expect(requested.filter((path) => path.endsWith('/search.js') || path.includes('/pagefind/'))).toEqual([]);

    await page.goto(`${baseUrl}/search/`);
    await expect(searchField(page)).toBeVisible();
    expect(requested).toContain(`${basePath}/assets/js/search.js`);
    expect(requested).toContain(`${basePath}/pagefind/pagefind.js`);
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('the search page offers Projects and tag links instead of the form', async ({ page }) => {
      await page.goto(`${baseUrl}/search/`);

      const notice = page.locator('[data-search-notice]');
      await expect(notice).toContainText('Search needs JavaScript');
      await expect(notice.getByRole('link', { name: 'Projects' })).toBeVisible();
      // Every link after Projects is a tag page; the demo posts carry tags.
      await expect(notice.getByRole('link').nth(1)).toHaveAttribute('href', /\/tag\//);
      await expect(searchField(page)).toBeHidden();
    });
  });

  test.describe('header link at 1280 px', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('the header search link opens the search page and is current there', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      const link = page.getByRole('banner').getByRole('link', { name: 'Search', exact: true });
      await expect(link).not.toHaveAttribute('aria-current', 'page');

      await link.click();

      await expect(page).toHaveURL(`${baseUrl}/search/`);
      await expect(
        page.getByRole('banner').getByRole('link', { name: 'Search', exact: true })
      ).toHaveAttribute('aria-current', 'page');
    });
  });

  // A property with no reference value: adding the search link must not make
  // any two header parts overlap at the desktop widths the mock-ups checked.
  for (const width of [1024, 1280, 1440]) {
    test(`header parts do not overlap at ${width} px with search on`, async ({ page }) => {
      await page.setViewportSize({ width, height: 720 });
      await page.goto(`${baseUrl}/`);

      const banner = page.getByRole('banner');
      const navLinks = banner.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link');
      const parts = [
        ['brand', banner.getByRole('link').first()],
        ['theme toggle', banner.locator('[data-theme-toggle]')],
        ...(await navLinks.all()).map((link, index) => [`nav link ${index + 1}`, link]),
        ['social links', banner.getByRole('navigation', { name: 'Header social links' })],
        ['search link', banner.getByRole('link', { name: 'Search', exact: true })],
      ];
      const boxes = [];
      for (const [name, locator] of parts) {
        boxes.push([name, await locator.boundingBox()]);
      }

      const overlaps = [];
      boxes.forEach(([a, r], i) => boxes.slice(i + 1).forEach(([b, s]) => {
        if (r.x < s.x + s.width && s.x < r.x + r.width && r.y < s.y + s.height && s.y < r.y + r.height) {
          overlaps.push(`${a} / ${b}`);
        }
      }));

      expect(overlaps).toEqual([]);
    });
  }

  test.describe('mobile menu at 390 px', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('the mobile menu search sends its query to the search page', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.locator('[data-nav-toggle]').click();

      const menu = page.locator('[data-mobile-menu]');
      await menu.getByRole('searchbox', { name: 'Search posts' }).fill(bodyOnlyTerm);
      await menu.getByRole('button', { name: 'Search', exact: true }).click();

      await expect(page).toHaveURL(`${baseUrl}/search/?q=${bodyOnlyTerm}`);
      await expect(page.getByRole('status')).toHaveText(`2 results for “${bodyOnlyTerm}”.`);
    });

    test('Tab moves from the menu close button to its search field', async ({ page }) => {
      await page.goto(`${baseUrl}/`);
      await page.locator('[data-nav-toggle]').click();
      await page.locator('[data-nav-close]').focus();

      await page.keyboard.press('Tab');

      await expect(
        page.locator('[data-mobile-menu]').getByRole('searchbox', { name: 'Search posts' })
      ).toBeFocused();
    });

    test('the mobile menu leaves out its search form on the search page', async ({ page }) => {
      await page.goto(`${baseUrl}/search/`);
      await page.locator('[data-nav-toggle]').click();

      await expect(page.locator('[data-mobile-menu]').getByRole('search')).toHaveCount(0);
    });
  });

  for (const theme of ['light', 'dark']) {
    test.describe(`${theme} theme`, () => {
      // The head script applies data-theme from prefers-color-scheme before
      // first paint, so no colour transition runs and no settle wait is needed.
      test.use({ colorScheme: theme });

      test(`the search page has no detectable axe violations before a search in the ${theme} theme`, async ({ page }, testInfo) => {
        await page.goto(`${baseUrl}/search/`);
        await expect(searchField(page)).toBeVisible();

        const results = await new AxeBuilder({ page }).analyze();

        await testInfo.attach('axe-incomplete', {
          body: JSON.stringify(results.incomplete, null, 2),
          contentType: 'application/json',
        });
        expect(results.violations).toEqual([]);
      });

      test(`the search page has no detectable axe violations with results in the ${theme} theme`, async ({ page }, testInfo) => {
        await search(page, bodyOnlyTerm);
        await expect(page.locator('[data-search-results]').getByRole('listitem')).toHaveCount(2);

        const results = await new AxeBuilder({ page }).analyze();

        await testInfo.attach('axe-incomplete', {
          body: JSON.stringify(results.incomplete, null, 2),
          contentType: 'application/json',
        });
        expect(results.violations).toEqual([]);
      });
    });
  }
});
