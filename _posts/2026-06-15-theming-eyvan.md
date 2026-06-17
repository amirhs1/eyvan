---
title: "Theming Eyvan"
subtitle: "Changing the brand color, fonts, and spacing through the design tokens"
tags: [meta, jekyll, design, css, documentation]
toc: true
description: "How to re-skin Eyvan — a no-code brand-color workflow built on Material Theme Builder, plus where the fonts and spacing scale live."
---

> **Note:** This post was generated with AI tools as a theming guide shipped with the Eyvan template. It is the companion to *Setting Up Eyvan* — do your content setup there first, then return here when you want to change how the site looks.

*Setting Up Eyvan* covered everything about *who you are* — names, links, images, and posts. None of it touched SCSS. This guide covers the other half: how the site *looks*. The brand color, the fonts, and the spacing rhythm all live in design tokens under `_sass/0-settings/`, and you can change them without editing a single layout, include, or component.[^1]

This post assumes you are comfortable editing SCSS files and re-running the build. If you only want a different brand color, you can stop after the Material Theme Builder section — that is the most common change and the least code.

## How Eyvan's color system is organized

Eyvan's palette follows the [Material 3](https://m3.material.io/styles/color/system/overview) color model: a small set of named *roles* (primary, secondary, tertiary, surface, and so on) rather than a loose bag of hex values. Each role has an accessible "on" pair, and the same role names exist in both light and dark themes.

The system has two layers, and they exist for a specific reason:

- **The brand accent — one value, one source of truth.** The single color that links, buttons, tags, and focus rings use is defined in `_data/theme.yml` as `primary_light` and `primary_dark`. This is the layer you touch for a quick re-brand.
- **The full palette — everything else.** Secondary and tertiary accents, every surface tone, and the 16 syntax-highlighting tokens live directly in `_sass/0-settings/_light-mode.scss` and `_sass/0-settings/_dark-mode.scss`, one file per theme.

The brand accent is pulled out into `_data/theme.yml` because two different pipelines have to agree on it: `assets/css/main.scss` injects it into the Sass so the CSS `--color-primary` token gets its value, and `_includes/head.html` renders it into the `<meta name="theme-color">` tag so the browser chrome matches. Keeping it in one data file means those two can never drift.

```yaml
# _data/theme.yml — the brand accent, and nothing else
primary_light: "#7E4D7C"   # aubergine glaze — light-mode brand
primary_dark:  "#EFB4E9"   # lifted aubergine (orchid) — dark-mode brand
```

## Change your brand color with Material Theme Builder

The fastest way to get a coherent, accessible palette is to let Google's
[Material Theme Builder](https://material-foundation.github.io/material-theme-builder/)
generate one from a single seed color. It is the same tool Eyvan's shipped
palette came from (seed `#4B3049`, "Aubergine glaze").

1. **Open Material Theme Builder** and choose a **source/seed color** — your
   brand color, a color pulled from your logo, or anything you like. The builder
   generates a full light and dark scheme from that one seed.
2. **Read the `Primary` role** in the generated **light** scheme and again in the
   **dark** scheme. These are the only two values you need for a basic re-brand.
   (Material Theme Builder usually darkens the seed for light mode and lightens
   it for dark mode so each stays legible against its background — that is why
   light and dark get different hexes.)
3. **Paste them into `_data/theme.yml`:**

   ```yaml
   primary_light: "#XXXXXX"   # the Primary role from the light scheme
   primary_dark:  "#YYYYYY"   # the Primary role from the dark scheme
   ```

4. **Run the site and look.** `bundle exec jekyll serve`, then open the local
   URL. Links, buttons, tags, focus outlines, and the browser theme-color all
   pick up the new accent.

That is the whole no-code path. For most sites, changing these two values is the
entire re-brand.

> **Tip:** Pick a seed with enough depth that Material Theme Builder can derive a
> readable light-mode primary. Very pale seeds tend to produce a light-mode
> primary that fails contrast against white — the build's color-contract check
> (below) will flag it before it ships.

## Keep the brand color's copies in sync

There is one rule to know. For build-time safety, the brand hex is mirrored in a
few checked-in places, and a CI guard (`scripts/check-color-contract.rb`) fails
the build if they disagree. When you change the accent, update **all** of them:

| Location | What to change |
|:---------|:---------------|
| `_data/theme.yml` | `primary_light` / `primary_dark` — the source of truth |
| `_sass/0-settings/_light-mode.scss` | the `$primary: … !default;` fallback (match `primary_light`) |
| `_sass/0-settings/_dark-mode.scss` | the `$primary: … !default;` fallback (match `primary_dark`) |
| `assets/js/theme-toggle.js` | the two hardcoded color fallbacks (match each mode) |
{: .c-prose-table }

The `!default` fallbacks let the Sass compile on its own if the data injection
is ever bypassed; the JavaScript fallbacks cover the moment before the
`<meta theme-color>` value is read. They are belt-and-suspenders, but the guard
treats them as load-bearing, so keep them equal to `_data/theme.yml`.

You can run the same check locally before pushing — it is plain Ruby, with no
Jekyll build or Node toolchain required:

```bash
ruby scripts/check-color-contract.rb
```

It prints `Color contract policy passed` when the copies agree and every key
text, UI, and syntax color pair still meets WCAG 2.1 AA contrast.

## Going further: the full palette

If you want to move beyond the single accent — change the secondary or tertiary
colors, retune the surface tones, or restyle the code blocks — edit the two mode
files directly:

- `_sass/0-settings/_light-mode.scss`
- `_sass/0-settings/_dark-mode.scss`

Because Eyvan uses the Material 3 role **names** (`$primary`, `$secondary`,
`$tertiary`, `$surface`, `$on-surface`, and so on), a full re-theme is mostly a
copy-paste job: export the complete scheme from Material Theme Builder and map
each role into the matching variable in each file. The 16 `base0*` variables at
the bottom of each file are the Base16 syntax-highlighting palette for code
blocks.

> **Warning:** Every text/background pair in the shipped palette meets WCAG 2.1
> AA, and `scripts/check-color-contract.rb` enforces that on every PR. If you
> hand-pick colors instead of using a generated accessible scheme, run the check
> locally and fix any contrast failures before you push.

## Typography

Font families are set in `_sass/0-settings/_typography.scss`. Eyvan ships three:

| Variable | Font | Used for |
|:---------|:-----|:---------|
| `$font-family-display` | Barlow Condensed | Display and UI text — headings, nav, buttons |
| `$font-family-body` | Gelasio | Long-form reading — the prose body |
| `$font-family-mono` | JetBrains Mono | Code blocks and inline code |
{: .c-prose-table }

The fonts are **self-hosted**, not loaded from a CDN. The `@font-face`
declarations live in `_sass/2-generic/_fonts.scss`, and the `.woff2` files
themselves are in `assets/fonts/`. To swap a font:

1. Add the new `.woff2` files to `assets/fonts/`.
2. Add matching `@font-face` blocks in `_sass/2-generic/_fonts.scss`.
3. Point the relevant `$font-family-*` variable at the new family name.

Keep new fonts self-hosted under `assets/`. Eyvan deliberately avoids external
font CDNs, so adding a `<link>` to Google Fonts would break that principle (and
add a third-party request to every page).

The same file also exposes the type scale and line-height, so you can adjust
sizing and rhythm without renaming any fonts.

## Spacing, radius, and shadows

Two more token files round out the visual system:

- **Spacing** — `_sass/0-settings/_spacing.scss` defines the spacing scale,
  `$space-0` through `$space-9` (a 4px base unit growing to 96px). Components
  reference these tokens, so changing one value re-spaces the whole site
  consistently.
- **Radius and shadows** — `_sass/0-settings/_config.scss` holds the global
  border-radius and shadow tokens. Note the shipped radius is `0px`: Eyvan's
  squared corners are a deliberate design choice. Raise `$global-radius` (and the
  button/border variants) if you prefer rounded corners.

## Previewing and shipping changes

After any token change, run the site and watch the live reload:

```bash
bundle exec jekyll serve
```

SCSS edits recompile automatically, so color, type, and spacing changes appear
without a full restart. Before you push, run the color-contract check
(`ruby scripts/check-color-contract.rb`) so a sync or contrast problem fails
fast on your machine instead of in CI.

With that, you have changed how Eyvan looks without touching a single layout,
include, or component — exactly as the token architecture intends.

## Endnotes

[^1]: The design-token architecture and ITCSS layer layout are described in detail in the *Design Philosophy and Architecture of Eyvan* post.
