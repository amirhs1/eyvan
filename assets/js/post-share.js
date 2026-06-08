/*
Post Share Script
Purpose:
Provide interactive behavior for the post share component.

Features:
- Native Web Share API for supported devices
- Clipboard fallback when Web Share is unavailable
- Polite status updates for clipboard fallback results
- Print button support (browser print dialog)

Dependencies:
- .js-share-button
- .js-print-button

Related component:
- _includes/post-share.html
*/

(function () {
  // Section: Element references
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

  // Section: Native share / clipboard fallback
  shareButtons.forEach((button) => {
    button.addEventListener('click', async function (e) {
      const title = e.currentTarget.getAttribute('data-title') || document.title;
      const url = e.currentTarget.getAttribute('data-url') || window.location.href;

      // Subsection: Use Web Share API when available
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: url
          });
        } catch (err) {
          console.debug('Share cancelled or failed:', err);
        }

      // Subsection: Clipboard fallback
      } else if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(url);
          updateShareStatus(e.currentTarget, 'Link copied to clipboard.');
        } catch (err) {
          console.error('Clipboard copy failed:', err);
          updateShareStatus(e.currentTarget, 'Unable to copy link.');
        }

      // Subsection: Legacy fallback
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

  // Section: Print / Save as PDF
  printButtons.forEach((button) => {
    button.addEventListener('click', function () {
      window.print();
    });
  });
})();
