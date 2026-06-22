/*
Prose Cross-reference Resolver
Purpose:
Resolve numbered prose cross-references rendered by {% include ref.html %} so
their visible link text matches the CSS counter order at page load.

Features:
- Counts elements with data-ref-type in document order
- Mirrors the CSS counter order used for figures and tables
- Updates c-prose-xref link text once the DOM is ready

Dependencies:
- [data-ref-type]
- a.c-prose-xref
- .c-prose-xref--cref

Related component:
- _includes/ref.html
*/

(() => {
  'use strict';

  /* ==========================================================================
     Cross-reference resolution
     ========================================================================== */

  function initCrossrefs() {
    const labels = {
      figure: 'Figure',
      table: 'Table'
    };

    const counts = {};
    const numberOf = {};

    document.querySelectorAll('[data-ref-type]').forEach((element) => {
      const type = element.dataset.refType;

      counts[type] = (counts[type] || 0) + 1;

      if (element.id) {
        numberOf[element.id] = {
          type: type,
          number: counts[type]
        };
      }
    });

    document.querySelectorAll('a.c-prose-xref').forEach((link) => {
      const id = (link.getAttribute('href') || '').replace(/^#/, '');
      const info = numberOf[id];

      if (!info) {
        return;
      }

      const prefix = link.classList.contains('c-prose-xref--cref')
        ? labels[info.type] + ' '
        : '';

      link.textContent = prefix + info.number;
    });
  }

  /* ==========================================================================
     Initialization
     ========================================================================== */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCrossrefs, { once: true });
  } else {
    initCrossrefs();
  }
})();
