/*
Analytics Consent Script
Purpose:
Load Google Analytics only after the visitor accepts, and let them change
that choice later.

Features:
- Reads the stored choice before first paint and opens the banner when there is none
- Loads the Google tag only when the stored choice is "granted"
- Accept stores "granted" and loads the Google tag on the current page
- Decline stores "denied" and deletes the _ga and _ga_* cookies
- Declining after the tag has loaded reloads the page so the tag stops
- Manage buttons reopen the banner and move focus to it
- Returns focus to the control that opened the banner, else to the main content
- Synchronizes the choice across browser tabs
- Loads nothing and shows no banner when storage is unavailable
- Publishes the open banner's height as --consent-banner-block-size, so the
  page can keep content and focused elements clear of the fixed banner

Usage:
- Load from <head> as a classic script, without defer or async, so the
  choice is applied before first paint:
  <script src=".../analytics-consent.js" data-analytics-id="G-XXXXXXXXXX"></script>

Dependencies:
- script[data-analytics-id]
- [data-analytics-consent]
- [data-analytics-consent-accept]
- [data-analytics-consent-decline]
- [data-analytics-consent-manage]
- html[data-analytics-consent-open]
- #main-content

Related component:
- _includes/google-analytics.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Consent constants and shared references
     ========================================================================== */

  const STORAGE_KEY = 'eyvan_analytics_consent';
  const CONSENT_GRANTED = 'granted';
  const CONSENT_DENIED = 'denied';
  const OPEN_ATTRIBUTE = 'data-analytics-consent-open';
  const SIZE_PROPERTY = '--consent-banner-block-size';
  const TAG_URL = 'https://www.googletagmanager.com/gtag/js';

  const root = document.documentElement;
  const measurementId =
    document.currentScript?.getAttribute('data-analytics-id')?.trim() || '';

  let isStorageAvailable = true;
  let hasLoadedTag = false;
  let returnFocusTarget = null;

  /* ==========================================================================
     Consent storage helpers
     ========================================================================== */

  function isValidConsent(value) {
    return value === CONSENT_GRANTED || value === CONSENT_DENIED;
  }

  function getStoredConsent() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return isValidConsent(value) ? value : null;
    } catch (error) {
      isStorageAvailable = false;
      return null;
    }
  }

  function persistConsent(consent) {
    try {
      localStorage.setItem(STORAGE_KEY, consent);
      return true;
    } catch (error) {
      isStorageAvailable = false;
      return false;
    }
  }

  function forgetConsent() {
    // Used when "denied" cannot be written, so a stale "granted" cannot load
    // the tag again on the next page.
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      // Ignore storage failures gracefully.
    }
  }

  /* ==========================================================================
     Google tag loading and cookie removal
     ========================================================================== */

  function loadTag() {
    if (hasLoadedTag || !measurementId) {
      return;
    }

    hasLoadedTag = true;

    window.dataLayer = window.dataLayer || [];

    // gtag.js reads Arguments objects from the data layer, not arrays, so
    // this keeps the function form of Google's snippet.
    window.gtag = function gtag() {
      window.dataLayer.push(arguments);
    };

    // The banner asks about analytics only, so the advertising signals stay
    // denied.
    window.gtag('consent', 'default', {
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', measurementId);

    const script = document.createElement('script');
    script.async = true;
    script.src = `${TAG_URL}?id=${encodeURIComponent(measurementId)}`;
    document.head.appendChild(script);
  }

  function getAnalyticsCookieNames() {
    return document.cookie
      .split(';')
      .map((cookie) => cookie.split('=')[0].trim())
      .filter((name) => name === '_ga' || name.startsWith('_ga_'));
  }

  function getCookieDomains() {
    const labels = window.location.hostname.split('.');
    const domains = [''];

    // The Google tag sets its cookies on the widest domain the browser
    // accepts, so try the host itself and every parent domain.
    for (let index = 0; index < labels.length - 1; index += 1) {
      domains.push(`; domain=${labels.slice(index).join('.')}`);
    }

    return domains;
  }

  function clearAnalyticsCookies() {
    const domains = getCookieDomains();

    getAnalyticsCookieNames().forEach((name) => {
      domains.forEach((domain) => {
        document.cookie =
          `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
      });
    });
  }

  /* ==========================================================================
     Banner state and focus
     ========================================================================== */

  function getBanner() {
    return document.querySelector('[data-analytics-consent]');
  }

  function getMainContent() {
    return document.getElementById('main-content');
  }

  function isBannerOpen() {
    return root.hasAttribute(OPEN_ATTRIBUTE);
  }

  function updateBannerSize() {
    const banner = getBanner();
    const size = banner && isBannerOpen()
      ? Math.ceil(banner.getBoundingClientRect().height)
      : 0;

    root.style.setProperty(SIZE_PROPERTY, `${size}px`);
  }

  function openBanner() {
    root.setAttribute(OPEN_ATTRIBUTE, '');
    updateBannerSize();
  }

  function focusElement(element, options) {
    if (!element) {
      return;
    }

    if (!element.matches('a[href], button, input, select, textarea, [tabindex]')) {
      element.setAttribute('tabindex', '-1');
    }

    element.focus(options);
  }

  function closeBanner() {
    const banner = getBanner();
    const hadFocus = Boolean(banner?.contains(document.activeElement));

    root.removeAttribute(OPEN_ATTRIBUTE);
    updateBannerSize();

    if (!hadFocus) {
      returnFocusTarget = null;
      return;
    }

    if (returnFocusTarget?.isConnected && !returnFocusTarget.hidden) {
      focusElement(returnFocusTarget);
    } else {
      focusElement(getMainContent(), { preventScroll: true });
    }

    returnFocusTarget = null;
  }

  function hideManageButtons() {
    document.querySelectorAll('[data-analytics-consent-manage]').forEach((button) => {
      button.hidden = true;
    });
  }

  function handleStorageFailure() {
    root.removeAttribute(OPEN_ATTRIBUTE);
    updateBannerSize();
    hideManageButtons();
  }

  /* ==========================================================================
     Consent actions
     ========================================================================== */

  function acceptAnalytics() {
    if (!persistConsent(CONSENT_GRANTED)) {
      handleStorageFailure();
      return;
    }

    closeBanner();
    loadTag();
  }

  function declineAnalytics() {
    const didPersist = persistConsent(CONSENT_DENIED);

    if (!didPersist) {
      forgetConsent();
    }

    clearAnalyticsCookies();

    if (hasLoadedTag) {
      window.location.reload();
      return;
    }

    if (!didPersist) {
      handleStorageFailure();
      return;
    }

    closeBanner();
  }

  function manageAnalytics(event) {
    const banner = getBanner();

    if (!banner) {
      return;
    }

    returnFocusTarget = event.currentTarget;
    openBanner();
    focusElement(banner);
  }

  /* ==========================================================================
     Event binding
     ========================================================================== */

  function bindBannerButtons() {
    document.querySelectorAll('[data-analytics-consent-accept]').forEach((button) => {
      button.addEventListener('click', acceptAnalytics);
    });

    document.querySelectorAll('[data-analytics-consent-decline]').forEach((button) => {
      button.addEventListener('click', declineAnalytics);
    });
  }

  function bindManageButtons() {
    document.querySelectorAll('[data-analytics-consent-manage]').forEach((button) => {
      button.addEventListener('click', manageAnalytics);
      button.hidden = false;
    });
  }

  function bindBannerResize() {
    const banner = getBanner();

    if (!banner) {
      return;
    }

    // The banner's height changes as its text wraps, so track it rather than
    // measuring once.
    if (typeof window.ResizeObserver === 'function') {
      new ResizeObserver(updateBannerSize).observe(banner);
    } else {
      window.addEventListener('resize', updateBannerSize);
    }

    updateBannerSize();
  }

  function bindStorageListener() {
    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      if (event.newValue === CONSENT_GRANTED) {
        closeBanner();
        loadTag();
        return;
      }

      if (hasLoadedTag) {
        window.location.reload();
        return;
      }

      if (event.newValue === CONSENT_DENIED) {
        closeBanner();
      } else {
        openBanner();
      }
    });
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  function initAnalyticsConsent() {
    if (!isStorageAvailable) {
      return;
    }

    bindBannerButtons();
    bindManageButtons();
    bindBannerResize();
    bindStorageListener();
  }

  if (!measurementId) {
    return;
  }

  const storedConsent = getStoredConsent();

  if (storedConsent === CONSENT_GRANTED) {
    loadTag();
  } else if (storedConsent === null && isStorageAvailable) {
    openBanner();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAnalyticsConsent, {
      once: true
    });
  } else {
    initAnalyticsConsent();
  }
})();
