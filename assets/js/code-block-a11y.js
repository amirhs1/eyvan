/*
Code Block Accessibility Script
Purpose:
Make horizontally overflowing generated code blocks and prose tables keyboard
reachable.

Features:
- Enhances Rouge/Jekyll-generated <pre> blocks only when they overflow
- Gives each overflowing block a distinct accessible name (axe: landmark-unique)
- Makes overflowing prose tables focusable and names them from their <caption>
  or "Table N", keeping their native table role
- Removes the enhancement again when responsive layout no longer overflows;
  a table loses only the attributes this script added

Dependencies:
- pre.highlight
- .highlight > pre
- .o-prose table (the scroll container in _sass/4-objects/_prose.scss)

Related component:
- Rouge/kramdown-generated code blocks and prose tables (loaded via
  _includes/scripts.html when content contains class="highlight" or <table)
*/

(() => {
  'use strict';

  /* ==========================================================================
     Code block enhancement
     ========================================================================== */

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

  /* ==========================================================================
     Prose table enhancement
     ========================================================================== */

  function updateTable(table, index) {
    const overflowsInline = table.scrollWidth > table.clientWidth;
    // Space-separated names of the attributes this script added.
    const added = table.getAttribute('data-table-a11y');

    if (overflowsInline) {
      if (added !== null) {
        return;
      }

      const caption = table.caption ? table.caption.textContent.trim() : '';
      // No role: an explicit role would replace the native table semantics.
      const enhancements = {
        tabindex: '0',
        'aria-label': caption || 'Table ' + (index + 1),
      };
      const addedNames = Object.keys(enhancements).filter((name) => !table.hasAttribute(name));

      addedNames.forEach((name) => table.setAttribute(name, enhancements[name]));
      table.setAttribute('data-table-a11y', addedNames.join(' '));
      return;
    }

    if (added !== null) {
      added.split(' ').filter(Boolean).forEach((name) => table.removeAttribute(name));
      table.removeAttribute('data-table-a11y');
    }
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  function initCodeBlockA11y() {
    const codeBlocks = document.querySelectorAll('pre.highlight, .highlight > pre');
    // Same scope as the table overflow rule in _sass/4-objects/_prose.scss.
    const tables = document.querySelectorAll('.o-prose table');

    if (!codeBlocks.length && !tables.length) {
      return;
    }

    function updateEnhancements() {
      codeBlocks.forEach(updateCodeBlock);
      tables.forEach(updateTable);
    }

    let resizeFrame = null;

    updateEnhancements();

    window.addEventListener('resize', () => {
      if (resizeFrame) {
        window.cancelAnimationFrame(resizeFrame);
      }

      resizeFrame = window.requestAnimationFrame(() => {
        updateEnhancements();
        resizeFrame = null;
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCodeBlockA11y, { once: true });
  } else {
    initCodeBlockA11y();
  }
})();
