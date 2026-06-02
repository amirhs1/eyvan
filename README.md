# Eyvan

**Eyvan** — marked by the **A1** logo (pronounced /ey-vān/) — is a minimalist Jekyll portfolio theme inspired by the *eyvan* or *[ayvan](https://www.iranicaonline.org/articles/ayvan-palace/)* — an open, vaulted threshold space in Iranian architecture that mediates between inside and outside. The theme is designed around clarity, openness, and framing rather than decoration, making it suitable for personal portfolios, academic profiles, and research-oriented websites.

View the live demo: [Eyvan](https://amirhs1.github.io/eyvan/)

## Philosophy

In traditional Iranian architecture, an *eyvan* is neither fully interior nor exterior. It is a space of encounter and transition — open, structured, and intentional.

This theme follows the same logic:

- content is framed, not boxed
- layout emphasizes openness and readability
- structure remains visible but unobtrusive

## Features

- Clean, minimalist layout with a responsive 12-column grid
- Light/dark theme toggle
- Three-column post layout with desktop and mobile table of contents
- Optional cover images with Open Graph and Twitter card social previews
- MathJax support for LaTeX-style inline and display math (opt-in per post)
- Syntax-highlighted code blocks via Rouge
- Tag archive pages powered by `jekyll/tagging`
- Post sharing controls, estimated reading time, and related posts
- ITCSS/BEM CSS architecture organized across eight Sass layers
- Data-driven navigation and reusable Liquid includes for figures, videos, audio, tables, and cross-references
- SEO sitemap via `jekyll-sitemap`
- GitHub Actions deployment ready (required for custom plugins)
- Suitable for portfolios, blogs, documentation, and academic sites

## Getting Started

1. Clone or download the repository:

    ```bash
    git clone https://github.com/your-username/eyvan.git
    ```

2. Install dependencies:

    ```bash
    bundle install
    ```

3. Run the site locally:

    ```bash
    bundle exec jekyll serve
    ```

4. Open your browser at:

    ```text
    http://localhost:4000/eyvan/
    ```

## Customization

- Site identity, URL, logo, and global feature flags are set in `_config.yml`.
- Post defaults (layout, sharing, read time) are controlled via the `defaults` key in `_config.yml`.
- Navigation links are managed through the navigation data file rather than hard-coded in the header.
- Layouts live in `_layouts/` (`default`, `homepage`, `page`, `post`, `tag-page`); includes live in `_includes/`.
- Styles follow an **ITCSS** layer structure in `_sass/`: settings → tools → generic → base → objects → components → layouts → trumps. Class names use a **BEM** convention with `c-` (component), `o-` (object), `l-` (layout), `u-` (utility), and `is-` (state) prefixes.
- Per-post behavior is controlled through front matter fields: `toc`, `math`, `share`, `image`, `image_alt`, `subtitle`, `tags`, `read_time`, and more. See the demo post *Front Matter Field Reference* for a complete guide.

## Deployment

This theme uses the `jekyll/tagging` plugin, which is **not supported** by the default GitHub Pages build engine.

For that reason, the recommended production setup is:

1. Build and deploy with **GitHub Actions**.
2. Publish to **GitHub Pages** from the workflow artifact.
3. Attach a custom domain in the repository’s Pages settings (and add a `CNAME` file if needed).

In short: use GitHub Pages for hosting, but let GitHub Actions do the build.

## Attribution

This theme is based on an existing open-source Jekyll template. The original author and repository are acknowledged and credited here in accordance with the original license.

## License

This project is released under the MIT License. See the [LICENSE](./LICENSE) file for details.
