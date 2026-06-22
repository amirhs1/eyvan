/*
Overlay Isolation
Purpose:
Keep background content out of the accessibility and interaction trees while a
full-screen overlay is open.

Public API:
- window.EyvanOverlayIsolation.activate(overlay)
- window.EyvanOverlayIsolation.deactivate(overlay)

Consumed by:
- mobile-menu.js
- mobile-toc.js
*/

(() => {
  'use strict';

  let activeOverlay = null;
  let previousStates = new Map();

  function restoreBackground() {
    previousStates.forEach((wasInert, element) => {
      element.inert = wasInert;
    });

    previousStates = new Map();
    activeOverlay = null;
  }

  function activate(overlay) {
    if (!overlay || overlay.parentElement !== document.body) {
      return false;
    }

    if (activeOverlay === overlay) {
      return true;
    }

    restoreBackground();
    activeOverlay = overlay;

    Array.from(document.body.children).forEach((element) => {
      if (element === overlay || element.tagName === 'SCRIPT') {
        return;
      }

      previousStates.set(element, element.inert);
      element.inert = true;
    });

    return true;
  }

  function deactivate(overlay) {
    if (overlay && overlay !== activeOverlay) {
      return;
    }

    restoreBackground();
  }

  window.EyvanOverlayIsolation = {
    activate,
    deactivate
  };
})();
