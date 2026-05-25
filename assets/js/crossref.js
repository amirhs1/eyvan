/*
  Prose Cross-reference Resolver

  Purpose:
  Resolve all {% include ref.html %} links.

  Behavior:
  - Counts elements with data-ref-type in document order
  - Matches CSS counter order
  - Updates c-prose-xref link text at page load

  Include once on layouts that render prose cross-references.
*/

document.addEventListener('DOMContentLoaded', function () {
  var labels = {
    figure: 'Figure',
    table: 'Table'
  };

  var counts = {};
  var numberOf = {};

  document.querySelectorAll('[data-ref-type]').forEach(function (element) {
    var type = element.dataset.refType;

    counts[type] = (counts[type] || 0) + 1;

    if (element.id) {
      numberOf[element.id] = {
        type: type,
        number: counts[type]
      };
    }
  });

  document.querySelectorAll('a.c-prose-xref').forEach(function (link) {
    var id = (link.getAttribute('href') || '').replace(/^#/, '');
    var info = numberOf[id];

    if (!info) return;

    var prefix = link.classList.contains('c-prose-xref--cref')
      ? labels[info.type] + ' '
      : '';

    link.textContent = prefix + info.number;
  });
});