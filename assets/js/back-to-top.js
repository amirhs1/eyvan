/*
Back-to-top Script
Purpose:
Provide visibility behavior for the fixed back-to-top control.

Features:
- Shows the back-to-top control only after the user scrolls down
- Hides the control while the user is near the top of the page
- Hides the control when the site footer enters the viewport
- Prevents the fixed control from visually overlapping the footer
- Fails safely when the back-to-top wrapper is missing

Dependencies:
- [data-back-to-top-wrap]
- [data-back-to-top]
- .c-site-footer

Related component:
- _includes/back-to-top.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Back-to-top constants
     ========================================================================== */

  const BACK_TO_TOP_WRAP_SELECTOR = '[data-back-to-top-wrap]';
  const BACK_TO_TOP_LINK_SELECTOR = '[data-back-to-top]';
  const FOOTER_SELECTOR = '.c-site-footer';
  const HEADER_SELECTOR = '.c-site-header';
  const HIDDEN_CLASS = 'is-back-to-top-hidden';
  const VISIBLE_SCROLL_THRESHOLD = 240;
  const VISUAL_GAP = 24;

  /* ==========================================================================
     Back-to-top state
     ========================================================================== */

  let footerIsVisible = false;

  /* ==========================================================================
     Back-to-top lookup helpers
     ========================================================================== */

  function getBackToTopWrap() {
    return document.querySelector(BACK_TO_TOP_WRAP_SELECTOR);
  }

  function getFooter() {
    return document.querySelector(FOOTER_SELECTOR);
  }

  function getBackToTopLink(backToTopWrap) {
    return backToTopWrap.querySelector(BACK_TO_TOP_LINK_SELECTOR);
  }

  /* ==========================================================================
     Back-to-top visibility helpers
     ========================================================================== */

  function isNearPageTop() {
    return window.scrollY < VISIBLE_SCROLL_THRESHOLD;
  }

  function shouldHideBackToTop() {
    return isNearPageTop() || footerIsVisible;
  }

  function updateBackToTopVisibility(backToTopWrap) {
    backToTopWrap.classList.toggle(HIDDEN_CLASS, shouldHideBackToTop());
  }

  /* ==========================================================================
     Footer observer
     ========================================================================== */

  function createFooterObserver(backToTopWrap) {
    return new IntersectionObserver(
      (entries) => {
        footerIsVisible = entries.some((entry) => entry.isIntersecting);

        updateBackToTopVisibility(backToTopWrap);
      },
      {
        root: null,
        threshold: 0
      }
    );
  }

  function observeFooter(backToTopWrap, footer) {
    if (!footer) {
      return;
    }

    const observer = createFooterObserver(backToTopWrap);

    observer.observe(footer);
  }

  /* ==========================================================================
     Event binding
     ========================================================================== */

  function bindScrollListener(backToTopWrap) {
    window.addEventListener(
      'scroll',
      () => {
        updateBackToTopVisibility(backToTopWrap);
      },
      {
        passive: true
      }
    );
  }

  function getTargetFromHash(hash) {
    if (!hash || hash === '#') {
      return null;
    }

    return document.getElementById(hash.slice(1));
  }

  function scrollToPageTarget(target) {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scrollBehavior = prefersReducedMotion ? 'auto' : 'smooth';

    if (target) {
      // 1. Find the header element
      const header = document.querySelector(HEADER_SELECTOR);

      // 2. Get its exact rendered height (fallback to 0 if missing)
      const headerHeight = header ? header.getBoundingClientRect().height : 0;

      // 3. Calculate total offset (header height + visual gap)
      const offset = headerHeight + VISUAL_GAP;

      // 4. Calculate the final scroll position
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: scrollBehavior
      });

      return;
    }

    window.scrollTo({
      top: 0,
      behavior: scrollBehavior
    });
  }

  function focusPageTarget(target) {
    if (!target) {
      return;
    }

    const hadTabIndex = target.hasAttribute('tabindex');

    if (!hadTabIndex) {
      target.setAttribute('tabindex', '-1');
    }

    target.focus({
      preventScroll: true
    });

    if (!hadTabIndex) {
      target.addEventListener(
        'blur',
        () => {
          target.removeAttribute('tabindex');
        },
        {
          once: true
        }
      );
    }
  }

  function bindBackToTopClick(backToTopWrap) {
    const backToTopLink = getBackToTopLink(backToTopWrap);

    if (!backToTopLink) {
      return;
    }

    backToTopLink.addEventListener('click', (event) => {
      const target = getTargetFromHash(backToTopLink.hash);

      event.preventDefault();
      scrollToPageTarget(target);
      focusPageTarget(target);
    });
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  function initBackToTop() {
    const backToTopWrap = getBackToTopWrap();
    const footer = getFooter();

    if (!backToTopWrap) {
      return;
    }

    observeFooter(backToTopWrap, footer);
    bindScrollListener(backToTopWrap);
    bindBackToTopClick(backToTopWrap);
    updateBackToTopVisibility(backToTopWrap);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBackToTop, {
      once: true
    });
  } else {
    initBackToTop();
  }
})();
