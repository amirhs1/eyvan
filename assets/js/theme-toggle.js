/*
Theme Toggle Script
Purpose:
Provide interactive behavior for the reusable light/dark theme toggle.

Features:
- Applies saved theme preference from localStorage
- Falls back to system color-scheme preference when no manual choice exists
- Synchronizes all theme toggle buttons across desktop and mobile contexts
- Updates accessible labels and aria-pressed state
- Updates the browser UI theme-color meta tag
- Responds to system theme changes when no manual theme is stored

Dependencies:
- [data-theme-toggle]
- [data-theme-label-sr]
- [data-theme-label-visible]
- [data-theme-color-meta]
- html[data-theme]

Related component:
- _includes/theme-toggle.html
*/

(function () {
  'use strict';

  /* ==========================================================================
     Theme constants and shared references
     ========================================================================== */

  var STORAGE_KEY = 'theme';
  var THEME_LIGHT = 'light';
  var THEME_DARK = 'dark';

  // These should match the theme-color values defined in head.html.
  var THEME_COLOR_LIGHT = '#32127A';
  var THEME_COLOR_DARK = '#3FE0D0';

  var root = document.documentElement;
  var themeColorMeta = document.querySelector('[data-theme-color-meta]');

  /* ==========================================================================
     Theme lookup helpers
     ========================================================================== */

  function getStoredTheme() {
    try {
      var value = localStorage.getItem(STORAGE_KEY);
      return value === THEME_DARK || value === THEME_LIGHT ? value : null;
    } catch (error) {
      return null;
    }
  }

  function getSystemTheme() {
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return THEME_DARK;
    }

    return THEME_LIGHT;
  }

  function getCurrentTheme() {
    var theme = root.getAttribute('data-theme');

    if (theme === THEME_DARK || theme === THEME_LIGHT) {
      return theme;
    }

    return getSystemTheme();
  }

  function getPreferredTheme() {
    return getStoredTheme() || getCurrentTheme() || getSystemTheme();
  }

  function getNextTheme(theme) {
    return theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
  }

  /* ==========================================================================
     Accessible label helpers
     ========================================================================== */

  function getThemeActionLabel(theme) {
    return theme === THEME_DARK
      ? 'Switch to light theme'
      : 'Switch to dark theme';
  }

  function getThemePressedState(theme) {
    return theme === THEME_DARK ? 'true' : 'false';
  }

  /* ==========================================================================
     Theme UI updates
     ========================================================================== */

  function updateThemeColorMeta(theme) {
    if (!themeColorMeta) {
      return;
    }

    themeColorMeta.setAttribute(
      'content',
      theme === THEME_DARK ? THEME_COLOR_DARK : THEME_COLOR_LIGHT
    );
  }

  function updateToggleButton(button, theme) {
    var actionLabel = getThemeActionLabel(theme);
    var pressedState = getThemePressedState(theme);

    button.setAttribute('aria-label', actionLabel);
    button.setAttribute('aria-pressed', pressedState);

    var srLabel = button.querySelector('[data-theme-label-sr]');
    if (srLabel) {
      srLabel.textContent = actionLabel;
    }

    var visibleLabel = button.querySelector('[data-theme-label-visible]');
    if (visibleLabel) {
      visibleLabel.textContent = actionLabel;
    }
  }

  function updateAllToggleButtons(theme) {
    var buttons = document.querySelectorAll('[data-theme-toggle]');

    buttons.forEach(function (button) {
      updateToggleButton(button, theme);
    });
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    updateThemeColorMeta(theme);
    updateAllToggleButtons(theme);
  }

  /* ==========================================================================
     Theme persistence and toggle actions
     ========================================================================== */

  function persistTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage failures gracefully.
    }
  }

  function toggleTheme() {
    var currentTheme = getCurrentTheme();
    var nextTheme = getNextTheme(currentTheme);

    persistTheme(nextTheme);
    applyTheme(nextTheme);
  }

  /* ==========================================================================
     Event binding
     ========================================================================== */

  function bindToggleButtons() {
    var buttons = document.querySelectorAll('[data-theme-toggle]');

    buttons.forEach(function (button) {
      // Prevent duplicate event binding if init runs more than once.
      if (button.dataset.themeToggleBound === 'true') {
        return;
      }

      button.addEventListener('click', toggleTheme);
      button.dataset.themeToggleBound = 'true';
    });
  }

  function bindSystemThemeListener() {
    if (!window.matchMedia) {
      return;
    }

    var mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    function handleSystemThemeChange(event) {
      // Follow the OS only when the user has not chosen manually.
      if (getStoredTheme()) {
        return;
      }

      applyTheme(event.matches ? THEME_DARK : THEME_LIGHT);
    }

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handleSystemThemeChange);
    }
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  function initThemeToggle() {
    applyTheme(getPreferredTheme());
    bindToggleButtons();
    bindSystemThemeListener();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();