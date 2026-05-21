/*
Mobile TOC Script
Purpose:
Provide interactive behavior for the mobile/tablet table-of-contents panel.

Features:
- Initializes only when the TOC trigger and mobile TOC panel exist
- Synchronizes aria-expanded and panel visibility
- Opens and closes the mobile TOC panel
- Locks body scrolling while the TOC panel is open
- Keeps the sticky TOC toolbar offset below the sticky site header
- Supports close interactions through:
  - open/close buttons
  - Escape key
  - TOC link selection
- Returns focus to the Contents button after keyboard/button-driven close actions

Dependencies:
- .c-site-header
- [data-toc-open]
- [data-mobile-toc]
- [data-toc-close]
- .c-mobile-toc__link
- body.is-mobile-toc-open
- .c-mobile-toc.is-open

Related components:
- _layouts/post.html
- _includes/toc.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Shared helpers
     ========================================================================== */

  function setSiteHeaderBlockSize() {
    const siteHeader = document.querySelector('.c-site-header');
    const root = document.documentElement;

    if (!siteHeader) {
      root.style.setProperty('--site-header-block-size', '0px');
      return;
    }

    const headerHeight = siteHeader.getBoundingClientRect().height;
    root.style.setProperty('--site-header-block-size', `${headerHeight}px`);
  }

  /* ==========================================================================
     Shared element references
     ========================================================================== */

  function initMobileToc() {
    const tocOpen = document.querySelector('[data-toc-open]');
    const mobileToc = document.querySelector('[data-mobile-toc]');

    setSiteHeaderBlockSize();

    window.addEventListener('resize', setSiteHeaderBlockSize, {
      passive: true
    });

    if (!tocOpen || !mobileToc) {
      return;
    }

    if (mobileToc.parentElement !== document.body) {
      document.body.appendChild(mobileToc);
    }

    const tocClose = mobileToc.querySelector('[data-toc-close]');
    const tocLinks = mobileToc.querySelectorAll('.c-mobile-toc__link');
    const body = document.body;

    /* ==========================================================================
       Toggle state helpers
       ========================================================================== */

    function syncTocState(isOpen) {
      tocOpen.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function isMobileTocOpen() {
      return tocOpen.getAttribute('aria-expanded') === 'true';
    }

    /* ==========================================================================
       TOC open/close actions
       ========================================================================== */

    function openMobileToc() {
      setSiteHeaderBlockSize();
      
      mobileToc.hidden = false;
      mobileToc.classList.add('is-open');
      body.classList.add('is-mobile-toc-open');
      syncTocState(true);

      if (tocClose) {
        tocClose.focus();
      }
    }

    function closeMobileToc({ returnFocus = true } = {}) {
      mobileToc.hidden = true;
      mobileToc.classList.remove('is-open');
      body.classList.remove('is-mobile-toc-open');
      syncTocState(false);

      if (returnFocus) {
        tocOpen.focus();
      }
    }

    function toggleMobileToc() {
      if (isMobileTocOpen()) {
        closeMobileToc();
      } else {
        openMobileToc();
      }
    }

    /* ==========================================================================
       Event binding
       ========================================================================== */

    function bindOpenButton() {
      tocOpen.addEventListener('click', toggleMobileToc);
    }

    function bindCloseButton() {
      if (!tocClose) {
        return;
      }

      tocClose.addEventListener('click', () => {
        closeMobileToc();
      });
    }

    function bindEscapeKey() {
      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isMobileTocOpen()) {
          return;
        }

        closeMobileToc();
      });
    }

    function bindTocLinks() {
      tocLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileToc({ returnFocus: false });
        });
      });
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */

    function setupMobileToc() {
      syncTocState(false);
      bindOpenButton();
      bindCloseButton();
      bindEscapeKey();
      bindTocLinks();
    }

    setupMobileToc();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileToc, {
      once: true
    });
  } else {
    initMobileToc();
  }
})();