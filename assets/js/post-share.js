/*
Post Share Script
Purpose:
Provide interactive behavior for the post share component.

Features:
- Native Web Share API for supported devices
- Clipboard fallback when Web Share is unavailable
- Print button support (browser print dialog)

Dependencies:
- .js-share-btn
- .js-print-btn

Related component:
- _includes/post-share.html
*/

(function () {

  // Section: Element references
  const shareBtn = document.querySelector('.js-share-btn');
  const printBtn = document.querySelector('.js-print-btn');

  // Section: Native share / clipboard fallback
  if (shareBtn) {
    shareBtn.addEventListener('click', async function (e) {

      const title = e.currentTarget.getAttribute('data-title');
      const url = e.currentTarget.getAttribute('data-url');

      // Subsection: Use Web Share API when available
      if (navigator.share) {
        try {
          await navigator.share({
            title: title,
            url: url
          });
        } catch (err) {
          console.debug('Share cancelled or failed', err);
        }

      // Subsection: Clipboard fallback
      } else {
        try {
          await navigator.clipboard.writeText(url);
          alert('Link copied to clipboard.');
        } catch (err) {
          console.error('Clipboard copy failed:', err);
        }
      }

    });
  }

  // Section: Print / Save as PDF
  if (printBtn) {
    printBtn.addEventListener('click', function () {
      window.print();
    });
  }

})();