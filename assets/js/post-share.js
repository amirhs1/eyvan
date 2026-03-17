/*
Post Share Script
Purpose:
Provide interactive behavior for the post share component.

Features:
- Native Web Share API for supported devices
- Clipboard fallback when Web Share is unavailable
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
          alert('Link copied to clipboard.');
        } catch (err) {
          console.error('Clipboard copy failed:', err);
        }

      // Subsection: Legacy fallback
      } else {
        try {
          const tempInput = document.createElement('input');
          tempInput.value = url;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand('copy');
          document.body.removeChild(tempInput);
          alert('Link copied to clipboard.');
        } catch (err) {
          console.error('Fallback copy failed:', err);
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