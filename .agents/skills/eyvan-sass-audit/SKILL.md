---
name: eyvan-sass-audit
description: "Deep-audit Eyvan's `_sass/` ITCSS + BEM architecture and write `notes/SASS_AUDIT_REPORT.md`. Use when asked to audit Sass/SCSS architecture, token usage, BEM naming, specificity, accessibility CSS, or stale selectors."
---

# Eyvan SCSS Architecture Sub-Audit

You are running a **dedicated SCSS architecture audit** of the Eyvan Jekyll template. This sub-audit focuses exclusively on `_sass/` and its compiled entry point `assets/css/main.scss`. It is complementary to the main Eyvan template audit — do not duplicate build reliability, accessibility tooling, SEO, security, or documentation checks that belong to that report.

Your goal is an evidence-based audit of ITCSS layer compliance, BEM naming, selector specificity, design-token usage, responsive and motion patterns, CSS-level accessibility implementation, and dead/stale selectors. Produce a written report. **Do not rewrite the stylesheet.**

The one file you may create is the audit report (see Section 20). Do not modify any existing file.

---

## 1. Workflow Overview

Work in this order. Do not skip ahead.

1. **Recon** — map `_sass/` and confirm layer structure (Section 4).
2. **Layer map** — read `assets/css/main.scss` to verify import order (Section 4).
3. **Per-layer review** — read each layer against its contract, including Settings purity and per-token documentation (Section 9).
4. **File and identifier naming** — file names, mixin/function names, token names (Section 10).
5. **Documentation and comment style** — file-header and section-banner consistency (Section 11).
6. **Cross-cutting checks** — specificity, tokens (cross-layer sweep), responsive, motion, accessibility CSS, dead selectors (Sections 12–16).
7. **Report** — write `notes/SASS_AUDIT_REPORT.md` (Sections 20–21).

---

## 2. Audit Philosophy

Evaluate Eyvan's Sass as the stylesheet for **a visually minimalist, feature-rich Jekyll template**: clarity and maintainability matter more than architectural purity. Prefer the smallest safe correction over a principled rewrite.

- Separate **Evidence**, **Interpretation**, and **Recommendation** for every finding.
- Prefer documented exceptions over forced purity when the trade-off is clear.
- Do not penalise patterns that are intentional, documented, and constrained (e.g. `o-prose` scoping Markdown-generated output).
- Score based on what is present in the files, not on what is absent from a more elaborate system.

---

## 3. Eyvan Sass Architecture

Eyvan uses an ITCSS-inspired architecture with one project-specific extension layer (`6-layouts`). All layers are assembled, in order, by `assets/css/main.scss`.

```text
_sass/
  0-settings/    design tokens, config switches — Sass variables and maps only
  1-tools/        mixins and functions — no CSS output by default
  2-generic/      @font-face, normalize, reset, box-sizing
  3-base/         unclassed HTML element defaults; :root theme custom properties
  4-objects/      .o-* reusable structural patterns, cosmetic-light
  5-components/   .c-* complete designed UI pieces using BEM
  6-layouts/      .l-* page-level composition (Eyvan extension layer)
  7-trumps/       .u-* utilities, .is-* states, print, reduced-motion, overrides
```

The compiled import order must follow this sequence. If `assets/css/main.scss` is not available, request it before drawing conclusions about import order.

---

## 4. Initial Reconnaissance

Run these read-only commands to map the Sass architecture before reading any file in depth.

```bash
# Confirm layer folder structure
ls -1 _sass/

# List all Sass partials, sorted
find _sass -name '*.scss' | sort

# Read the entry point to verify import order
cat assets/css/main.scss

# Quick class-name inventory across all layers
grep -RhoE '\.[a-zA-Z][a-zA-Z0-9_-]*' _sass | sort -u | head -120

# Count selectors per layer (rough volume check)
for d in _sass/*/; do echo "$d: $(grep -rc '\.' "$d" 2>/dev/null | awk -F: '{s+=$2} END {print s}') selectors"; done
```

Map the project before reading files in depth. Identify: which layer folders exist, whether any are missing, whether `main.scss` exists and imports them, and approximate size of each layer. Read only representative files that are needed for the audit.

---

## 5. Command Safety Rules

Run only safe, read-only, or clearly low-risk commands. Do **not** run commands that modify source files, delete files, destructively clean build output, require secrets, or create commits/PRs.

Before running any npm script, Rake task, or shell script, inspect it first. If unclear or risky, do not run it — record it as "not run" and explain why.

The following are pre-approved when available:

```bash
bundle exec jekyll build
ruby scripts/check-color-contract.rb
npm run test
npm run test:a11y
```

If a command fails for an obvious environment reason, retry once. If it fails again, record it and move on.

---

## 6. Bailout and Timeout Rules

If any command hangs or takes unusually long, stop it, record it as timed out, and move on. If `bundle exec jekyll build` fails and retry does not resolve it, record the error clearly and note whether it appears to be a repository issue, environment issue, or unknown — then continue with the static source review.

---

## 7. ITCSS Principles to Enforce

Apply these throughout the layer-contract review:

1. Source order moves from broad to narrow.
2. Specificity increases slowly; it should not jump suddenly between layers.
3. Early layers affect large parts of the DOM with low specificity.
4. Later layers affect smaller, more explicit parts of the DOM.
5. A later rule should not routinely undo an earlier rule.
6. Every style should have one obvious home.
7. Exceptions are allowed only when intentional, documented, and limited.

---

## 8. BEM and Prefix Rules

### 8.1 Main prefixes

```scss
.o-container            // Object: structural layout pattern
.o-container--wide      // Object modifier
.o-grid__item           // Object element

.c-post-card            // Component: designed UI block
.c-post-card__title     // Component element
.c-post-card--featured  // Component modifier

.l-projects             // Layout: page-level composition
.l-projects__archive    // Layout element

.u-visually-hidden      // Utility / trump
.is-hidden              // State class (typically JS-toggled)
.has-toc                // Capability/state flag when needed
```

### 8.2 BEM naming checks

Flag these problems:

```scss
.post_card              // wrong: snake_case, no prefix
.c-post-card_title      // wrong: single underscore
.c-post-card__title--large__icon  // wrong: element of modifier, over-nesting
.card                   // suspect: missing Eyvan prefix
.products-list_item     // wrong: should be __item if BEM
```

Prefer:

```scss
.c-post-card
.c-post-card__title
.c-post-card__icon
.c-post-card--featured
```

### 8.3 State classes

Use state classes as separate classes alongside the BEM block, not as BEM modifiers for JS-toggled state:

```html
<!-- Good -->
<nav class="c-mobile-menu is-open">

<!-- Avoid -->
<nav class="c-mobile-menu c-mobile-menu--open-state-active-now">
```

```scss
// Good
.c-mobile-menu.is-open { transform: translateX(0); }
```

### 8.4 JavaScript hooks

Prefer `data-*` attributes as JS contracts. BEM classes are for styling; avoid using them as the only JS handle when a stable `data-*` attribute would be clearer.

```html
<!-- Preferred -->
<button class="c-theme-toggle" data-theme-toggle>

<!-- Acceptable -->
<div class="c-mobile-menu is-open">
```

---

## 9. Layer Contracts

This section is the primary audit checklist. For each layer, identify: rules that clearly belong, rules that might belong with documentation, rules in the wrong layer, rules creating unnecessary specificity, and likely stale rules.

### 9.1 `0-settings` — global tokens and config only

**Allowed:** Sass variables; Sass maps; config switches; breakpoints; spacing scales; typography scales; color role definitions; z-index scale; motion timing tokens.

**Flag:** Regular CSS selectors; component class selectors; layout decisions tied to one page; rules that emit CSS directly without a documented reason.

**Settings purity rule:** `0-settings` variables must be literal, self-contained Sass values (numbers, strings, hex/keyword colors, lists, maps). Flag any `0-settings` variable whose value is a CSS function call (e.g. `cubic-bezier()`, `color-mix()`, `calc()`) or that references `var(--custom-property)` — especially a custom property defined in a later layer such as `3-base`'s `:root` theme tokens. A Settings-layer token that depends on a CSS custom property emitted several layers later inverts the ITCSS dependency direction: the foundation layer must not depend on the cascade it is supposed to seed.

```scss
// Flag (High) — Settings variable depends on a custom property defined in 3-base
$elevation-rest: 0 0 0.125rem var(--color-ui-shadow-color);

// Flag (Medium) — Settings variable is a computed CSS function rather than a literal value
$anim-easing: cubic-bezier(0.4, 0, 0.2, 1);
```

**Eyvan note:** Theme color values may live here. Color tokens are defined as hex values based on the Material 3 (M3) color system, not OKLCH. Defining colors via M3 roles does not by itself prove WCAG contrast compliance — that requires testing actual foreground/background pairs (see Section 13.2).

Treat a Settings value containing `var(--...)` that resolves to a later-layer custom property as **High severity** (architectural dependency inversion — the most common way this surfaces is shadow/elevation tokens reaching into `3-base` theme colors). Treat a literal CSS function call with no later-layer dependency (e.g. a pre-computed `cubic-bezier()` curve) as at least **Medium severity** — Settings should hold the literal data, with any computed expression delegated to `1-tools` or to the consuming declaration, unless the project explicitly documents the function call as an accepted token format.

Run this sweep before reviewing `0-settings` files individually:

```bash
# Flag CSS function calls or var() references inside Settings-layer Sass variables
grep -nE '^\s*\$[a-zA-Z0-9_-]+\s*:.*\b(var\(|cubic-bezier\(|color-mix\(|calc\()' _sass/0-settings/*.scss
```

**Token documentation requirement:** every token defined in `0-settings` (spacing, typography, breakpoints, z-index, motion timing, config switches) must be documented with a comment explaining its purpose and an example of its usage. **Exception:** primitive color tokens that define the M3 theme palette (the raw hex role values themselves) are exempt from this requirement — document semantic color *usage* (which role maps to which UI purpose) rather than annotating every primitive hex value individually.

**Audit method — enumerate, do not summarize:** open every file in `0-settings` and list every token, or every tightly related token group (e.g. the four spacing aliases, the six z-index layers), as its own line item with a pass/fail status and a line citation. A file-level summary such as "spacing tokens are documented" is not sufficient evidence — the report must show that each token or group was individually checked. Record this in the **Token Documentation Findings** table (Section 21), not as a single row per file.

```scss
// Good — documented with purpose and usage example
// Base spacing unit for vertical rhythm between stacked text blocks.
// Usage: margin-block-end: $space-4; (e.g. paragraph spacing in .o-prose)
$space-4: 1rem;

// Flag — token with no explanation or usage example
$space-4: 1rem;
```

---

### 9.2 `1-tools` — mixins and functions only

**Allowed:** `@mixin` definitions; `@function` definitions; helper Sass variables that support mixins; media-query helpers; spacing/fluid-scale helpers; accessibility mixins (e.g. visually-hidden pattern).

**Flag:** CSS selectors that compile by default; component-specific styling; page-level layout styling; mixins so specific they belong in a component.

**Hard-coded constants in mixin bodies:** flag any mixin or function whose body contains a hard-coded literal (color, spacing, duration, easing curve, radius, shadow) that duplicates or should reference an existing or new `0-settings` token. A `1-tools` mixin is a *consumer* of Settings tokens, not a second source of constants. This applies even though the mixin itself produces no default CSS output — the literal still needs a token home so every consumer of the mixin shares one source of truth.

```scss
// Flag — mixin invents its own constant instead of consuming a Settings token
@mixin hover-scale {
  transition: transform 200ms ease;
  &:hover { transform: scale(1.04); }
}

// Preferred — mixin consumes Settings tokens
@mixin hover-scale {
  transition: transform settings-config.$transition-base;
  &:hover { transform: scale(settings-config.$hover-scale-factor); }
}
```

This is the same rule as Section 13.1's "no hard-coded values are acceptable," applied explicitly to `1-tools` — do not skip mixin bodies when sweeping for hard-coded literals just because the layer's default output is empty.

**Exception:** CSS declarations inside a `@mixin` body are fine — they do not output unless included.

---

### 9.3 `2-generic` — ground-zero styles

**Allowed:** `@font-face` declarations; Normalize/reset rules; global `box-sizing`; very broad, low-specificity normalization.

**Flag:** `.c-*`, `.o-*`, or `.l-*` class selectors; component colors, spacing, or borders; page-specific layout; typography decisions that belong in `3-base`.

**Eyvan note:** Self-hosted font declarations belong here — they are global browser setup, not component styling.

---

### 9.4 `3-base` — unclassed HTML elements

**Allowed:** `html`, `body`; headings `h1`–`h6`; `p`, `a`, `ul`, `ol`, `li`, `table`, `blockquote`; `code`, `pre`, `kbd`, `samp`; `img`, `video`, `audio`, `iframe`; CSS custom properties on `:root` and `html[data-theme]`; Rouge syntax-highlighting token classes (documented as generated-markup exceptions).

**Flag:** New component classes; page-level classes; utility classes; high-specificity selectors unless required by generated markup.

**Eyvan exceptions to document:**

- `:root` and `html[data-theme="dark"]` emitting CSS custom properties is acceptable — the active theme must be globally available.
- Rouge syntax classes (`.highlight`, `.c`, `.s`, etc.) may appear in `_syntax-highlighting.scss` because Jekyll/Rouge generates those classes.

---

### 9.5 `4-objects` — reusable structural patterns

**Allowed:** `.o-container`; `.o-grid`; `.o-grid__item`; structural width, flow, grid, flex, and measure rules; cosmetic-light layout primitives reusable across multiple components and pages.

**Flag:** Heavy color, borders, shadows, decorative backgrounds; component-specific UI (buttons, cards, nav, TOC); page-specific wrappers; object classes used only once that would be clearer as layout classes.

**Eyvan note:** `o-prose` is a likely special case — it scopes styles for Markdown-generated content. During the audit, decide whether it is an acceptable documented prose object or whether some rules should move to Base or Components. Do not move it automatically without checking markup impact.

---

### 9.6 `5-components` — designed UI pieces

**Allowed:** `.c-brand`; `.c-button`; `.c-post-card`; `.c-site-header`; `.c-site-footer`; `.c-mobile-menu`; `.c-theme-toggle`; `.c-toc`; `.c-post-share`; `.c-section-heading`; any other complete designed UI piece using BEM elements and modifiers.

**Flag:** Unprefixed class names; layout-only wrappers that belong in `6-layouts`; utility classes that belong in `7-trumps`; repeated cross-component patterns that should become objects; deep component coupling (one component styling another component's internals).

**Allowed component-owned descendant selectors (document, do not flag):**

```scss
.c-brand__logo svg { }
.c-icon-link svg { }
```

Flag only if they become broad, brittle, or cross-component.

---

### 9.7 `6-layouts` — page-level composition

**Allowed:** `.l-default`; `.l-homepage`; `.l-projects`; `.l-tag-page`; page-level spacing and compositional rules; layout elements such as `.l-projects__heading` and `.l-projects__archive`.

**Flag:** Component cosmetics (button colors, card shadows); generic reusable grid/container logic that belongs in `4-objects`; global element styling that belongs in `3-base`; utilities or overrides that belong in `7-trumps`.

**Eyvan note:** This layer is not in the default seven-layer ITCSS model, but it is valid for Eyvan — page-level Jekyll layouts need a clear home. It must sit after Components and before Trumps in `main.scss`.

---

### 9.8 `7-trumps` — utilities, states, print, overrides

**Allowed:** `.u-*` utilities; `.is-*` state classes; `.has-*` capability/state flags; print overrides; reduced-motion overrides; accessibility helpers; test-only helpers; limited, intentional `!important` declarations.

**Flag:** Large components built in the utilities layer; repeated overrides that indicate an earlier layer is wrong; `!important` used to avoid fixing source order; stale legacy selectors not found in templates, includes, posts, or tests.

**Eyvan note:** Print styles often need broad element selectors inside `@media print` — acceptable if intentional and documented. Still audit for old class names such as `.container`, `.row`, `.col`, or unused article/filter classes from previous iterations.

---

## 10. File and Identifier Naming Audit

Confirm that file names, mixin/function names, and token names accurately describe what they contain or do — across **every** ITCSS layer, not only `5-components`. This is a distinct concern from BEM naming (Section 8) and dead-selector staleness (Section 16): a name can be live, correctly BEM-formatted, and still be the wrong name.

### 10.1 File naming vs. content

For each `.scss` partial, confirm the filename matches its primary BEM block, token domain, or responsibility.

```text
_sass/5-components/_navigation.scss   defines  .c-nav        → mismatch: rename to _nav.scss or document the mapping
_sass/1-tools/_motion.scss            defines  motion mixins → fine, name matches domain
_sass/0-settings/_config.scss         defines  geometry/elevation/motion/z-index tokens → fine if header documents the combined scope
```

Flag a mismatch whenever the filename implies one responsibility but the file's primary selector, mixin, or token group is named differently, is broader, or is narrower than the filename suggests. Apply this check to **all eight layers**, including `0-settings` and `1-tools` — not only `5-components`, where it is easiest to notice.

### 10.2 Mixin and function naming

For every `@mixin` and `@function` — primarily in `1-tools`, but anywhere one is defined — confirm the name describes its actual behavior rather than an unrelated or overly generic concept.

```scss
// Good — name matches behavior
@mixin visually-hidden { ... }       // hides visually, keeps in the AT tree
@mixin focus-ring { ... }            // applies a focus ring

// Flag — name does not describe behavior, or is too generic to be useful
@mixin do-thing { ... }
@mixin fix { ... }
@mixin helper-1 { ... }
```

Also flag a mixin whose name implies one concern but whose body does two unrelated things (e.g. a mixin named `hover-scale` that also sets unrelated layout properties) — split it, or rename it to reflect the full scope.

### 10.3 Token naming vs. token group

Confirm token names are consistent within their own group (e.g. all spacing tokens share the `$space-*` stem, all breakpoints share `$bp-*`) and that the name reflects the token's **role**, not its raw value.

```scss
// Good — name encodes role
$bp-md: 48em;

// Flag — name encodes the literal value instead of its semantic role
$48em: 48em;
```

Report findings in the **File and Identifier Naming Findings** table (Section 21).

---

## 11. Documentation and Comment Style Consistency

Eyvan requires one consistent style for **file-header documentation blocks** and one consistent style for **in-file section/banner comments**. Inconsistency here is itself a finding, even when the underlying CSS is fully correct — do not let "documentation exists" stand in for "documentation is consistent."

### 11.1 Determining the canonical file-header style

Before flagging any file, establish the canonical header template empirically — do not assume a template from memory or from this skill file:

1. Sample header comments from at least 3–4 files in `5-components/` (the most consistently documented layer in prior audits).
2. Identify the common structure: which fields are present (e.g. file purpose, dependencies, what the file owns vs. does not own), the comment delimiter style (`//` line comments vs. `/* */` block comments), and field ordering.
3. Treat that structure as the canonical template for this audit run, and state it explicitly in the report.
4. Compare every other partial's header — across all eight layers — against that template. Do not skip `0-settings`, `1-tools`, or `2-generic` just because they are early layers; the documentation standard applies equally to every file.

Flag any header that:

- Uses a different comment-delimiter style than the canonical template.
- Is missing fields that the canonical template includes.
- Has no header at all where every other file in the same layer has one.

### 11.2 Canonical section/banner comment style

Use this banner style for internal section dividers inside a Sass partial:

```scss
/* —————————————————————————————
   Section Title
   ————————————————————————————— */
```

If the codebase's dominant style differs from this template, treat the dominant style (by frequency across all layers) as canonical instead, and flag the minority style. Flag any in-file section comment that uses a different banner character, inconsistent dash length, or a mixed style (e.g. one file using `====` banners and another using `----` banners for the same purpose).

### 11.3 Audit method

Do not summarize documentation-style compliance at the file-count level only (e.g. "12 of 14 files pass"). List every file with a header or banner-comment deviation individually, with the specific deviation and a line citation, in the **Documentation Style Findings** table (Section 21).

---

## 12. Selector Specificity Rules

### 12.1 Prefer low-specificity selectors

```scss
// Good
.c-post-card__title { }

// Use with care — adds context specificity
.c-post-card:hover .c-post-card__title { }

// Avoid unless no other option
body .l-default .c-post-card .c-post-card__body .c-post-card__title { }
```

### 12.2 Avoid ID selectors in Sass

IDs are acceptable for HTML anchors and ARIA relationships. Do not use them as CSS selectors in Sass.

```scss
// Flag
#main-content { }
#projects-title { }

// Prefer
.l-projects__content { }
```

### 12.3 Flag source-order fights

Flag patterns where a lower layer sets a rule and a later layer routinely cancels it:

```scss
// 3-base
img { border-radius: 0.75rem; }   // too opinionated

// 5-components
.c-brand img { border-radius: 0; }

// 7-trumps
.u-no-radius img { border-radius: 0 !important; }
```

The root cause is an overly opinionated base rule.

---

## 13. Token and Color Audit

### 13.1 Prefer tokens over hard-coded values

Flag hard-coded colors, spacing, z-index, breakpoints, and transitions when a token already exists. **This check applies to every layer — `0-settings`'s own purity (Section 9.1), `1-tools` mixin/function bodies (Section 9.2), `2-generic` and `3-base` element styles, and every layer above. A hard-coded literal inside a mixin or a base element rule is just as much a finding as one inside a component.** Do not restrict this sweep to `4-objects` and above.

```scss
// Good
color: var(--color-on-surface);
background-color: var(--color-surface);
margin-block-end: settings-spacing.$space-4;
transition: settings-config.$transition-base;

// Flag
color: #333;
margin-bottom: 24px;
transition: all 0.2s ease;
```

**No hard-coded values are acceptable.** If a value does not yet have a corresponding token, the fix is not to leave the literal in place with an explanatory comment at the point of use — the fix is to **add a new token to `0-settings`**, with a comment there explaining why the value exists and is distinct from existing tokens (per the documentation requirement in Section 9.1), then reference that token at the call site. A literal value with no token is always a finding; "explained but hard-coded" is not an acceptable end state.

**Comprehensive sweep — run across all of `_sass/`, not a sample:**

```bash
# Raw hex colors anywhere outside 0-settings (color tokens themselves)
grep -rnE '#[0-9a-fA-F]{3,8}\b' _sass/ --include='*.scss' | grep -v '_sass/0-settings/'

# Hard-coded durations not expressed as a settings token
grep -rnE '[0-9]+(\.[0-9]+)?(ms|s)\b' _sass/ --include='*.scss' | grep -v 'settings-'

# Easing curves defined or used outside 0-settings
grep -rnE 'cubic-bezier\(' _sass/ --include='*.scss'

# Hard-coded px/rem/em values inside layers that should consume tokens, not invent them
grep -rnE '[0-9]+(px|rem|em)\b' _sass/1-tools _sass/2-generic _sass/3-base --include='*.scss'
```

For every match, check whether an existing `0-settings` token already covers the value (finding: replace with the token) or whether none exists (finding: add a new token per the rule above). Do not stop at the first few matches — every hit from this sweep is a candidate finding for the **Token Usage Findings** table (Section 21).

### 13.2 Contrast verification

Do not conclude that contrast is accessible solely because colors are defined as M3-based hex tokens or in Material-style semantic roles. Test actual foreground/background pairs.

Run Eyvan's color-contract script when available:

```bash
ruby scripts/check-color-contract.rb
```

If the script is unavailable, flag contrast claims as needing manual or automated verification. Do not invent WCAG scores.

---

## 14. Responsive and Motion Audit

### 14.1 Breakpoints

Check that breakpoints use settings variables rather than hard-coded values.

```scss
// Preferred
@media (min-width: settings-breakpoints.$bp-layout) { }

// Flag
@media (min-width: 837px) { }
```

Hard-coded breakpoint values are acceptable only with an explanatory comment.

### 14.2 Motion tokens and reduced-motion

Check that transitions use motion tokens. Confirm that reduced-motion is handled in `7-trumps` or through reusable mixins.

```scss
// Preferred
transition: settings-config.$transition-base;

// Flag
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);  // (without reason comment)
```

Confirm `@media (prefers-reduced-motion: reduce)` is present and overrides animated transitions and transforms.

---

## 15. Accessibility CSS Audit

Check the Sass source for CSS-level accessibility requirements:

1. **Focus states** — visible `:focus` and `:focus-visible` styles must be present on interactive elements; they must not be `outline: none` or `outline: 0` without a replacement.
2. **Hover/keyboard parity** — every `:hover` interaction must have an equivalent `:focus` or `:focus-visible` state.
3. **Reduced motion** — `@media (prefers-reduced-motion: reduce)` must override animated transitions and transforms.
4. **Color as sole indicator** — color must not be the only visual means of conveying state or information where meaning matters.
5. **Print** — print output must remain readable; verify print styles do not hide essential content.
6. **Visually hidden** — `.u-visually-hidden` (or equivalent) must use the correct pattern to keep content available to assistive technology.
7. **Focus traps** — mobile menu and TOC states must not produce hidden or trapped focus through CSS alone (`display: none`, `visibility: hidden`, `pointer-events: none` must be paired with correct ARIA in templates).

Run the automated accessibility suite if available:

```bash
npm run test:a11y
```

Report which tool ran, which did not, and why. These checks complement — not replace — the full accessibility tool run in the main audit.

---

## 16. Dead Selector and Legacy Audit

Search for each SCSS class name in templates, includes, posts, JavaScript, and tests before classifying a selector as stale.

### 16.1 Search commands

```bash
# Inventory all class-like selectors in _sass/
grep -RhoE '\.[a-zA-Z][a-zA-Z0-9_-]*' _sass | sort -u

# Search for a specific class across the full project
grep -R "c-post-card" _includes _layouts _posts assets/js tests *.html 2>/dev/null

# Broad search for all o-/c-/l-/u- classes used in templates
grep -RhoE 'class="[^"]*"' _includes _layouts *.html 2>/dev/null | grep -oE '[oclU]-[a-zA-Z0-9_-]+'
```

### 16.2 Classification

Use exactly one of these labels per finding:

```text
Confirmed stale:  not found in any template, include, post, JS, or test; safe to remove.
Candidate stale:  not found by grep, but may be generated dynamically by Liquid or JS.
Keep:             used by template, include, JS, tests, or generated content.
```

Liquid-generated class names and JS-toggled state classes can be missed by a simple `grep`. Do not delete a selector if you are not certain.

---

## 17. Required Files for a Complete Audit

A complete audit requires these files. If a file listed in `structure.txt` is not available, request it before drawing conclusions that depend on it.

```text
assets/css/main.scss            (import order)
_sass/0-settings/               (or 0-settings.scss)
_sass/1-tools/                  (or 1-tools.scss)
_sass/2-generic/                (or 2-generic.scss)
_sass/3-base/                   (or 3-base.scss)
_sass/4-objects/                (or 4-objects.scss)
_sass/5-components/             (or 5-components.scss)
_sass/6-layouts/                (or 6-layouts.scss)
_sass/7-trumps/                 (or 7-trumps.scss)
```

Supplementary files for cross-referencing selector usage:

```text
_includes/    _layouts/    _posts/    assets/js/    tests/    *.html
```

---

## 18. Severity Levels

| Level | Definition |
|---|---|
| **Critical** | Breaks the build, causes a major layout failure, makes UI inaccessible, or prevents styles from loading. |
| **High** | Wrong layer placement or selector architecture likely to cause long-term cascade problems. |
| **Medium** | BEM inconsistency, token misuse, moderate specificity issue, or duplicated pattern. |
| **Low** | Comment cleanup, minor naming clarity, small documentation improvement. |
| **Info** | Observation only — no change required. |

---

## 19. Layer Compliance Scoring

Score each layer pass/issues after review. Record the overall status as one of:

- **Pass** — no critical or high issues; layer contract is respected.
- **Pass with issues** — minor or medium issues present; no critical or high.
- **Needs cleanup** — one or more high issues.
- **Critical** — one or more critical issues.

This layer table is the summary input for the Scorecard section of the main Eyvan audit report.

---

## 20. Output Location

Write the final audit report as a **new Markdown file** at `notes/SASS_AUDIT_REPORT.md`. This is the only file you may create; do not modify any existing file.

---

## 21. Required Report Format

````markdown
# Eyvan SCSS Architecture Audit Report

**Audit date:** YYYY-MM-DD

## Executive Summary

- **Overall status:** Pass / Pass with issues / Needs cleanup / Critical
- **Build status:** Pass / Fail / Not run
- **Main risk:** ...
- **Recommendation:** (one of) No changes needed · Small safe fixes · Targeted refactor · Block release until fixed

## Layer Compliance Summary

| Layer        | Status             | Main notes                      |
|---|---|---|
| 0-settings   | Pass / Issues      | ...                             |
| 1-tools      | Pass / Issues      | ...                             |
| 2-generic    | Pass / Issues      | ...                             |
| 3-base       | Pass / Issues      | ...                             |
| 4-objects    | Pass / Issues      | ...                             |
| 5-components | Pass / Issues      | ...                             |
| 6-layouts    | Pass / Issues      | ...                             |
| 7-trumps     | Pass / Issues      | ...                             |

## Findings

| ID | Severity | File | Issue | Evidence | Recommendation |
|---|---|---|---|---|---|
| SCSS-001 | Medium | `_sass/4-objects/_prose.scss` | Scoped prose rules blur Object/Base boundary | `.o-prose h2` etc. | Keep as documented exception or split prose element rules. |

## BEM Naming Findings

| Selector | File | Problem | Fix |
|---|---|---|---|
| `.example_item` | ... | Single underscore | `.example__item` |

## Specificity Findings

| Selector | File | Problem | Recommendation |
|---|---|---|---|

## Token Usage Findings

| Property | Hard-coded value | File | Available or new token | Recommendation |
|---|---|---|---|---|

## Settings Purity Findings

List every `0-settings` variable whose value contains a CSS function call or a `var(--...)` reference (Section 9.1). Do not omit this table even if empty — state "None found" explicitly with the sweep command used.

| Token | File | Issue | Severity | Recommendation |
|---|---|---|---|---|
| `$elevation-rest` | `_sass/0-settings/_config.scss` | Value references `var(--color-ui-shadow-color)`, a custom property defined in `3-base` | High | Store the literal shadow geometry here and compose the color at the point of use, or document the exception explicitly. |
| `$anim-easing` | `_sass/0-settings/_config.scss` | Value is a `cubic-bezier()` function call rather than a literal token | Medium | Acceptable only as a documented exception; otherwise store control points as data. |

## Token Documentation Findings

List **every token or tightly related token group individually** — one row per token/group, not one row per file. A file-level "Pass" summary is not acceptable evidence (Section 9.1).

| Token / Group | File | Line | Purpose comment? | Usage example? | Status | Note |
|---|---|---|---|---|---|---|
| `$space-4` | `_sass/0-settings/_spacing.scss` | 12 | Yes | Yes | Pass | — |
| `$anim-easing` | `_sass/0-settings/_config.scss` | 34 | No | No | Fail | Also a Settings Purity finding — see above. |

## File and Identifier Naming Findings

| File / Identifier | Layer | Issue | Recommendation |
|---|---|---|---|
| `_navigation.scss` | 5-components | Defines `.c-nav`, not `.c-navigation` | Rename file to `_nav.scss` or document the mapping |

## Documentation Style Findings

State the canonical header template and canonical banner style identified per Section 11.1–11.2 before listing deviations.

**Canonical header template (observed in `5-components/...`):** ...
**Canonical banner style:** ...

| File | Deviation | Recommendation |
|---|---|---|
| `_sass/0-settings/_dark-mode.scss` | Header omits the purpose/dependency fields present in the canonical template | Rewrite header to match canonical template |
| `_sass/2-generic/_normalize.scss` | Section banners use a different dash style than the canonical banner | Standardize banner style |

## Accessibility CSS Findings

| Check | File | Status | Notes |
|---|---|---|---|
| Focus states visible | ... | Pass / Fail | ... |
| Reduced-motion coverage | ... | Pass / Fail | ... |

## Stale Selector Candidates

| Selector | File | Search result | Label | Recommendation |
|---|---|---|---|---|
| `.old-class` | ... | Not found in templates | Candidate stale | Verify manually, then remove. |

## Recommended Patch Plan

1. Critical / build-breaking fixes (if any).
2. Settings purity violations (`var()`/function calls in `0-settings`) — these are architectural, fix before cosmetic items.
3. High-severity layer misplacement fixes.
4. BEM naming consistency — update Sass, Liquid, Markdown, JS, and tests together.
5. Token substitutions for hard-coded values, including those found inside `1-tools` mixins.
6. File and identifier naming corrections (Section 10).
7. Documentation header and comment-style standardization (Section 11).
8. Document intentional exceptions in comments.
9. Optional refactors after tests pass.

## Commands Run

```bash
# list actual commands run
bundle exec jekyll build
ruby scripts/check-color-contract.rb
npm run test:a11y
```

Result: pass / fail / not run — brief note for each.

## Commands Not Run

Explain why each command was skipped.
````

---

## 22. Safe Fix Strategy

When making fixes after the audit:

1. Change one layer or component at a time.
2. Keep class renames synchronized across Sass, Liquid, Markdown, JS, and tests.
3. Prefer moving rules over rewriting them.
4. Prefer documenting intentional exceptions over forcing artificial purity.
5. Run `bundle exec jekyll build` after each meaningful group of changes.
6. Do not introduce Tailwind, Bootstrap, PostCSS, Vite, or another frontend framework to solve Sass organisation problems.

---

## 23. Eyvan-Specific Watch List

Pay special attention to these areas:

1. **`4-objects` / prose styles** — decide whether `.o-prose` is an acceptable documented Markdown-prose object or whether some rules should move to Base or Components.
2. **`5-components` / nested selectors** — check for cross-component coupling or selectors that inadvertently style sibling components.
3. **`6-layouts`** — keep page composition here; flag component cosmetics that have leaked in.
4. **`7-trumps` / print styles** — audit for legacy selectors such as `.container`, `.row`, `.col`, or unused article/filter classes from previous iterations.
5. **`3-base` / syntax highlighting** — keep Rouge token classes documented as generated-output exceptions.
6. **`2-generic` / fonts** — verify font paths are correct; check that no font licensing text is unnecessarily embedded in CSS comments.
7. **Token usage** — replace unexplained hard-coded values with existing settings variables or CSS custom properties.
8. **JS-coupled selectors** — preserve `.is-*` state classes and `data-*` hooks unless the corresponding JavaScript is also updated.
9. **`0-settings` / `_config.scss`** — check elevation, shadow, and easing tokens specifically for `var()` references into `3-base` and for unliteral CSS function calls; this is the most likely place for a Settings-purity violation.
10. **`1-tools` / `_mixins.scss` and `_motion.scss`** — check every mixin body for hard-coded literals (durations, easing, radii, colors) that should be Settings tokens instead of invented locally.
11. **Documentation and header consistency** — `0-settings` and `2-generic` files have drifted from the canonical `5-components` header/banner style in past audits; check these two layers specifically, not only as a sample.

---

## 24. Completion Criteria

The audit is complete when all of the following are true:

1. `assets/css/main.scss` import order has been verified, or the file has been requested.
2. Each of the eight ITCSS layer folders has a pass/issues status.
3. BEM naming has been checked across all layers.
4. All intentional exceptions are documented.
5. Stale selectors are labelled as confirmed stale, candidate stale, or keep.
6. Build and test status is reported honestly, including what was not run and why.
7. The recommended patch plan is small, ordered, safe, and coordinated across Sass, Liquid, JS, and tests.
8. Every `0-settings` token, or tightly related token group, has been individually checked for a purpose-and-usage comment and reported as its own row — not summarized at the file level — with exceptions only for M3 primitive color values.
9. Every `0-settings` variable has been checked for CSS function calls (`cubic-bezier()`, `color-mix()`, `calc()`) and for `var(--...)` references into later layers, with severity assigned per Section 9.1.
10. The hard-coded-value sweep (Section 13.1) has been run across **all** layers, including `1-tools` mixin bodies, `2-generic`, and `3-base` — not only `4-objects` and above.
11. Every file name and every mixin/function name has been checked against its actual content or behavior (Section 10), across all eight layers.
12. The canonical file-header and section-banner styles have been established from multiple `5-components` samples and every partial in every layer has been compared against them (Section 11), with deviations cited individually.
