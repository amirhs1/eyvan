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
- Heading weight reduced from Bold/Black (700/900) to Medium (500): the
  shared `h1`–`h6` rule, the homepage hero title, post titles, and
  `.c-section-heading--lg` (About/Projects/tag-archive titles and the
  homepage "Latest Projects" heading). Bold or Black weight in the condensed
  Barlow Condensed display face compresses letter counters and apertures at
  large sizes, reducing legibility for low-vision and dyslexic readers;
  Medium (also self-hosted) keeps the condensed display identity while
  opening up letterforms. Visual hierarchy is still conveyed by size.
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
