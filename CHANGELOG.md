# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A "Multi-image figure grids" walkthrough in the *Front Matter Field
  Reference* demo post, documenting the `images="…"` parameter, its
  pipe-delimited `path | alt | WxH | srcset | sizes` row format, and the
  `cols` option — the one `figure.html` surface that previously had no
  step-by-step guide outside the include's own comment header.
- A step-by-step custom-domain / `CNAME` section in the README, covering the
  `CNAME` file, GitHub Pages settings, the apex/subdomain DNS records, and the
  `baseurl: ""` adjustment a root-served custom domain requires.

## [1.0.0] - 2026-06-17

### Added

- Initial release of the Eyvan template: a minimalist, accessibility-first
  Jekyll portfolio and writing template for GitHub Pages, with an ITCSS/BEM
  Sass architecture, reusable long-form content includes (figures, video,
  audio, tables, cross-references), light/dark theming, and a GitHub Actions
  build-and-deploy pipeline gated by a Playwright + axe accessibility suite.
- `THIRD_PARTY_NOTICES.md`, documenting bundled font, icon, demo media, and
  optional demo integration license scope separately from the repository's MIT
  license.
- `SECURITY.md` and `CONTRIBUTING.md`.
- This changelog.
- A site-level `lang` configuration value, used by the root HTML element with
  an English fallback for template adopters.
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
- `scripts/check-color-contract.rb` (`npm run test:colors`), a deterministic
  static guard that runs in CI and checks: every consumed `var(--color-*)`
  resolves to a Tier-2 definition in `_base.scss`; the brand accent in
  `_data/theme.yml` stays in sync with both mode files' `$accent-primary`
  fallback, the JS theme fallbacks, and `head.html`'s `theme-color` meta, and
  the retired teal/turquoise hexes (`#00796B`, `#3FE0D0`) never reappear; and
  every key text/UI/syntax token pair — including the Base16 operator color
  `base0c` — meets WCAG 2.1 AA contrast in both themes.
- Two new Tier-2 surface tokens, `--color-ui-surface-raised` and
  `--color-ui-surface-overlay`, plus a formal `$elevation-rest` /
  `$elevation-raised` / `$elevation-overlay` ladder in `_config.scss`,
  completing the elevation token model (Tier 2 is now 35 tokens: 15 UI + 4
  state + 16 Base16). `check-color-contract.rb` contrast-checks text against
  both new surfaces in both themes.
- `scripts/check-built-output.rb`, run in CI against the built `_site/`,
  statically enforces the MathJax and Chart.js-demo CDN loader policy (pinned
  version, SHA-384 Subresource Integrity, anonymous CORS, no-referrer,
  deferred loading, `async` forbidden) and rejects published repository-only
  files, source maps, and the excluded `/assets/files/resume.pdf` sitemap
  entry.
- Optional responsive image variants: `figure.html` accepts
  `responsive_srcset` / `responsive_sizes` for single- and multi-image
  figures, a new standalone `_includes/responsive-srcset.html` normalizes
  `path | descriptor` rows into a baseurl-safe `srcset` / `sizes` pair, and
  the *Setting Up Eyvan* and *Front Matter Field Reference* posts document a
  no-bundler `cwebp` workflow for generating the variants.
- New *Theming Eyvan* demo post, split out from the setup guide as a dedicated
  walkthrough for changing the look. It documents the color-token architecture
  (`_data/theme.yml` as the brand single source of truth plus the
  `0-settings/_light-mode.scss` / `_dark-mode.scss` role files), a no-code
  Material Theme Builder workflow for re-branding, the four-place brand-hex sync
  rule that `scripts/check-color-contract.rb` enforces, and where the font
  families and spacing scale live.

### Changed

- README attribution is now a concise acknowledgment section that points to the
  detailed third-party notices and bundled font license map.
- Contributor QA documentation now calls out the Ruby version file, Node 20 CI
  baseline, `npm ci`, and Playwright-backed checks.
- Shipped demo post covers and the homepage hero image now provide measured
  intrinsic dimensions where they were previously missing, improving layout
  stability without adding an image pipeline.
- The opt-in MathJax loader now uses the exact reviewed 4.1.2 CDN release,
  SHA-384 Subresource Integrity, anonymous CORS, a no-referrer policy, and
  ordered deferred loading; release checks reject mutable or unprotected
  replacements.
- The removable climate demo now declares an exact Chart.js 4.5.1 CDN script
  with SHA-384 Subresource Integrity and privacy attributes instead of
  dynamically executing an unversioned package URL.
- Migrated the color system to **Material 3** with a two-tier token model.
  Tier 1 is the per-mode semantic Sass layer (`0-settings/_light-mode.scss` +
  `_dark-mode.scss`), now using the exact M3 role names — `primary`,
  `secondary`, `tertiary`, `error`, the surface / `on-surface` ramp, `outline`,
  `inverse-*` — plus full four-role `warning` / `info` / `success` extensions
  and the 16 Base16 syntax tokens, all sourced from a Material Theme Builder
  export (aubergine seed `#4B3049`). Tier 2 (`3-base/_base.scss`) emits these as
  `--color-{m3-name}` custom properties on `:root` (light) and
  `html[data-theme="dark"]` (dark), plus ten theme-agnostic component aliases.
  The old primitive layer and the `--color-ui-*` / `--color-state-*` /
  `text-inverse` vocabulary are retired in favour of the M3 names. Eyvan keeps a
  few documented extensions where M3 has no role: `ui-backdrop` (replaces
  `scrim`), `ui-shadow-color` (themed RGBA, replaces the hardcoded `#000`
  `shadow`), `focus-ring-color`, `heading`, and `ui-border-subtle`.
- `secondary` and `tertiary` are now genuine, independent M3 accent hues rather
  than tonal steps of the primary. The mistaken `$accent-secondary` hover tint
  is retired: hover is now a Material 3 **state layer** — `on-primary` at 8%
  over `primary` via `color-mix()` for filled buttons and tags — and text-link
  hover (links, navigation, post-card titles, back-to-top) is an underline. The
  demo climate chart's two temperature series now use the distinct `primary` and
  `secondary` hues.
- Brand accent stays aubergine but is rebalanced to the M3 tonal values: light
  `primary` is `#7E4D7C` and dark `primary` is `#EFB4E9`. `_data/theme.yml`
  remains the single source of truth (now `primary_light` / `primary_dark`),
  consumed by the mode files' `$primary` fallback, the JS fallbacks in
  `theme-toggle.js` / `demo-climate-charts.js`, and the browser `theme-color`
  meta in `head.html`. The retired teal/turquoise hexes (`#00796B`, `#3FE0D0`)
  are still guarded against reintroduction by `scripts/check-color-contract.rb`,
  which now also enforces the M3 role names, the `primary_*` keys, and the full
  M3 contrast-pair set (every `on-role` / `role` and `on-container` / `container`
  pair, plus the syntax slots).
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
- Card and hero "lift" shadows (`$card-shadow-rest` / `$card-shadow-hover`)
  now alias the new `$elevation-rest` / `$elevation-raised` tokens instead of
  standalone values, so rest, raised, and overlay surfaces share one
  consistent depth model.
- Split the setup guide into two posts. *Customizing Eyvan* is now *Setting Up
  Eyvan* and covers content setup only — config, data files, assets, and the
  first post, with no SCSS — while theming moved to the new *Theming Eyvan*
  post. The post was renamed `customizing-eyvan` → `setting-up-eyvan` (a
  permalink slug change) and the two path references in
  `tests/accessibility.spec.js` were updated to match.
- The new theming post corrects the old setup guide's stale Step 10 facts: the
  palette is aubergine (not the previously documented teal/green), the fonts are
  Gelasio / Barlow Condensed / JetBrains Mono (not Literata / Space Grotesk),
  and the tokens live in `_data/theme.yml` and the mode files (not the
  nonexistent `_colors.scss` / `_themes.scss`).
- Re-dated the three meta demo posts (*Front Matter Field Reference*, *Design
  Philosophy and Architecture of Eyvan*, and the setup guide) into a current
  cluster. The `/projects/:title/` permalink is date-independent, so the post
  URLs are unchanged.
- Trimmed the README, replacing the front-matter and reusable-includes
  deep-dives that duplicated the demo posts with short pointers to them; the
  attribution line now reads "including but not limited to" before the named
  AI tools.
- Standardized the per-post AI-attribution notes to say "AI tools" instead of
  naming individual models, since the demo content was produced with several.
  The license-required `Easy-Peasy.AI` cover-image backlink is left intact.

### Fixed

- The npm QA dependency lockfile now resolves `form-data` to a version that
  clears the reported high-severity audit advisory in the `wait-on` dependency
  chain.
- The climate demo's custom precipitation legend now uses the active
  `on-surface` text color in dark mode, uses the more distinguishable Material
  3 error/info colors for temperature and info/success/warning colors for
  precipitation epochs, and no longer observes the removed `data-persona`
  attribute.
- The built-output policy checker now reads generated HTML and the sitemap as
  UTF-8 explicitly, preventing locale-dependent crashes in shells that default
  Ruby's external encoding to US-ASCII.
- 41 component declarations referenced 10 CSS custom properties that
  `_base.scss` never defined — among them `--color-text`, `--color-text-muted`,
  `--color-border`, `--color-surface`, and `--color-primary`. Because an
  undefined `var()` invalidates its whole declaration, this silently broke the
  skip-link background, every `<hr>`, the icon-link and theme-toggle outlines,
  the sticky-header and footer top borders, the table-of-contents active/hover
  state, the footer text hierarchy, and the dark-mode heading color. Every
  consumer now resolves to a defined token across the color-token contract.
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

[Unreleased]: https://github.com/amirhs1/eyvan/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/amirhs1/eyvan/releases/tag/v1.0.0
