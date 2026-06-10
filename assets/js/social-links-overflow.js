/*
Social Links Overflow Script
Purpose:
Provide a disclosure toggle for the header's overflow social/CV links when
there are more available items than visible icon slots.

Features:
- Initializes only when both the overflow toggle and panel exist
- Synchronizes aria-expanded and the panel's hidden attribute
- Opens and closes the overflow panel
- Supports close interactions through:
  - toggle button
  - Escape key
  - clicking outside the toggle/panel
- Returns focus to the toggle after an Escape-driven close

Dependencies:
- [data-social-overflow-toggle]
- [data-social-overflow-panel]

Related components:
- _includes/header.html
- _includes/social-links.html
*/

(() => {
  'use strict';

  function initSocialLinksOverflow() {
    const toggle = document.querySelector('[data-social-overflow-toggle]');
    const panel = document.querySelector('[data-social-overflow-panel]');

    if (!toggle || !panel) {
      return;
    }

    /* ==========================================================================
       Toggle state helpers
       ========================================================================== */

    function syncOverflowState(isOpen) {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      panel.hidden = !isOpen;
    }

    function isOverflowOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    /* ==========================================================================
       Open/close actions
       ========================================================================== */

    function openOverflow() {
      syncOverflowState(true);
    }

    function closeOverflow({ returnFocus = false } = {}) {
      syncOverflowState(false);

      if (returnFocus) {
        toggle.focus();
      }
    }

    function toggleOverflow() {
      if (isOverflowOpen()) {
        closeOverflow();
      } else {
        openOverflow();
      }
    }

    /* ==========================================================================
       Event binding
       ========================================================================== */

    function bindToggleButton() {
      toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleOverflow();
      });
    }

    function bindEscapeKey() {
      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isOverflowOpen()) {
          return;
        }

        closeOverflow({ returnFocus: true });
      });
    }

    function bindOutsideClick() {
      document.addEventListener('click', (event) => {
        if (!isOverflowOpen()) {
          return;
        }

        if (panel.contains(event.target) || toggle.contains(event.target)) {
          return;
        }

        closeOverflow();
      });
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */

    function setupSocialLinksOverflow() {
      syncOverflowState(false);
      bindToggleButton();
      bindEscapeKey();
      bindOutsideClick();
    }

    setupSocialLinksOverflow();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSocialLinksOverflow, {
      once: true
    });
  } else {
    initSocialLinksOverflow();
  }
})();
