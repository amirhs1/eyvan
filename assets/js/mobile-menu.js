/*
Mobile Menu Script
Purpose:
Provide interactive behavior for the reusable tablet/mobile navigation menu.

Features:
- Initializes only when both the menu toggle and mobile menu exist
- Synchronizes aria-expanded, aria-label, and optional visible toggle label
- Opens and closes the mobile menu panel
- Locks body scrolling while the menu is open
- Supports close interactions through:
  - toggle button
  - close button
  - Escape key
  - mobile navigation link selection
- Returns focus to the toggle after keyboard/button-driven close actions

Dependencies:
- [data-nav-toggle]
- [data-mobile-menu]
- [data-nav-close]
- [data-nav-toggle-label]
- .c-nav__link
- body.is-mobile-menu-open
- .c-mobile-menu.is-open

Related components:
- _includes/header.html
- _includes/mobile-menu.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Shared element references
     ========================================================================== */

  function initMobileMenu() {
    const navToggle = document.querySelector('[data-nav-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (!navToggle || !mobileMenu) {
      return;
    }

    const navClose = mobileMenu.querySelector('[data-nav-close]');
    const mobileNavLinks = mobileMenu.querySelectorAll('.c-nav__link');
    const navToggleLabel = navToggle.querySelector('[data-nav-toggle-label]');
    const body = document.body;

    /* ==========================================================================
       Toggle state helpers
       ========================================================================== */

    function syncNavToggleState(isOpen) {
      const expanded = isOpen ? 'true' : 'false';
      const label = isOpen ? 'Close menu' : 'Open menu';

      navToggle.setAttribute('aria-expanded', expanded);
      navToggle.setAttribute('aria-label', label);

      if (navToggleLabel) {
        navToggleLabel.textContent = label;
      }
    }

    function isMobileMenuOpen() {
      return navToggle.getAttribute('aria-expanded') === 'true';
    }

    /* ==========================================================================
       Menu open/close actions
       ========================================================================== */

    function openMobileMenu() {
      mobileMenu.hidden = false;
      mobileMenu.classList.add('is-open');
      body.classList.add('is-mobile-menu-open');
      syncNavToggleState(true);
    }

    function closeMobileMenu() {
      mobileMenu.hidden = true;
      mobileMenu.classList.remove('is-open');
      body.classList.remove('is-mobile-menu-open');
      syncNavToggleState(false);
    }

    function toggleMobileMenu() {
      if (isMobileMenuOpen()) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    }

    /* ==========================================================================
       Event binding
       ========================================================================== */

    function bindToggleButton() {
      navToggle.addEventListener('click', toggleMobileMenu);
    }

    function bindCloseButton() {
      if (!navClose) {
        return;
      }

      navClose.addEventListener('click', () => {
        closeMobileMenu();
        navToggle.focus();
      });
    }

    function bindEscapeKey() {
      document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape' || !isMobileMenuOpen()) {
          return;
        }

        closeMobileMenu();
        navToggle.focus();
      });
    }

    function bindMobileNavLinks() {
      mobileNavLinks.forEach((link) => {
        link.addEventListener('click', () => {
          closeMobileMenu();
        });
      });
    }

    /* ==========================================================================
       Initialization
       ========================================================================== */

    function setupMobileMenu() {
      syncNavToggleState(false);
      bindToggleButton();
      bindCloseButton();
      bindEscapeKey();
      bindMobileNavLinks();
    }

    setupMobileMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileMenu, {
      once: true
    });
  } else {
    initMobileMenu();
  }
})();