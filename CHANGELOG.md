# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial release of the Eyvan template: a minimalist, accessibility-first
  Jekyll portfolio and writing template for GitHub Pages, with an ITCSS/BEM
  Sass architecture, reusable long-form content includes (figures, video,
  audio, tables, cross-references), light/dark theming, and a GitHub Actions
  build-and-deploy pipeline gated by a Playwright + axe accessibility suite.
- Dependabot configuration for Bundler, npm, and GitHub Actions, so dependency
  and security updates surface automatically as pull requests.
- `.ruby-version`, with both CI workflows reading the Ruby version from it
  instead of duplicating the version number inline.
- Optional `width` / `height` support on `figure.html` (single- and
  multi-image), letting the browser reserve layout space for images before
  they load and preventing cumulative layout shift; applied to the figures in
  the existing example posts using their real measured pixel dimensions.
- An accessibility test covering a code-heavy page in both light and dark
  themes.
- `SECURITY.md` and `CONTRIBUTING.md`.
- This changelog.

### Changed

- The opt-in MathJax loader now uses the exact reviewed 4.1.2 CDN release,
  SHA-384 Subresource Integrity, anonymous CORS, a no-referrer policy, and
  ordered deferred loading; release checks reject mutable or unprotected
  replacements.
- The removable climate demo now declares an exact Chart.js 4.5.1 CDN script
  with SHA-384 Subresource Integrity and privacy attributes instead of
  dynamically executing an unversioned package URL.
- Reworked the color system into a clean three-tier token hierarchy. **Tier 2**
  — the per-persona/mode semantic layer in `0-settings` — is now a consistent
  33-token contract (13 UI + 4 state + 16 Base16 syntax): it gains
  `--color-text-inverse` (text on accent fills) and `--color-ui-border-subtle`
  (the low-emphasis header/footer divider the codebase previously faked), and
  drops the redundant `--color-body-bg` / `--color-body-color` aliases of
  `--color-ui-bg` / `--color-ui-text`. **Tier 3** — component-intent aliases
  (`--color-link*`, `--color-button-*`, `--color-tag-*`, `--color-selection-*`)
  — now lives in `3-base/_base.scss` as theme-agnostic `var()` aliases of
  Tier 2, defined once (they inherit the light/dark switch automatically) so
  each component role stays self-documenting and keeps a single point to
  diverge from the shared accent later.
- Light-mode brand color moved from indigo/blue to the Persian turquoise
  family, so both themes now share one brand hue at two lightness steps: new
  `$clr-p-teal-deep` (`#00796B`, 5.32:1 on white) drives light-mode links,
  buttons, focus rings, and text selection, with `$clr-p-teal-deeper`
  (`#00564B`) as the hover step; dark mode keeps turquoise `#3FE0D0`. The
  browser `theme-color` metas and the JS fallbacks in `theme-toggle.js` /
  `demo-climate-charts.js` follow the same change. Titles and headings stay
  neutral (body text color), and indigo and blue remain in the palette as
  syntax-highlighting accents.
- Tag chips now have their own semantic tokens (`--color-tag-bg`,
  `--color-tag-bg-hover`, `--color-tag-text`) instead of reusing the button
  tokens, keeping their heritage indigo/blue identity in the light theme
  while buttons carry the teal brand; dark-theme chips are unchanged
  (turquoise, matching dark buttons).
- Light-mode tag chips now point those tokens at the brand teal
  (`$accent-primary` / `$accent-secondary`), matching `.c-button` instead of
  the heritage indigo/blue, so tags and buttons share one hue again in both
  themes (dark-theme chips were already teal/turquoise and are unchanged).
- Heading weight: the previous pass's Medium (500) read too light across
  the board, so the shared `h1`–`h6` rule, post titles, and
  `.c-section-heading--lg` (About/Projects/tag-archive titles and the
  homepage "Latest Projects" heading) are back to Bold (700) —
  `.c-section-heading--lg` had been Black (900) before that pass and now
  matches `.c-section-heading--md`. The homepage hero title keeps a lighter
  touch via a new self-hosted Semi-Bold (600) cut of Barlow Condensed,
  balancing the condensed face's legibility at very large sizes against the
  bold display identity. Post titles also gained a touch more line-height
  (1.08 → 1.1) to keep Bold from feeling cramped. Visual hierarchy is still
  conveyed primarily by size.
- The desktop theme toggle now sits immediately before Home in the centered
  navigation cluster, using the same spacing rhythm as the navigation items.
- The two homepage hero actions now share equal-width columns across the same
  measure as the hero description and stack into a single column on narrow
  screens.
- The desktop table of contents now uses the same code-surface background as
  the desktop share rail, while mobile TOC surfaces remain unchanged.
- The code-heavy accessibility test now also scans a post whose code samples
  contain comment and gutter tokens, closing the coverage gap that let the
  light-theme comment-contrast defect through CI.

### Fixed

- 41 component declarations referenced 10 CSS custom properties that
  `_base.scss` never defined — among them `--color-text`, `--color-text-muted`,
  `--color-border`, `--color-surface`, and `--color-primary`. Because an
  undefined `var()` invalidates its whole declaration, this silently broke the
  skip-link background, every `<hr>`, the icon-link and theme-toggle outlines,
  the sticky-header and footer top borders, the table-of-contents active/hover
  state, the footer text hierarchy, and the dark-mode heading color. Every
  consumer now resolves to a defined token across the three-tier contract.
- Card and hero hover shadows referenced an undefined `--color-shadow-rgb`,
  always falling back to black and leaving the dark-mode "lift" invisible
  against the near-black canvas; they now reuse the theme-aware
  `--color-ui-shadow-color`.
- Print styles hard-coded `#fff` / `#000`; they now reference the palette's
  `$clr-white` / `$clr-black`, so the design system has no literal colors
  outside `0-settings`.
- Removed the dead `$theme` / `$mode` Sass flags from `_config.scss`; the
  pipeline never read them (persona is chosen in `_colors.scss`, light/dark is
  a runtime `data-theme` switch).
- Undefined `--color-heading` custom property: `_base.scss` emitted
  `--color-heading-color` while every component consumes
  `var(--color-heading)`, so the semantic heading color silently never
  applied and headings fell back to body text color in both themes — the
  same defect shape as the `--color-link` mismatch fixed earlier. The token
  chain now resolves; the light theme deliberately maps it to the body text
  color (titles keep their established neutral look) and the dark theme to
  white.
- Insufficient color contrast on syntax-highlighted comments and line-number
  gutters in the light theme (`base03`, 3.27:1 against the code background —
  flagged in two audits but live until now because the CI-scanned page renders
  no comment tokens). Light `base03` now uses the existing `$clr-gray-400`
  (5.55:1); the dark theme is unchanged.
- Insufficient color contrast on syntax-highlighted strings and numbers in the
  light theme, and on variables in the dark theme — found by the new
  code-heavy-page accessibility test (WCAG 2.1 AA, `color-contrast`). New
  `$clr-p-green-dark` / `$clr-p-orange-dark` / `$clr-p-red-light` palette
  variants replace the previous tokens in those specific Base16 slots only;
  the brand palette and UI semantic colors (links, buttons, state colors) are
  unchanged.
- Non-unique accessible names on overflowing code blocks — when a page had
  more than one, `code-block-a11y.js` gave each a literal `aria-label="Code
  sample"`, which axe flags as indistinguishable landmarks (`landmark-unique`).
  Each region now gets a numbered label (`Code sample 1`, `Code sample 2`, …).
