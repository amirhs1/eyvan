/*
Code Block Accessibility Script
Purpose:
Make horizontally overflowing generated code blocks keyboard reachable.

Behavior:
- Enhances Rouge/Jekyll-generated <pre> blocks only when they overflow
- Removes the enhancement again when responsive layout no longer overflows
*/

(function () {
  const codeBlocks = document.querySelectorAll('pre.highlight, .highlight > pre');

  if (!codeBlocks.length) {
    return;
  }

  function updateCodeBlock(block, index) {
    const overflowsInline = block.scrollWidth > block.clientWidth;

    if (overflowsInline) {
      block.setAttribute('tabindex', '0');
      block.setAttribute('role', 'region');
      // Each region needs a distinct accessible name (axe: landmark-unique) —
      // a shared label like "Code sample" collides once a page has more than one.
      block.setAttribute('aria-label', 'Code sample ' + (index + 1));
      block.setAttribute('data-code-block-a11y', 'true');
      return;
    }

    if (block.getAttribute('data-code-block-a11y') === 'true') {
      block.removeAttribute('tabindex');
      block.removeAttribute('role');
      block.removeAttribute('aria-label');
      block.removeAttribute('data-code-block-a11y');
    }
  }

  function updateCodeBlocks() {
    codeBlocks.forEach(updateCodeBlock);
  }

  let resizeFrame = null;

  updateCodeBlocks();

  window.addEventListener('resize', function () {
    if (resizeFrame) {
      window.cancelAnimationFrame(resizeFrame);
    }

    resizeFrame = window.requestAnimationFrame(function () {
      updateCodeBlocks();
      resizeFrame = null;
    });
  });
})();
