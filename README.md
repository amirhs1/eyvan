# Eyvan

**Eyvan** — marked by the **A1** logo (pronounced /ey-van/) — is a visually minimalist, feature-rich Jekyll template inspired by the *eyvan* or *[ayvan](https://www.iranicaonline.org/articles/ayvan-palace/)*, an open threshold space in Iranian architecture.

The template is designed for personal portfolios, academic profiles, research notes, project archives, and long-form technical writing. Its interface is restrained, but the template includes a complete publishing system: layouts, reusable Liquid includes, Sass architecture, JavaScript interactions, tag archives, social sharing, MathJax, media figures, and GitHub Actions deployment.

Live demo: [Eyvan](https://amirhs1.github.io/eyvan/)

## Features

- Visually minimal portfolio layout with a responsive 12-column grid
- Light/dark theme toggle with early theme initialization
- Homepage hero driven by `_data/hero.yml` and `_data/author.yml`
- Posts used as project/write-up entries, with a Projects archive and tag pages
- Three-column post layout with desktop TOC and mobile/tablet TOC panel
- TOC support for `##` and `###` headings when `toc: true`
- Optional cover images, post-card images, Open Graph, and Twitter/X preview images
- Optional cover image positioning with `image_position`
- MathJax support for LaTeX-style math when `math: true`
- Numbered tables and figure-like media, including images, videos, and audio, with optional cross-references when `crossrefs: true`
- Estimated reading time controlled globally through `read_time` and `words_per_minute` in `_config.yml`
- Syntax-highlighted code blocks via Rouge
- Tag archive pages powered by `jekyll/tagging`
- SEO sitemap via `jekyll-sitemap`
- ITCSS/BEM Sass architecture organized through layer directories and imported from `assets/css/main.scss`
- GitHub Actions deployment ready for plugins not supported by the native GitHub Pages builder

## Requirements

- Ruby and Bundler
- Jekyll-compatible Ruby environment
- Git, if cloning or publishing the repository

Install dependencies with Bundler before running the site:

```bash
bundle install
```

## Quick Start

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

- `_config.yml` controls site metadata, `url`, `baseurl`, permalink format, plugins, Sass output, global reading time, analytics, and defaults.
- `_data/author.yml` controls the displayed name, role, location, avatar, biography, and contact fields.
- `_data/hero.yml` controls the homepage hero copy, image, and call-to-action links.
- `_data/navigation.yml` controls header and mobile navigation links.
- `_data/social-links.yml` controls social/profile links.
- `_data/share.yml` controls post share actions.
- `_data/footer.yml` controls footer text.

## Writing Content

Posts live in `_posts/` and use Jekyll's standard filename pattern:

```text
YYYY-MM-DD-post-slug.md
```

Eyvan currently treats posts as both writing and project entries. The homepage shows recent posts, `/projects/` lists all posts, and tag archive pages group posts by front matter tags.

Common post front matter:

```yaml
---
title: "Clear Post Title"
subtitle: "Optional supporting sentence"
tags: [project, research, writing]
description: "One concise sentence for cards and previews."
toc: true
math: false
crossrefs: true
share: true
image: "assets/images/posts/token-bucket-diagram.webp"
image_alt: "Token bucket rate limiter system diagram"
image_position: "center center"
---
```

Important behavior:

- `toc: true` renders the post TOC wrappers and includes `##` / `###` headings.
- `math: true` loads MathJax for that page.
- `crossrefs: true` loads the JavaScript that resolves `{% include ref.html %}` links from raw ids into numbered labels such as `Figure 1` or `Table 2`.
- `read_time` is not currently a per-post front matter switch; reading time is controlled globally by `read_time` and `words_per_minute` in `_config.yml`.
- `share: false` hides post share controls.
- `image` is used by the post cover, post cards, and social preview metadata.

See the demo post *Front Matter Field Reference* for detailed examples.

## Reusable Includes

Eyvan includes Liquid helpers for common long-form content patterns:

- `figure.html` for single images and multi-image figure grids
- `video.html` for self-hosted or embedded videos
- `audio.html` for audio players
- `table-caption.html` for numbered table captions
- `ref.html` for cross-references to numbered figures and tables

Use `crossrefs: true` in front matter when a post uses `ref.html`. Individual figures, videos, audio blocks, and table captions are numbered by default; pass `numbered="false"` to an include only when that item should not be counted or referenced.

## Deployment

This theme uses `jekyll/tagging`, which is not supported by the native GitHub Pages build engine. Use GitHub Pages for hosting, but let GitHub Actions build the site.

Recommended setup:

1. In GitHub, go to **Settings -> Pages**.
2. Set **Source** to **GitHub Actions**.
3. Keep or adapt `.github/workflows/jekyll-pages.yml`.
4. Set `_config.yml` for your published URL.

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

For a custom domain, configure the domain in GitHub Pages settings and add a `CNAME` file if your deployment requires one.

## Limitations

- Posts are used as project entries; there is no separate projects collection yet.
- Reading time is global, not a per-post front matter override.
- Cross-reference links work as anchors without JavaScript, but numbered reference text requires `crossrefs: true`.
- Tag pages require the GitHub Actions build path because `jekyll/tagging` is not supported by the native GitHub Pages builder.
- Search is not included.

## Attribution

If your version of Eyvan is derived from another template, keep the original template name, author, repository URL, and license notice here. Remove this section only when no upstream attribution is required.

## License

This project is released under the MIT License. See [LICENSE](./LICENSE) for details.
