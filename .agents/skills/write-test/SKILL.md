---
name: write-test
description: Write or change a test in tests/ - a Playwright spec, an axe scan, a Minitest test of a guard script, or a Jekyll fixture page. Use when a change adds or changes a test; not for the manual checks in ACCESSIBILITY_TESTING.md.
---

# Write a test

Eyvan's tests, by tool:

- Playwright, against a served site: `tests/accessibility.spec.js`
  (interaction and script loading, with axe-core scans),
  `tests/site-integrity.spec.js` (sitemap links and assets, pinned CDN
  runtimes), and `tests/component-gallery.spec.js` (axe-core scans of every
  fixture page, light and dark).
- Minitest, for the guard scripts: `tests/color_contract_test.rb`
  (`scripts/check-color-contract.rb`) and `tests/release_checks_test.rb`
  (`scripts/check-built-output.rb`, `scripts/check-template-placeholders.rb`).
- Fixture pages for the Sass layers: `tests/test-3-base.html`,
  `tests/4-objects/`, `tests/5-components/`, `tests/test-7-trumps.html`.

Never invent a rule for a feature these tools lack.

## A. Every test

1. Name it after the behaviour it protects, as the claim that is false if it
   fails; never after the file or function under test. Add a one-line comment
   above it only when the name cannot carry the claim or its reason
   (`tests/color_contract_test.rb:103-104`).
2. Test one behaviour. Several asserts are fine when they check that one
   behaviour.
3. Show each new test can fail: break the markup, token, or script under test
   once, run it, watch it fail, restore it. Say so in the pull request.
4. Never weaken an expectation, skip a test, or paste observed output to make
   it pass; report the failure.
5. Leave tests in other files as they are. When rewriting a file, carry
   forward every test that still states a valid contract.
6. Run the changed suite first, then the full gate when rendered output
   changed (`AGENTS.md`, "Commands").

## B. Playwright

7. Each `test()` navigates and sets any viewport it needs itself; none depends
   on another's state.
8. Await web-first assertions: `await expect(menu).toHaveAttribute(...)`, not
   `expect(await menu.getAttribute(...))`.
9. Prefer `getByRole` and `getByLabel`; `data-*` hooks such as
   `[data-nav-toggle]` stay allowed. Use a CSS class only for markup the
   template does not own, such as `pre.highlight`.
10. For several pages with one behaviour, loop and call `test()` once per page
    with the page in the title (`tests/accessibility.spec.js:82-83`).
11. A fixed wait needs a comment giving its reason and the number's source
    (`tests/accessibility.spec.js:92-94`).
12. Never reach an external host. The one exception is the CDN runtimes in
    `AGENTS.md`, "Settled decisions": `tests/site-integrity.spec.js` loads
    them through the page and asserts their tags and hashes (`:119-128`),
    since only a real fetch shows the pinned version and hash still load.

## C. axe

13. Scan in the state under test: after the menu opens, after the theme
    switches and its transition settles.
14. Pass on `expect(results.violations).toEqual([])`; never on a count or a
    rule id.
15. Use bare `analyze()`, which also runs the best-practice rules; not
    `withTags()`, which narrows what CI catches.
16. Attach `results.incomplete` with `testInfo.attach` for a person to review;
    never drop it.
17. Use `exclude()` or `disableRules()` only with a comment linking the issue
    that tracks the violation, and name it in the pull request's "Notes for
    review".

## D. Minitest

18. Follow `tests/color_contract_test.rb`: a block helper builds a temporary
    fixture and cleans up, `Open3.capture3` runs the script with
    `RbConfig.ruby`, and the test asserts the exact output line.
19. For each rule a guard script enforces, write one test with a passing
    fixture and one with a single injected defect, so a rule that stops firing
    is caught.
20. One method per case. Freeze shared constants and declare them, with a
    comment, at the top of the class.

## E. Fixture pages

21. Give a fixture `layout: test`, `robots: noindex`, and a `permalink` under
    `/tests/`, then a Liquid comment stating its purpose and the selectors or
    behaviours it exercises (`tests/4-objects/test-container.html`).
22. List each fixture a spec scans in that spec, with a comment on what it
    covers.
23. Fixtures render only when `site.dev_only` is true.
    `tests/component-gallery.spec.js` scans them on the build that
    `_config.gallery.yml` overlays; a test never changes the default in
    `_config.yml`.

## F. Expected values

24. Contrast thresholds: WCAG 2.1 SC 1.4.3 (4.5:1) and 1.4.11 (3:1), cited in
    a comment; `scripts/check-color-contract.rb:243-255` implements them.
25. Colour values, token names, and dimensions: the maintainer or
    `_sass/0-settings/*`, cited in the test and in the commit's
    `Ground-truth-source:`.
26. Page lists: `sitemap.xml` at run time, or a constant with a comment saying
    why those pages (`tests/accessibility.spec.js:74-80`).
27. With no such source, assert a property, such as one `main` landmark per
    page, and say so in a comment.

## G. Boundaries

28. Manual keyboard, screen-reader, zoom, and motion checks stay in
    `ACCESSIBILITY_TESTING.md`; list each one the change needs and you did not
    run under "Not verified".
29. Static review of a markup diff is the `open-pull-request` pre-check
    (#82), not this skill.
30. Which pages and components get tests is the maintainer's call; propose
    one and cite the issue.

## Examples

```js
test('mobile menu has no detectable axe violations after opening', ...)
expect(results.violations).toEqual([]);
```

```ruby
def test_flags_insufficient_contrast
```

```yaml
layout: test
permalink: /tests/5-components/test-mobile-menu/
robots: noindex
```

Not: `test('mobile-menu.js', ...)` or `def test_check_color_contract` (each
names the code, not the claim);
`expect(results.violations.length).toBeLessThan(3)` (a count); a fixture
without `layout: test` and `robots: noindex`, or with a permalink outside
`/tests/`.
