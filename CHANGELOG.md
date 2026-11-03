# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- A `read_time_override` front matter field that replaces the estimated minutes
  in a post's "N min read" text with a whole number you set (#1). It changes
  only the number: `read_time: false` still hides reading time. If your fork
  has its own copy of `_includes/entry-meta.html`, copy the new
  `override_minutes` lines into it.

## [2.0.0] - 2026-11-03

### Breaking changes

Each item below can break a site built on Eyvan. Follow its migration step
when you merge this release into your fork.

- The `.animate` motion class is now `.u-animate` (#26). If your content,
  overrides, or CSS use `animate`, rename it to `u-animate`.
- **Breaking for forks that customize the post layout:** the post page's
  content grid moved from `_sass/5-components/_post.scss` to a new
  `_sass/6-layouts/_post.scss`, and its classes were renamed from
  `c-post-layout*` to `l-post*` (`l-post`, `l-post__col`,
  `l-post__col--left`, `l-post__col--main`, `l-post__col--right`,
  `l-post__prose`, `l-post__aside`) (#125). If your site overrides
  `_layouts/post.html` or `_includes/post-toc-desktop.html`, or adds CSS
  for `.c-post-layout*`, rename those classes. Rendering is unchanged.
- The Sass variables `$anim-speed` and `$anim-easing` are removed, so Sass
  that uses them no longer compiles (#129). Use `$transition-base` from
  `_sass/0-settings/_config.scss` instead.
- The Sass variables `$static-stack-xxs`, `$static-stack-xs`, and
  `$static-stack-sm` are removed (#129). Use the equal `$space-stack-xxs`,
  `$space-stack-xs`, and `$space-stack-sm` from
  `_sass/0-settings/_spacing.scss` instead.
- The `.c-theme-toggle--mobile`, `.c-nav--mobile`, and
  `.c-social-links--mobile` modifiers now carry the mobile menu's look
  wherever they are used, and the Contents toolbar's compact share styles
  now need the new `c-post-share--collapsed` class (#127). If you style
  these modifiers outside the menu, check them; if your fork has its own
  copy of `_includes/post-share.html`, add `c-post-share--collapsed` to its
  root when `collapse` is set, as the template's copy now does.
- The About portrait caption and the contact page's "Also reachable on"
  label now take their type from component classes, and
  `.l-about__portrait-caption` is removed (#123). If you have customized
  `about.html` or `contact.html`, give the portrait `figcaption` the class
  `c-prose-caption` and the label `c-label` alongside
  `l-contact__social-label`.
- CI now runs `bundle exec bundle-audit check --update` as a blocking step
  (#137). A known advisory against your `Gemfile.lock` fails the build until
  you update the gem or record a waiver in `.bundler-audit.yml`.
- `@axe-core/playwright` 4.14.0 turns on the `label-content-name-mismatch`
  rule (#69). A link whose `aria-label` does not contain its visible text
  now fails `npm run test:a11y`; remove the label or make it include the
  visible text.
- New CI checks can fail on a fork's own changes:
  - The component gallery scan checks its page list against `/tests/`
    (#97). If you delete gallery fixture pages, update `galleryPages` in
    `tests/component-gallery.spec.js`.
  - `npm run test:site` counts characters per line in running text (#116).
    With a different body font, the failure message names the
    `$text-measure-wide` value that averages about 66 characters.
  - `scripts/check-color-contract.rb` fails when a post or a root Markdown
    file names a `--color-*` property that the base layer does not emit
    (#28). Rename or remove the property in that file.
  - `scripts/check-color-contract.rb` checks the post-navigation text at the
    far edge of its gradient (#131). A palette change that lowers that
    contrast below WCAG 2.1 AA now fails CI.

### Added

- A `mq-down` Sass mixin that ends just below a breakpoint, beside `mq-up`
  (#114).
- A `.c-label` component for small uppercase labels (#123).
- Sass tokens for control sizes, icon sizes, and the hover and press offsets
  (`$control-size-sm/md/lg`, `$icon-size`, `$icon-size-lg`,
  `$control-lift-hover`, `$control-press-offset`, `$control-press-scale`)
  (#133).
- An axe scan of every component gallery page in CI, in light and dark, at
  1280 × 720 and 390 × 844, run with `npm run test:gallery` (#97, #111).
- A "Component Gallery" section in the README, and documentation of
  `.is-shrunk` as an opt-in hook for your own shrink-on-scroll (#27).
- A "Using the palette in your own components" section in the *Theming
  Eyvan* post (#28).

### Fixed

- The "Add a new component" example in the architecture post now uses tokens
  that exist, so copying it gives a styled component (#28).
- Cross-reference numbers count only captioned figures, video, and audio,
  so they match the visible labels; a reference to an uncaptioned figure now
  shows its id (#103).
- The mobile menu and the mobile Contents panel close, and release the page,
  when the window widens past the layout breakpoint (#104).
- Tag links use jekyll-tagging's `tag_url` filter, so tags such as `C++` or
  `Café` no longer link to a missing page (#105).
- Share links encode titles that contain `#`, `&`, or `+` (#106).
- The template identity check in the deploy workflow no longer fails on a
  date in `_config.yml` or `_data/` (#107).
- Prose tables that overflow their column can be reached and scrolled with
  the keyboard (#110).
- Task-list items no longer turn inline code into small scroll boxes on
  narrow screens (#112).
- Native controls, such as task-list checkboxes, follow the chosen theme
  instead of the operating system's (#113).
- At exactly 480, 768, and 1024px, pages no longer show the mobile and
  desktop layouts at once (#114).
- The Contents rail stays readable just above the layout breakpoint (#116).
- On the About page below 1024px, the portrait caption no longer runs past
  the photo (#123).
- CI no longer passes `ruby/setup-ruby` the `ruby-version-file` input, which
  it does not accept, so the Setup Ruby step stops logging an "Unexpected
  input" warning; Ruby is still read from `.ruby-version` (#142).

### Changed

- The post and About reading measure is now about 66 characters per line
  (`$text-measure-wide` from `75ch` to `50ch`) (#116).
- The brand link is named by its visible name and role; the
  `aria-label="Go to homepage"` is removed (#94).
- Transitions use one easing curve, `cubic-bezier(0.4, 0, 0.2, 1)`, with
  their durations unchanged, and `.u-animate` uses it too (#129, #133).
- In the dark theme, the Contents and share rails are one step lighter than
  the page (`--color-surface-container-low`) (#131).
- A bare `hr` outside post prose has 2rem of space below it, as above it;
  posts are unchanged (#121).
- Links use the shared focus-ring mixin, so re-theming
  `--color-focus-ring-color` now reaches links too; no visual change (#25).
- CI runs on `ubuntu-24.04` (#49), waits for the server through
  `npm run test:wait` (#64), and skips its Playwright steps on pull requests
  into `develop` that change only documentation (#136).
- Build dependencies: `sass-embedded` 1.101.0 → 1.106.1 (#38, #67) and
  `jekyll-feed` 0.17.0 → 0.18.0 (#41).
- CI actions: `ruby/setup-ruby` 1.313.0 → 1.335.0 (#39, #68, #135),
  `actions/checkout` 6.0.3 → 7.0.1 (#40), `actions/setup-node` 6.4.0 →
  7.1.0 (#43, #57), `actions/deploy-pages` 5.0.0 → 5.0.1 (#45), and
  `actions/upload-artifact` 7.0.1 → 7.0.2 (#56).
- Test tools: `@playwright/test` 1.60.0 → 1.64.1 (#42, #58, #66),
  `@axe-core/playwright` 4.11.3 → 4.14.0 (#46, #69), `wait-on` 9.0.10 →
  9.5.1 (#44), `axios` 1.17.0 → 1.20.0 (#47), and `joi` 18.2.1 → 18.2.9
  (#48).
- Contributor and agent tooling: agent rules and skills, `AI-POLICY.md`, a
  commit-message hook, pull request and issue templates, and Dependabot
  pull requests aimed at `develop` (#30, #32, #34, #36, #55, #59, #61, #81,
  #87, #88, #89, #92, #99, #100).
- `THIRD_PARTY_NOTICES.md` records the source and terms of four shipped
  images: the portrait and hero placeholder (Pexels License), the default
  Open Graph image (MIT), and the quantum entanglement post cover
  (CC BY-SA 4.0) (#141).

### Security

- `addressable` 2.9.0 → 2.9.2, which clears seven advisories reported
  against 2.9.0 (#137).
- `follow-redirects` 1.16.1 → 1.16.2, a development dependency, which clears
  the high-severity advisory GHSA-mrwp-f3q8-3g9p reported against 1.16.0
  and 1.16.1 (#139).

## [1.1.0] - 2026-06-22

### Added

- A "Multi-image figure grids" walkthrough in the *Front Matter Field
  Reference* demo post, documenting the `images="…"` parameter, its
  pipe-delimited `path | alt | WxH | srcset | sizes` row format, and the
  `cols` option — the one `figure.html` surface that previously had no
  step-by-step guide outside the include's own comment header.
- A step-by-step custom-domain / `CNAME` section in the README, covering the
  `CNAME` file, GitHub Pages settings, the apex/subdomain DNS records, and the
  `baseurl: ""` adjustment a root-served custom domain requires.
- Development-only test layout, navigation data, and component harnesses that
  exercise the visual system without publishing test pages or helper CSS in
  production builds.
- Documentation for the `og_image` front matter override and its precedence
  over visible post covers and the site-wide social fallback.

### Removed

- The `pa11y-ci` development dependency and its `a11y` / `a11y:sitemap` npm
  scripts. The accessibility gate is Playwright + axe (`npm run test:a11y`),
  which `pa11y-ci` duplicated without being wired into any CI workflow;
  removing it also clears the high-severity `undici` advisory it pulled in
  transitively through `cheerio`, and reconciles the tooling with the
  project's documented "Playwright + axe" accessibility policy. The README
  contributor-QA note and the `dependabot.yml` npm comment were updated to
  match.
- The unused Barlow Condensed 900 (Black) weight: its `@font-face` block, the
  `$font-weight-black` token, the shipped `Barlow-Condensed-normal-900-latin.woff2`
  subset, and its entry in the bundled font-license map. No component
  referenced the weight (headings use Bold/700, the hero uses Semi-Bold/600),
  so dropping it trims the shipped font payload with no visual change.
- Obsolete Sass selectors and rules, including the unused page title/subtitle
  selector API and stale state, animation, and print styles superseded by the
  canonical components and utilities.

### Fixed

- The `404.html` error-code line no longer relies on a presentational `<br>`
  for spacing, and finally renders in the intended muted color. It used a
  `u-text-muted` class that was never defined anywhere in the Sass, so the
  text was not actually muted; a new `_sass/5-components/_404.scss` gives the
  404 component its missing home, spacing the `.c-404__code` line and coloring
  it with the existing `--color-on-surface-variant` token.
- Generic pages now fill the same container width as the homepage, projects,
  about, and contact pages; long-form posts retain their intentionally narrower
  prose measure.
- The entry-meta component now emits the valid `flex-wrap: nowrap` value instead
  of the invalid `unwrap` declaration.
- The climate demo enables cross-reference resolution, so its numbered table
  reference renders a reader-facing label instead of the raw element id.
- Development harness fixtures now use valid assets, unique landmarks, and
  accessible component states exposed by the expanded test crawl.

### Changed

- `post-card.html` now accepts an optional `eager` parameter. The homepage
  project grid sets it on the first card so the likely above-the-fold LCP
  cover loads eagerly with `fetchpriority="high"`, while every other card
  keeps `loading="lazy"`. Behavior is unchanged for all existing callers,
  which omit the parameter and stay lazy.
- Sass architecture now uses consolidated semantic tokens, corrected BEM names,
  normalized component filenames and headers, and clearer boundaries between
  settings data, layout objects, components, and development-only test styles.
- The setup, theming, architecture, README, and contributor guidance now match
  the shipped navigation split, optional-image behavior, image loading policy,
  deployment choices, Playwright/axe QA workflow, and repository rulesets.

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

[Unreleased]: https://github.com/amirhs1/eyvan/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/amirhs1/eyvan/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/amirhs1/eyvan/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/amirhs1/eyvan/releases/tag/v1.0.0
