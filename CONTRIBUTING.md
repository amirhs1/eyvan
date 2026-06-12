# Contributing to Eyvan

Thanks for your interest in Eyvan! Most people use this project by **forking it
as a starting point** for their own Jekyll site — that's the primary intended
path, and you don't need permission or a pull request to do that. This guide
covers the smaller set of changes that make sense to contribute back upstream:
bug fixes, accessibility improvements, documentation corrections, and
template-level enhancements that benefit everyone who builds on Eyvan.

Please don't open PRs for personal customization (your name, bio, posts,
brand colors, and so on) — keep those changes in your fork.

## Before you start

- Search [existing issues](https://github.com/amirhs1/eyvan/issues) and open
  pull requests first, to avoid duplicating work.
- For anything beyond a small fix, open an issue to discuss the approach
  before writing code. This matters most for changes to layouts, includes, or
  the SCSS architecture, where the "right" approach often depends on context
  that isn't obvious from the code alone.
- Please don't report security issues through public issues or pull requests —
  see [`SECURITY.md`](SECURITY.md) for how to report them privately.

## Project conventions

Eyvan follows a deliberate set of architectural conventions. Please keep
contributions consistent with them:

- **Build & deploy**: GitHub Actions, not the native GitHub Pages builder
  (which doesn't support the `jekyll/tagging` plugin). `_config.yml` ships with
  `baseurl: "/eyvan"` — keep links `baseurl`-safe with `relative_url` /
  `absolute_url`, and never hardcode root-relative paths.
- **Styling**: `_sass/` follows ITCSS (seven layers, `0-settings` through
  `7-trumps`) with BEM naming (`o-`, `c-`, `l-`, `u-`, `is-` prefixes). No CSS
  frameworks, utility-class systems, inline styles, or one-off class names.
- **Templating**: standard Jekyll Liquid via `_includes` and `_layouts`. Reuse
  existing includes (`figure.html`, `video.html`, `audio.html`,
  `table-caption.html`, `ref.html`) rather than duplicating markup by hand.
- **Accessibility**: a core requirement, not an afterthought — semantic HTML,
  keyboard access, meaningful labels, correct ARIA, and visible focus states
  must be preserved in every change.

## Branching & pull requests

- Work on a short-lived branch with a conventional prefix: `feature/*`,
  `fix/*`, `hotfix/*`, `refactor/*`, `chore/*`, or `docs/*`.
- Open your pull request against `develop` (not `main`).
- Keep each PR scoped to a single concern — avoid bundling unrelated changes.
- Write a clear description: what changed, why it changed, and which checks
  you ran.

## Running checks locally

```bash
# Confirm the site builds (baseurl: "/eyvan" already makes this the subpath build)
bundle exec jekyll build

# Accessibility suite (Playwright + axe-core) — needs a running server
bundle exec jekyll serve --host 127.0.0.1 --port 4000 --detach
npx wait-on http://127.0.0.1:4000/eyvan/
npm run test:a11y
```

[`develop.yml`](.github/workflows/develop.yml) runs this exact sequence in CI
on every pull request into `develop` and `main`, and a failing run blocks the
merge. Run the suite locally whenever your change affects rendered output
(layouts, includes, components, JavaScript, ARIA, or contrast-affecting CSS).
For content-only or configuration-only changes, a local `bundle exec jekyll
build` is enough — let CI handle the accessibility pass.

## Release and accessibility checklists

Before tagging or publishing a release, complete
[`RELEASE_CHECKLIST.md`](RELEASE_CHECKLIST.md). Changes that affect rendered
content or interaction should also follow the keyboard, VoiceOver, and NVDA
steps in [`ACCESSIBILITY_TESTING.md`](ACCESSIBILITY_TESTING.md).

## What happens next

Maintainers review pull requests for architectural fit, accessibility, and
consistency with the conventions above. Humans own every merge into `develop`
and `main`, and branch protection requires the accessibility check to pass
first. We may suggest changes or a different approach if something doesn't fit
the template's design goals — that's a normal part of keeping a shared template
coherent for everyone who builds on it, not a judgment on the contribution.
