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
  const FOOTER_SELECTOR = '.c-site-footer';
  const HIDDEN_CLASS = 'is-hidden';
  const VISIBLE_SCROLL_THRESHOLD = 240;

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