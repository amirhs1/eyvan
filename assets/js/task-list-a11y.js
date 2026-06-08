/*
Task List Accessibility Script
Purpose:
Give generated GFM/kramdown task-list checkboxes useful accessible names.

Behavior:
- Reads the parent task-list item's visible text
- Applies that text as an aria-label without changing visible markup
*/

(function () {
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
})();
