/*
Post Share Script
Purpose:
Provide interactive behavior for the post share component.

Features:
- Native Web Share API for supported devices
- Clipboard fallback when Web Share is unavailable
- Polite status updates for clipboard fallback results
- Print button support (browser print dialog)
- Overflow disclosure for additional share actions, supporting close via the
  toggle, Escape (with focus return), and outside click

Dependencies:
- .js-share-button
- .js-print-button
- [data-overflow-toggle] (panel resolved via its aria-controls/id pair)

Related component:
- _includes/post-share.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Element references
     ========================================================================== */

  const shareButtons = document.querySelectorAll('.js-share-button');
  const printButtons = document.querySelectorAll('.js-print-button');

  function updateShareStatus(button, message) {
    const shareRoot = button.closest('.c-post-share');
    const status = shareRoot ? shareRoot.querySelector('[data-share-status]') : null;

    if (!status) {
      return;
    }

    status.textContent = '';

    window.setTimeout(function () {
      status.textContent = message;
    }, 10);
  }

  /* ==========================================================================
     Native share / clipboard fallback
     ========================================================================== */

  shareButtons.forEach((button) => {
    button.addEventListener('click', async function (e) {
      const title = e.currentTarget.getAttribute('data-title') || document.title;
      const url = e.currentTarget.getAttribute('data-url') || window.location.href;

      // Use the Web Share API when available
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: url
          });
        } catch (err) {
          console.debug('Share cancelled or failed:', err);
        }

      // Clipboard fallback
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          updateShareStatus(e.currentTarget, 'Link copied to clipboard.');
        } catch (err) {
          console.error('Clipboard copy failed:', err);
          updateShareStatus(e.currentTarget, 'Unable to copy link.');
        }

      // Legacy execCommand fallback
      } else {
        let tempInput = null;

        try {
          tempInput = document.createElement('input');
          tempInput.value = url;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          updateShareStatus(e.currentTarget, 'Link copied to clipboard.');
        } catch (err) {
          console.error('Fallback copy failed:', err);
          updateShareStatus(e.currentTarget, 'Unable to copy link.');
        } finally {
          if (tempInput && tempInput.parentNode) {
            tempInput.parentNode.removeChild(tempInput);
          }
        }
      }
    });
  });

  /* ==========================================================================
     Print / Save as PDF
     ========================================================================== */

  printButtons.forEach((button) => {
    button.addEventListener('click', function () {
      window.print();
    });
  });

  /* ==========================================================================
     Overflow disclosure
     ========================================================================== */

  const overflowToggles = document.querySelectorAll('[data-overflow-toggle]');

  overflowToggles.forEach((toggle) => {
    const panel = document.getElementById(toggle.getAttribute('aria-controls'));

    if (!panel) {
      return;
    }

    function syncOverflowState(isOpen) {
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      panel.hidden = !isOpen;
    }

    function isOverflowOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function closeOverflow({ returnFocus = false } = {}) {
      syncOverflowState(false);

      if (returnFocus) {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      syncOverflowState(!isOverflowOpen());
    });

    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !isOverflowOpen()) {
        return;
      }

      closeOverflow({ returnFocus: true });
    });

    document.addEventListener('click', function (e) {
      if (!isOverflowOpen()) {
        return;
      }

      if (panel.contains(e.target) || toggle.contains(e.target)) {
        return;
      }

      closeOverflow();
    });
  });
})();
