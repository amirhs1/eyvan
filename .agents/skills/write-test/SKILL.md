---
name: write-test
description: Write or change a test in this project's tools - a Playwright spec, an axe scan, a Minitest guard-script test, or a Jekyll fixture page. Use when a change adds or changes a test; not for the manual checks in ACCESSIBILITY_TESTING.md.
---

# Write a test

Rules carry the numbers of the acceptance criteria in #85, so each can be
checked against its source. The Playwright and axe-core pages cited below are
leads the maintainer has not yet checked (`AGENTS.md`, "Do not"):

- Playwright, "Best Practices": <https://playwright.dev/docs/best-practices>
- Playwright, "Accessibility testing":
  <https://playwright.dev/docs/accessibility-testing>
- axe-core API documentation:
  <https://github.com/dequelabs/axe-core/blob/develop/doc/API.md>

## What Eyvan tests, and with what

| Surface | Tool | Files | Run with |
| --- | --- | --- | --- |
| Rendered pages, interaction, script loading | Playwright | `tests/accessibility.spec.js`, `tests/site-integrity.spec.js` | `npm run test:a11y`, `npm run test:site`, against a served site |
| Accessibility of rendered pages | axe-core via `@axe-core/playwright` | inside `tests/accessibility.spec.js` | `npm run test:a11y` |
| The guard scripts themselves | Minitest | `tests/color_contract_test.rb`, `tests/release_checks_test.rb` | `npm run test:colors`, `npm run test:release` |
| Rendering of one object or component | Jekyll fixture pages | `tests/4-objects/*.html`, `tests/5-components/*.html`, gated by `site.dev_only` | scanned by the specs or inspected by a person |

Follow section A, then the section for each row the change touches. A feature
none of these tools has gets no rule here; never invent an equivalent.

## A. Principles, whatever the tool

1. Name a test after the behaviour it protects, as the claim that is false
   when it fails: `test_flags_insufficient_contrast`, "mobile menu has no
   detectable axe violations after opening". Never name it after the file or
   function under test.
2. Test one behaviour per test. Several assertions are fine when they check
   that one behaviour.
3. Before the pull request, show each new test failing once: break the
   markup, the token, or the script under test, run the test, watch it fail,
   and restore it. Say so in the pull request.
4. Never weaken an expectation, skip a test, or paste observed output in as
   the expected value to make the suite pass; report the failure
   (`AGENTS.md`, "Do not").
5. Leave tests in other files as they are. When you rewrite a file, carry
   forward every test that still states a valid contract.
6. Run the suite the change touches first, then the full gate when rendered
   output changed (`AGENTS.md`, "Commands").

## B. Playwright specs

7. Each `test()` navigates itself and sets any viewport it needs itself; no
   test depends on another test's state (Playwright, "Best Practices", "Make
   tests as isolated as possible").
8. Make assertions web-first and await them:
   `await expect(menu).toHaveAttribute('aria-modal', 'true')`, never a value
   pulled out first, as in
   `expect(await menu.getAttribute('aria-modal')).toBe('true')` (Playwright,
   "Best Practices", "Use web first assertions").
9. Prefer `getByRole` and `getByLabel` locators. The repository's `data-*`
   hooks, such as `[data-nav-toggle]`, stay allowed. Use a CSS class selector
   only for markup the template does not own, such as the highlighter's
   `pre.highlight`. Decided by the maintainer on 2026-10-26.
10. When several pages are checked for the same behaviour, loop and call
    `test()` once per page with the page in the title, as
    `tests/accessibility.spec.js:82-83` does, so one page's failure does not
    hide another's.
11. Use a fixed wait only with a comment giving its reason and the source of
    the number, as at `tests/accessibility.spec.js:92-94`.
12. A test never reaches an external host. Assert a pinned CDN runtime by its
    tag and hash, as `tests/site-integrity.spec.js:119-128` does, not by
    fetching the CDN (Playwright, "Best Practices", "Avoid testing
    third-party dependencies").

Example, a title that states the claim
(`tests/accessibility.spec.js:31`):

```js
test('mobile menu has no detectable axe violations after opening', async ({ page }) => {
```

Counter-example, a title that names the file under test:

```js
test('mobile-menu.js', async ({ page }) => {
```

## C. axe scans

13. Scan the page in the state under test: after the menu opens, after the
    theme switches and its transition settles (Playwright, "Accessibility
    testing", "Configuring axe to scan a specific part of a page").
14. The expected result is an empty `violations` array. Never assert a count
    or a specific rule id as the pass condition.
15. Scope: bare `analyze()`, which runs axe's best-practice rules as well as
    the WCAG ones. Do not use `withTags()`: it would narrow what CI catches.
    Decided by the maintainer on 2026-10-26.
16. Attach the `incomplete` array, the items axe could not decide, to the
    test report with `testInfo.attach` so a person can review it; never
    discard it silently (axe-core API documentation, "Results Object";
    Playwright, "Accessibility testing", "Exporting scan results as a test
    attachment").
17. Use `exclude()` or `disableRules()` only with a comment linking the issue
    that tracks the known violation, and name that issue in the pull
    request's "Notes for review".

Example, a scan with the pass condition and the review items kept:

```js
test('mobile menu has no detectable axe violations after opening', async ({ page }, testInfo) => {
  // ... open the menu ...
  const results = await new AxeBuilder({ page }).analyze();
  await testInfo.attach('axe-incomplete', {
    body: JSON.stringify(results.incomplete, null, 2),
    contentType: 'application/json',
  });
  expect(results.violations).toEqual([]);
});
```

Counter-example, a narrowed scan with a count as the pass condition:

```js
const results = await new AxeBuilder({ page }).withTags(['wcag2aa']).analyze();
expect(results.violations.length).toBeLessThan(3);
```

## D. Minitest guard-script tests

18. Follow the pattern in `tests/color_contract_test.rb` and
    `tests/release_checks_test.rb`: a block helper that builds a temporary
    fixture and cleans up, the script run through `Open3.capture3` with the
    current Ruby, and an assertion on the exact output line, as at
    `tests/color_contract_test.rb:30-35`.
19. For each rule a guard script enforces, write two tests: one with a
    passing fixture and one with a single injected defect, as
    `test_flags_undefined_custom_property` and its siblings do, so a rule
    that stops firing is caught.
20. Write one test method per case. Freeze shared constants, such as
    `FIXTURE_FILES`, and declare them at the top of the class with a comment,
    as at `tests/color_contract_test.rb:15-25`.

Example, a method named for the claim (`tests/color_contract_test.rb:73`):

```ruby
def test_flags_insufficient_contrast
```

Counter-example, a method named for the script under test:

```ruby
def test_check_color_contract
```

## E. Fixture pages

21. A fixture page is a Jekyll page with `layout: test`, `robots: noindex`, a
    `permalink` under `/tests/`, and a Liquid comment stating its purpose and
    the selectors or behaviours it exercises, following
    `tests/4-objects/test-container.html:1-27`.
22. List each fixture a spec scans in that spec, with a comment saying what
    it covers, so a fixture nothing reads is visible.
23. Fixtures render only when `site.dev_only` is true
    (`_plugins/hide_test_pages.rb`); a test never changes that gate
    (`AGENTS.md`, "Settled decisions").

Example, front matter and purpose comment
(`tests/5-components/test-mobile-menu.html:1-11`):

```liquid
---
layout: test
title: Component Mobile Menu Test
permalink: /tests/5-components/test-mobile-menu/
robots: noindex
---

{% comment %}
  Component Mobile Menu Test Page
  Purpose: Visually verify that the 5-components mobile-menu system compiles
  and behaves correctly across the site.
```

Counter-example, no test layout, no `noindex`, a permalink outside
`/tests/`, and no purpose comment:

```liquid
---
title: Mobile menu
permalink: /mobile-menu/
---
```

## F. Where an expected value comes from

Decided by the maintainer on 2026-10-26: all three sources below.

24. A contrast threshold comes from WCAG 2.1, success criteria 1.4.3 (4.5:1)
    and 1.4.11 (3:1), cited in a comment.
    `scripts/check-color-contract.rb:243-255` encodes them and may be cited
    as the implementation.
25. A colour value, token name, or design dimension comes from the
    maintainer or from `_sass/0-settings/*`, cited in the test; the commit
    records the source in `Ground-truth-source:`.
26. A page list comes from `sitemap.xml` at run time, or from a constant with
    a comment saying why those pages, as at
    `tests/accessibility.spec.js:74-80`.
27. With no such source, assert a property, such as exactly one `main`
    landmark per page, and say so in the test's comment.

## G. Boundaries

Decided by the maintainer on 2026-10-26: axe rule selection and fixture
authoring are in this skill.

28. Manual keyboard, VoiceOver, NVDA, zoom, and reduced-motion checks stay in
    `ACCESSIBILITY_TESTING.md`. List under "Not verified", in the pull
    request's "Checks run", every manual check there that the change calls
    for and you could not run.
29. Static review of a markup diff for landmarks, heading order, and labels
    is the `open-pull-request` pre-check in #82, not this skill.
30. Which pages and components the template tests at all is the maintainer's
    call (`AGENTS.md`, "Do not"). You may propose one; cite the issue.
