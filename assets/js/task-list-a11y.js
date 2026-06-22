/*
Task List Accessibility Script
Purpose:
Give generated GFM/kramdown task-list checkboxes useful accessible names.

Features:
- Reads the parent task-list item's visible text
- Skips checkboxes that already expose an accessible name
- Applies that text as an aria-label without changing visible markup

Dependencies:
- .task-list-item-checkbox
- .task-list-item

Related component:
- GFM/kramdown-generated task lists (loaded via _includes/scripts.html when
  content contains task-list-item-checkbox)
*/

(() => {
  'use strict';

  /* ==========================================================================
     Initialization
     ========================================================================== */

  function initTaskListA11y() {
    const taskCheckboxes = document.querySelectorAll('.task-list-item-checkbox');

    taskCheckboxes.forEach((checkbox) => {
      if (checkbox.hasAttribute('aria-label') || checkbox.hasAttribute('aria-labelledby')) {
        return;
      }

      const taskItem = checkbox.closest('.task-list-item') || checkbox.closest('li');

      if (!taskItem) {
        return;
      }

      const taskText = taskItem.textContent.replace(/\s+/g, ' ').trim();

      if (taskText) {
        checkbox.setAttribute('aria-label', taskText);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTaskListA11y, { once: true });
  } else {
    initTaskListA11y();
  }
})();
