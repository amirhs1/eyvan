# Manual Accessibility Testing

Run the automated accessibility suite first. These manual checks cover behavior
that axe and link crawlers cannot fully evaluate.

## Keyboard

1. Start at the browser address bar and navigate the page with `Tab` and
   `Shift+Tab`.
2. Confirm the skip link appears, moves focus to main content, and has a visible
   focus indicator.
3. Open and close the mobile menu and mobile TOC with the keyboard. Confirm
   focus stays inside the open dialog, `Escape` closes it, and focus returns to
   the trigger.
4. Exercise theme, share overflow, print, navigation, tags, post cards, and
   back-to-top controls with `Enter` or `Space` as appropriate.
5. Confirm horizontally scrollable code blocks become keyboard-focusable only
   when they overflow.

## VoiceOver on macOS

1. Enable VoiceOver with `Command+F5` and open Safari.
2. Navigate by landmarks and headings. Confirm the page has one main landmark,
   descriptive navigation labels, and a logical heading outline.
3. Read images, form controls, links, metadata, task-list items, and code
   regions. Confirm names are meaningful and no decorative icon is announced.
4. Open the mobile menu and mobile TOC. Confirm VoiceOver announces each as a
   dialog and cannot navigate into background content while it is open.
5. Toggle light and dark themes and confirm the control state is announced.

## NVDA on Windows

1. Start NVDA and open Firefox or Chrome.
2. Use `H`, `D`, and `K` to navigate headings, landmarks, and links. Confirm the
   reading order matches the visual order.
3. Use browse and focus modes to exercise menus, TOCs, share controls, task
   lists, code regions, and post navigation.
4. Open each mobile overlay and confirm NVDA announces the dialog label,
   background content is unavailable, `Escape` closes the dialog, and focus
   returns to its trigger.
5. Confirm status messages, such as share-copy feedback, are announced without
   moving focus.

## Visual and Motion Checks

- Zoom to 200% and confirm content reflows without horizontal page scrolling.
- Test at 320 CSS pixels wide and confirm controls do not overlap or clip.
- Enable reduced motion and confirm non-essential animation is suppressed.
- Check visible focus indicators in light and dark themes.
- Confirm text, controls, code tokens, and non-text UI remain distinguishable
  in each shipped color theme.

Record the browser, screen reader, operating system, page, and exact steps for
any issue that cannot be reproduced by the automated suite.
