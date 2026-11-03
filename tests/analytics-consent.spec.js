const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

// The consent banner renders only when google_analytics is set, which the
// gallery build does with a placeholder ID (_config.gallery.yml, #3).
const baseUrl = process.env.EYVAN_GALLERY_BASE_URL || 'http://127.0.0.1:4001/eyvan';

// Two ordinary pages, so a choice made on one can be checked on the next.
const firstPage = '/';
const nextPage = '/about/';
// A long post, where the back-to-top button appears once the page scrolls.
const postPage = '/projects/field-notes-iceland-2025/';

const STORAGE_KEY = 'eyvan_analytics_consent';
const GOOGLE_HOST_SUFFIXES = [
  'googletagmanager.com',
  'google-analytics.com',
  'google.com',
  'doubleclick.net',
];

function isGoogleHost(hostname) {
  return GOOGLE_HOST_SUFFIXES.some((suffix) => (
    hostname === suffix || hostname.endsWith(`.${suffix}`)
  ));
}

// Aborts every request that leaves the test server and records the ones bound
// for Google, so no test reaches an external host.
async function blockExternalRequests(context) {
  const localOrigin = new URL(baseUrl).origin;
  const googleRequests = [];

  await context.route((url) => url.origin !== localOrigin, (route) => {
    const url = new URL(route.request().url());

    if (isGoogleHost(url.hostname)) {
      googleRequests.push(url.href);
    }

    return route.abort();
  });

  return googleRequests;
}

// The loader URL from Google's gtag.js snippet, which the include loaded
// unconditionally before #3.
async function tagUrl(page) {
  const measurementId = await page
    .locator('script[data-analytics-id]')
    .getAttribute('data-analytics-id');

  return `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
}

function storedConsent(page) {
  return page.evaluate((key) => localStorage.getItem(key), STORAGE_KEY);
}

function banner(page) {
  return page.locator('[data-analytics-consent]');
}

function acceptButton(page) {
  return page.locator('[data-analytics-consent-accept]');
}

function declineButton(page) {
  return page.locator('[data-analytics-consent-decline]');
}

function manageButton(page) {
  return page.locator('[data-analytics-consent-manage]');
}

// How far the element's bottom edge reaches into the open banner, in CSS
// pixels; zero or less means it is clear of the banner.
async function overlapWithBanner(page, locator) {
  const bannerTop = (await banner(page).boundingBox()).y;
  const bottoms = await locator.evaluateAll((elements) => (
    elements.map((element) => element.getBoundingClientRect().bottom)
  ));

  return Math.round(Math.max(...bottoms) - bannerTop);
}

test.describe('Eyvan analytics consent', () => {
  test('no request reaches Google before the visitor chooses', async ({ context, page }) => {
    const googleRequests = await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);

    await expect(banner(page)).toBeVisible();
    expect(googleRequests).toEqual([]);
  });

  test('the consent script runs from the head before first paint', async ({ page }) => {
    await page.goto(`${baseUrl}${firstPage}`);

    // A classic script in <head>, without async or defer, runs before the
    // body renders, which is what keeps the banner from shifting the layout.
    const script = page.locator('head > script[data-analytics-id]');
    await expect(script).toHaveCount(1);
    await expect(script).not.toHaveAttribute('async');
    await expect(script).not.toHaveAttribute('defer');
    await expect(script).not.toHaveAttribute('type', 'module');
  });

  test('the consent banner is a labelled, non-modal region that comes before the site header in the page structure', async ({ page }) => {
    await page.goto(`${baseUrl}${firstPage}`);

    const consentBanner = banner(page);
    await expect(consentBanner).toHaveRole('region');
    await expect(consentBanner).toHaveAccessibleName(/\S/);
    await expect(consentBanner).not.toHaveAttribute('aria-modal');

    const siteHeader = await page.getByRole('banner').elementHandle();
    expect(await consentBanner.evaluate((element, header) => (
      Boolean(element.compareDocumentPosition(header) & Node.DOCUMENT_POSITION_FOLLOWING)
    ), siteHeader)).toBe(true);
  });

  test('the open banner is fixed to the bottom of the viewport', async ({ context, page }) => {
    await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));

    await expect(banner(page)).toHaveCSS('position', 'fixed');
    const box = await banner(page).boundingBox();
    expect(Math.round(box.y + box.height)).toBe(page.viewportSize().height);
  });

  // WCAG 2.2 SC 2.4.11 Focus Not Obscured (Minimum) forbids a fixed banner
  // hiding a focused element entirely; this checks the stricter property that
  // the element is fully clear of it.
  test('a link focused below the fold is scrolled clear of the open banner', async ({ context, page }) => {
    await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);
    await expect(banner(page)).toBeVisible();

    const lastLink = page.getByRole('main').getByRole('link').last();

    // Scrolls the link to sit behind the banner, then focuses it. Retries
    // until the script has measured the banner; blurring first makes each
    // focus() scroll again. Chromium centres a far off-screen element on
    // focus whatever the scroll padding, so the link must start behind it.
    await expect.poll(async () => {
      await page.evaluate(() => document.activeElement?.blur());
      await lastLink.evaluate((link) => {
        const bannerHeight = document
          .querySelector('[data-analytics-consent]')
          .getBoundingClientRect().height;
        const linkTop = link.getBoundingClientRect().top + window.scrollY;
        window.scrollTo(0, linkTop - (window.innerHeight - bannerHeight / 2));
      });
      const hiddenBefore = (await overlapWithBanner(page, lastLink)) > 0;
      await lastLink.focus();
      const clearAfter = (await overlapWithBanner(page, lastLink)) <= 0;
      return { hiddenBefore, clearAfter };
    }).toEqual({ hiddenBefore: true, clearAfter: true });
  });

  test('the end of the page scrolls clear of the open banner', async ({ context, page }) => {
    await blockExternalRequests(context);
    // The mobile size tests/accessibility.spec.js uses: the banner wraps
    // tallest there, while at desktop width the footer's own padding nearly
    // clears it.
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(`${baseUrl}${firstPage}`);
    await expect(banner(page)).toBeVisible();

    const footer = page.getByRole('contentinfo');
    const footerControls = footer.getByRole('link').or(footer.getByRole('button'));

    await expect.poll(async () => {
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      return overlapWithBanner(page, footerControls);
    }).toBeLessThanOrEqual(0);
  });

  test('the back-to-top button rises above the open banner', async ({ context, page }) => {
    await blockExternalRequests(context);

    await page.goto(`${baseUrl}${postPage}`);
    await expect(banner(page)).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight / 2));

    const backToTop = page.getByRole('link', { name: 'Back to top' });
    await expect(backToTop).toBeVisible();
    await expect.poll(() => overlapWithBanner(page, backToTop)).toBeLessThanOrEqual(0);
  });

  test('the banner opens without taking focus and is the next stop after the skip link', async ({ page }) => {
    await page.goto(`${baseUrl}${firstPage}`);

    await expect(banner(page)).toBeVisible();
    await expect(page.locator('body')).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(banner(page).locator(':focus')).toHaveCount(1);
  });

  test('accepting loads the Google tag on this page and on the next without the banner', async ({ context, page }) => {
    const googleRequests = await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);
    const expectedTagUrl = await tagUrl(page);

    await acceptButton(page).click();

    await expect(banner(page)).toBeHidden();
    await expect.poll(() => googleRequests).toEqual([expectedTagUrl]);
    expect(await storedConsent(page)).toBe('granted');

    await page.goto(`${baseUrl}${nextPage}`);

    await expect(banner(page)).toBeHidden();
    await expect.poll(() => googleRequests).toEqual([expectedTagUrl, expectedTagUrl]);
  });

  test('the Google tag loads with the advertising signals denied', async ({ context, page }) => {
    await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);
    await acceptButton(page).click();

    // D3 on #3: the banner asks about analytics only.
    const consentDefault = await page.evaluate(() => Array.from(window.dataLayer[0]));
    expect(consentDefault).toEqual(['consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    }]);
  });

  test('declining loads nothing on this page or the next', async ({ context, page }) => {
    const googleRequests = await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);
    await declineButton(page).click();

    await expect(banner(page)).toBeHidden();
    expect(await storedConsent(page)).toBe('denied');

    await page.goto(`${baseUrl}${nextPage}`);

    await expect(banner(page)).toBeHidden();
    expect(googleRequests).toEqual([]);
  });

  test('a keyboard choice in the banner moves focus to the main content', async ({ context, page }) => {
    await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);
    await declineButton(page).focus();
    await page.keyboard.press('Enter');

    await expect(banner(page)).toBeHidden();
    await expect(page.locator('#main-content')).toBeFocused();
  });

  test('the preferences button reopens the banner with focus and gets focus back after a choice', async ({ context, page }) => {
    await blockExternalRequests(context);

    await page.goto(`${baseUrl}${firstPage}`);
    await declineButton(page).click();

    await expect(manageButton(page)).toBeVisible();
    await manageButton(page).focus();
    await page.keyboard.press('Enter');

    await expect(banner(page)).toBeVisible();
    await expect(banner(page)).toBeFocused();

    await declineButton(page).focus();
    await page.keyboard.press('Enter');

    await expect(banner(page)).toBeHidden();
    await expect(manageButton(page)).toBeFocused();
  });

  test('declining after accepting deletes the _ga cookies and stops the Google tag', async ({ context, page }) => {
    const googleRequests = await blockExternalRequests(context);
    const url = new URL(baseUrl).origin;

    // The aborted tag never sets cookies, so seed the two GA4 cookie names and
    // one unrelated cookie that must survive.
    await context.addCookies([
      { name: '_ga', value: 'GA1.1.0.0', url },
      { name: '_ga_TEST', value: 'GS1.1.0', url },
      { name: 'unrelated', value: '1', url },
    ]);

    await page.goto(`${baseUrl}${firstPage}`);
    await acceptButton(page).click();
    await expect.poll(() => googleRequests.length).toBe(1);

    await manageButton(page).click();
    await Promise.all([
      page.waitForEvent('load'),
      declineButton(page).click(),
    ]);

    expect(await storedConsent(page)).toBe('denied');
    expect((await context.cookies()).map((cookie) => cookie.name)).toEqual(['unrelated']);
    await expect(banner(page)).toBeHidden();
    expect(googleRequests.length).toBe(1);
  });

  test('a choice in one tab applies to the other open tabs', async ({ context }) => {
    const googleRequests = await blockExternalRequests(context);
    const firstTab = await context.newPage();
    const otherTab = await context.newPage();

    await firstTab.goto(`${baseUrl}${firstPage}`);
    await otherTab.goto(`${baseUrl}${nextPage}`);
    await acceptButton(firstTab).click();

    await expect(banner(otherTab)).toBeHidden();
    await expect.poll(() => googleRequests.length).toBe(2);
  });

  test('blocked storage loads nothing and shows no banner or preferences button', async ({ context, page }) => {
    const googleRequests = await blockExternalRequests(context);

    await context.addInitScript(() => {
      Object.defineProperty(window, 'localStorage', {
        get() {
          throw new DOMException('Storage is blocked', 'SecurityError');
        },
      });
    });

    await page.goto(`${baseUrl}${firstPage}`);

    await expect(banner(page)).toBeHidden();
    await expect(manageButton(page)).toBeHidden();
    expect(googleRequests).toEqual([]);
  });

  test('the banner is inert while the mobile menu is open', async ({ context, page }) => {
    await blockExternalRequests(context);
    await page.setViewportSize({ width: 390, height: 844 });

    await page.goto(`${baseUrl}${firstPage}`);
    await page.locator('[data-nav-toggle]').click();

    await expect(page.locator('[data-mobile-menu]')).toBeVisible();
    expect(await banner(page).evaluate((element) => Boolean(element.closest('[inert]')))).toBe(true);
  });

  test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });

    test('nothing loads and no banner or preferences button shows', async ({ context, page }) => {
      const googleRequests = await blockExternalRequests(context);

      await page.goto(`${baseUrl}${firstPage}`);

      await expect(banner(page)).toBeHidden();
      await expect(manageButton(page)).toBeHidden();
      expect(googleRequests).toEqual([]);
    });
  });

  for (const theme of ['light', 'dark']) {
    test.describe(`${theme} theme`, () => {
      // The head script applies data-theme from prefers-color-scheme before
      // first paint, so no colour transition runs and no settle wait is needed.
      test.use({ colorScheme: theme });

      test(`the open banner has no detectable axe violations in the ${theme} theme`, async ({ context, page }, testInfo) => {
        await blockExternalRequests(context);

        await page.goto(`${baseUrl}${firstPage}`);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(banner(page)).toBeVisible();

        const results = await new AxeBuilder({ page }).analyze();

        await testInfo.attach('axe incomplete', {
          body: JSON.stringify(results.incomplete, null, 2),
          contentType: 'application/json',
        });
        expect(results.violations).toEqual([]);
      });

      // axe reports the fixed banner's text contrast as incomplete, because
      // the banner overlaps page content. scripts/check-color-contract.rb
      // checks on-surface on surface-container-low (SURFACE_TEXT_PAIRS,
      // WCAG 2.1 SC 1.4.3, 4.5:1), so this asserts the banner keeps that pair.
      test(`the banner text keeps the colour pair the colour contract checks in the ${theme} theme`, async ({ context, page }) => {
        await blockExternalRequests(context);

        await page.goto(`${baseUrl}${firstPage}`);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await expect(banner(page)).toBeVisible();

        const colours = await banner(page).evaluate((element) => {
          const resolve = (property, token) => {
            const probe = document.createElement('span');
            probe.style[property] = `var(${token})`;
            document.body.append(probe);
            const value = getComputedStyle(probe)[property];
            probe.remove();
            return value;
          };

          return {
            text: getComputedStyle(element.querySelector('p')).color,
            background: getComputedStyle(element).backgroundColor,
            onSurface: resolve('color', '--color-on-surface'),
            surfaceContainerLow: resolve('backgroundColor', '--color-surface-container-low'),
          };
        });

        expect(colours.text).toBe(colours.onSurface);
        expect(colours.background).toBe(colours.surfaceContainerLow);
      });

      test(`the closed banner and preferences button have no detectable axe violations in the ${theme} theme`, async ({ context, page }, testInfo) => {
        await blockExternalRequests(context);

        await page.goto(`${baseUrl}${firstPage}`);
        await expect(page.locator('html')).toHaveAttribute('data-theme', theme);
        await declineButton(page).click();
        await expect(manageButton(page)).toBeVisible();

        const results = await new AxeBuilder({ page }).analyze();

        await testInfo.attach('axe incomplete', {
          body: JSON.stringify(results.incomplete, null, 2),
          contentType: 'application/json',
        });
        expect(results.violations).toEqual([]);
      });
    });
  }
});
