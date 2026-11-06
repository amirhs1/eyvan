/*
Theme Toggle Script
Purpose:
Provide interactive behavior for the reusable light/dark theme toggle.

Features:
- Applies saved theme preference from localStorage
- Falls back to system color-scheme preference when no manual choice exists
- Synchronizes all theme toggle buttons across desktop and mobile contexts
- Updates aria-pressed, which is true while the dark theme applies; the
  button's label stays constant
- Updates the browser UI theme-color meta tag
- Responds to system theme changes when no manual theme is stored
- Synchronizes theme changes across browser tabs

Dependencies:
- [data-theme-toggle]
- [data-theme-color-meta]
- html[data-theme]

Related component:
- _includes/theme-toggle.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Theme constants and shared references
     ========================================================================== */

  const STORAGE_KEY = 'theme';
  const THEME_LIGHT = 'light';
  const THEME_DARK = 'dark';
  const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)';

  const root = document.documentElement;
  const themeColorMeta = document.querySelector('[data-theme-color-meta]');

  const THEME_COLOR_LIGHT =
    themeColorMeta?.getAttribute('data-theme-color-light') || '#7E4D7C';
  const THEME_COLOR_DARK =
    themeColorMeta?.getAttribute('data-theme-color-dark') || '#EFB4E9';

  const systemThemeMediaQuery =
    window.matchMedia ? window.matchMedia(SYSTEM_THEME_QUERY) : null;

  let hasBoundSystemThemeListener = false;
  let hasBoundStorageListener = false;

  /* ==========================================================================
     Theme lookup helpers
     ========================================================================== */

  function isValidTheme(value) {
    return value === THEME_LIGHT || value === THEME_DARK;
  }

  function getStoredTheme() {
    try {
      const value = localStorage.getItem(STORAGE_KEY);
      return isValidTheme(value) ? value : null;
    } catch (error) {
      return null;
    }
  }

  function getSystemTheme() {
    if (systemThemeMediaQuery?.matches) {
      return THEME_DARK;
    }

    return THEME_LIGHT;
  }

  function getCurrentTheme() {
    const theme = root.getAttribute('data-theme');
    return isValidTheme(theme) ? theme : getSystemTheme();
  }

  function getPreferredTheme() {
    return getStoredTheme() || getCurrentTheme() || getSystemTheme();
  }

  function getNextTheme(theme) {
    return theme === THEME_DARK ? THEME_LIGHT : THEME_DARK;
  }

  /* ==========================================================================
     Accessible state helpers
     ========================================================================== */

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

  // The button's name stays "Dark theme"; only aria-pressed carries the state.
  function updateToggleButton(button, theme) {
    button.setAttribute('aria-pressed', getThemePressedState(theme));
  }

  function updateAllToggleButtons(theme) {
    const buttons = document.querySelectorAll('[data-theme-toggle]');

    buttons.forEach((button) => {
      updateToggleButton(button, theme);
    });
  }

  function applyTheme(theme) {
    if (!isValidTheme(theme)) {
      return;
    }

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
    const currentTheme = getCurrentTheme();
    const nextTheme = getNextTheme(currentTheme);

    persistTheme(nextTheme);
    applyTheme(nextTheme);
  }

  /* ==========================================================================
     Event binding
     ========================================================================== */

  function bindToggleButtons() {
    const buttons = document.querySelectorAll('[data-theme-toggle]');

    buttons.forEach((button) => {
      if (button.dataset.themeToggleBound === 'true') {
        return;
      }

      button.addEventListener('click', toggleTheme);
      button.dataset.themeToggleBound = 'true';
    });
  }

  function bindSystemThemeListener() {
    if (!systemThemeMediaQuery || hasBoundSystemThemeListener) {
      return;
    }

    function handleSystemThemeChange(event) {
      if (getStoredTheme()) {
        return;
      }

      applyTheme(event.matches ? THEME_DARK : THEME_LIGHT);
    }

    if (typeof systemThemeMediaQuery.addEventListener === 'function') {
      systemThemeMediaQuery.addEventListener('change', handleSystemThemeChange);
      hasBoundSystemThemeListener = true;
    } else if (typeof systemThemeMediaQuery.addListener === 'function') {
      systemThemeMediaQuery.addListener(handleSystemThemeChange);
      hasBoundSystemThemeListener = true;
    }
  }

  function bindStorageListener() {
    if (hasBoundStorageListener) {
      return;
    }

    window.addEventListener('storage', (event) => {
      if (event.key !== STORAGE_KEY) {
        return;
      }

      const nextTheme = isValidTheme(event.newValue)
        ? event.newValue
        : getSystemTheme();

      applyTheme(nextTheme);
    });

    hasBoundStorageListener = true;
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  function initThemeToggle() {
    bindToggleButtons();
    bindSystemThemeListener();
    bindStorageListener();
    applyTheme(getPreferredTheme());
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle, {
      once: true
    });
  } else {
    initThemeToggle();
  }
})();