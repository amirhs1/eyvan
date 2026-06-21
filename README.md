# Eyvan

[![Run Automated Tests](https://github.com/amirhs1/eyvan/actions/workflows/develop.yml/badge.svg)](https://github.com/amirhs1/eyvan/actions/workflows/develop.yml)
[![Deploy Jekyll site to Pages](https://github.com/amirhs1/eyvan/actions/workflows/jekyll-pages.yml/badge.svg)](https://github.com/amirhs1/eyvan/actions/workflows/jekyll-pages.yml)
[![Accessibility: axe](https://img.shields.io/badge/accessibility-axe-brightgreen)](https://github.com/amirhs1/eyvan/actions/workflows/develop.yml)
[![Jekyll](https://img.shields.io/badge/jekyll-~%3E%204.4-blue)](https://jekyllrb.com/)
[![License: MIT](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

**Eyvan** — marked by the **A1** logo (pronounced /ey-van/) — is a visually minimalist, feature-rich Jekyll template inspired by the *eyvan* or *[ayvan](https://www.iranicaonline.org/articles/ayvan-palace/)*, an open threshold space in Iranian architecture.

The template is designed for personal portfolios, academic profiles, research notes, project archives, and long-form technical writing. Its interface is restrained, but the template includes a complete publishing system: layouts, reusable Liquid includes, Sass architecture, JavaScript interactions, tag archives, social sharing, MathJax, media figures, and GitHub Actions deployment.

Live demo: [Eyvan](https://amirhs1.github.io/eyvan/)

## Using as a Template

1. Click **"Use this template"** and name your new repository.
   - For a personal site: name it `[your-username].github.io`
   - For a project site: name it anything (e.g. `my-portfolio`)

2. Go to **Settings → Pages → Source** and select **GitHub Actions**.
   Eyvan deploys via its own workflow — the native Pages builder will not work.

3. Edit `_config.yml` and replace the demo identity and URL values. Choose the
   `url` and `baseurl` pair for your hosting type in [Deployment](#deployment).

4. Edit `_data/author.yml` and `_data/footer.yml` with your name and details.

5. Push — the deploy workflow runs automatically and your site goes live.

> If any placeholder values remain after your first push, the deploy log will show
> warnings in the **Check Template Identity** step to guide you.

## Features

- Responsive, content-first layouts for phones, tablets, and desktop screens
- Light/dark theme toggle with early theme initialization
- Homepage hero driven by `_data/hero.yml` and `_data/author.yml`
- A deliberately unified content model: posts serve as both writing and project
  entries, with a Projects archive and tag pages instead of a separate collection
- Responsive table of contents for opted-in posts: a sticky sidebar on desktop
  and an accessible toolbar and full-screen overlay panel on mobile and tablet
  screens, demonstrated in *Eyvan Design and Architecture*
- Optional cover images, post-card images, Open Graph, and Twitter/X preview images
- Cover crop alignment through the optional `image_position` front matter field
- Optional bandwidth-efficient image variants for covers, page images, and prose
  figures through `srcset` and `sizes`
- MathJax support for LaTeX-style math when `math: true`
- Reusable Liquid includes for figures, image grids, video, audio, table captions,
  and references
- Numbered tables and figure-like media, with optional cross-references when
  `crossrefs: true`
- Accessibility safeguards and automated Playwright/axe testing for rendered pages
- Detailed, task-focused documentation supplied as removable demo posts
- Estimated reading time controlled globally through `read_time` and `words_per_minute` in `_config.yml`
- Syntax-highlighted code blocks via Rouge
- Tag archive pages powered by `jekyll/tagging`
- SEO sitemap via `jekyll-sitemap`
- Atom/RSS feed at `/feed.xml` via `jekyll-feed`, auto-discovered from every page
- ITCSS/BEM Sass architecture organized through layer directories and imported from `assets/css/main.scss`
- GitHub Actions deployment ready for plugins not supported by the native GitHub Pages builder

## Requirements

These tools are needed to run and customize Eyvan locally, verify changes, and
publish the repository; GitHub Actions installs its own build dependencies for
hosted deployments.

- Ruby and Bundler
- Jekyll-compatible Ruby environment
- Git, if cloning or publishing the repository

Contributor QA also uses Node.js and npm for Playwright and axe-core
checks. CI currently runs those tools on Node 20; use `npm ci` before running
the local QA scripts.

Install dependencies with Bundler before running the site:

```bash
bundle install
```

## Quick Start

Use these steps to run the shipped template locally for development and
customization. For publishing with GitHub Pages, see [Deployment](#deployment).

1. Clone the repository or create a new repository from this template.

   ```bash
   git clone https://github.com/amirhs1/eyvan.git
   cd eyvan
   ```

2. Install dependencies.

   ```bash
   bundle install
   ```

3. Run the site locally.

   ```bash
   bundle exec jekyll serve
   ```

4. Open the local site.

   ```text
   http://localhost:4000/eyvan/
   ```

The current `_config.yml` uses `baseurl: "/eyvan"`. If you change `baseurl` to an empty string, the local URL becomes `http://localhost:4000/`.

## Configuration

Most customization is intentionally kept in one site configuration file and a
small set of YAML data files:

- `_config.yml` controls site metadata, `url`, `baseurl`, permalink format, plugins, Sass output, global reading time, analytics, and defaults.
- `_data/author.yml` controls the displayed name, role, location, avatar, biography, and contact fields.
- `_data/hero.yml` controls the homepage hero copy, image, and call-to-action links.
- `_data/navigation.yml` controls header and mobile navigation links.
- `_data/social-links.yml` controls social/profile links.
- `_data/share.yml` controls post share actions.
- `_data/footer.yml` controls footer text.

For a complete, step-by-step walkthrough, see the demo posts included in `_posts/`: *Setting Up Eyvan* covers personalizing the config, data files, assets, and your first post; *Theming Eyvan* covers changing the brand color, fonts, and spacing.

## Writing Content

Posts live in `_posts/` and use Jekyll's standard filename pattern:

```text
YYYY-MM-DD-post-slug.md
```

Eyvan currently treats posts as both writing and project entries. The homepage shows recent posts, `/projects/` lists all posts, and tag archive pages group posts by front matter tags.

Front matter controls per-post behavior: `toc: true` for the table of contents, `math: true` to load MathJax, `crossrefs: true` for numbered figure/table references, `share: false` to hide share controls, and `image` for the cover and social preview. Reading time is global (`read_time` / `words_per_minute` in `_config.yml`), not per-post. The demo post *Front Matter Field Reference* documents every supported field with examples.

All rendered images scale with their containers by default. The optional
`image_srcset`/`image_sizes` fields and figure include options solve a different
problem: when you provide pre-generated image widths, the browser can download
the most appropriate file instead of always fetching the largest one. The
optional `image_position` field controls which part of a cover remains visible
when the fixed cover frame crops it, using values such as `center top` or
`50% 35%`. See *Front Matter Field Reference* for complete examples.

MathJax is an intentional opt-in CDN integration. Eyvan pins an exact release
in the loader URL, protects the entry bundle with Subresource Integrity, and
checks the generated loader in CI. The version is updated only after its
rendered math and accessibility behavior are reviewed; the template never uses
a rolling major-version or `latest` URL.

The climate analysis post also demonstrates interactive Chart.js charts. That
library and `assets/js/demo-climate-charts.js` belong only to the removable
demo post, not to Eyvan's core runtime. Its CDN release is exact,
integrity-protected, and checked independently from the MathJax feature. You
can delete the climate post and its demo script when replacing the sample
content.

## Reusable Includes

Eyvan includes Liquid helpers for common long-form content patterns:

- `figure.html` for single images and multi-image figure grids
- `video.html` for self-hosted or embedded videos
- `audio.html` for audio players
- `table-caption.html` for numbered table captions
- `ref.html` for cross-references to numbered figures and tables

Use `crossrefs: true` in front matter when a post uses `ref.html`. Individual figures, videos, audio blocks, and table captions are numbered by default; pass `numbered="false"` to exclude an item. Covers and figures accept optional responsive `srcset`/`sizes` variants, which Eyvan rewrites through `relative_url` to stay baseurl-safe. See *Front Matter Field Reference* for the full include options.

## Deployment

This theme uses `jekyll/tagging`, which is not supported by the native GitHub Pages build engine. Use GitHub Pages for hosting, but let GitHub Actions build the site.

Creating a repository from the template and deploying it are related but
different steps: [Using as a Template](#using-as-a-template) creates and
personalizes your copy, while this section configures how that copy is built
and hosted.

Recommended setup:

1. In GitHub, go to **Settings -> Pages**.
2. Set **Source** to **GitHub Actions**.
3. Keep or adapt `.github/workflows/jekyll-pages.yml`.
4. Set `url` and `baseurl` in `_config.yml` to your own site (see examples below).

`url` is the origin of the published site, including the scheme and hostname.
`baseurl` is only the path below that origin: leave it empty for a user,
organization, or root custom-domain site, and set it to the repository path for
a project site.

> **Important:** Eyvan ships with `url` and `baseurl` pointing at the demo site
> (`https://amirhs1.github.io/eyvan`). Until you change them, your canonical tags,
> Open Graph / Twitter previews, sitemap, and RSS feed will reference the demo
> instead of your site. Update both **before your first deploy**.

For a project site:

```yaml
url: "https://your-username.github.io"
baseurl: "/your-repository-name"
```

For a user or organization site:

```yaml
url: "https://your-username.github.io"
baseurl: ""
```

For a custom domain:

1. Add a `CNAME` file at the repository root containing only your domain, e.g. `www.example.com`.
2. In **Settings → Pages**, set the custom domain to the same value and enable "Enforce HTTPS" once DNS has propagated.
3. At your DNS provider, point the domain at GitHub Pages: a `CNAME` record to `your-username.github.io` for a subdomain (e.g. `www`), or `A`/`ALIAS` records to GitHub's apex IPs for a bare domain.
4. Since a custom domain serves from the root, set `baseurl: ""` and `url:` to your custom domain (with scheme, no trailing slash) in `_config.yml` — the same as the user/org site case above, just with your own domain instead of `*.github.io`.

No changes to the GitHub Actions workflows are needed; GitHub Pages handles the CNAME-to-domain mapping itself.

## Limitations

- Reading time is global, not a per-post front matter override.
- Cross-reference links work as anchors without JavaScript, but numbered reference text requires `crossrefs: true`.
- Tag pages require the GitHub Actions build path because `jekyll/tagging` is not supported by the native GitHub Pages builder.
- Search is not included.

## Attribution

Eyvan draws creative and technical inspiration from the following open-source
projects:

- [minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)
- [analytics-link.github.io](https://github.com/analytics-link/analytics-link.github.io)
- [vonge-jekyll-bookshop-template](https://github.com/CloudCannon/vonge-jekyll-bookshop-template)

Code generation, modular templating, refactoring, debugging scripts, and demo
posts were developed in collaboration with Large Language Models, including but
not limited to OpenAI's ChatGPT/Codex, Google Gemini, and Anthropic Claude.

Eyvan includes third-party fonts, icons, demo media, and optional demo
integrations. For full third-party license notices, copyright information, and
asset sources, see [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md). Font
license texts and the file-by-file font asset map are also included in
[`assets/fonts/licenses/`](assets/fonts/licenses/README.md).

## License

This project is released under the MIT License. See [LICENSE](./LICENSE) for details.
