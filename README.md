# Eyvan

**Eyvan** — marked by the **A1** logo (pronounced /ey-vān/) — is a minimalist Jekyll portfolio theme inspired by the *eyvan* or *[ayvan](https://www.iranicaonline.org/articles/ayvan-palace/)* — an open, vaulted threshold space in Iranian architecture that mediates between inside and outside. The theme is designed around clarity, openness, and framing rather than decoration, making it suitable for personal portfolios, academic profiles, and research-oriented websites.

View the live demo: [Eyvan](https://amirhs1.github.io/eyvan/)

## Philosophy

In traditional architecture, an *eyvan* is neither fully interior nor exterior. It is a space of encounter and transition — open, structured, and intentional.

This theme follows the same logic:

- content is framed, not boxed
- layout emphasizes openness and readability
- structure remains visible but unobtrusive

## Features

- Clean, minimalist layout  
- Responsive design  
- Jekyll and GitHub Pages compatible  
- GitHub Actions deployment ready (recommended for custom plugins)
- Easy to customize typography and colors  
- Suitable for portfolios, blogs, and academic sites  

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
    http://localhost:4000
    ```

## Customization

- Most site settings can be modified in `_config.yml`.
- Layout and structure can be adjusted in `_layouts` and `_includes`.  
- Styles are located in the `assets` or `_sass` directory, depending on the setup.

## Deployment

This theme uses the `jekyll-tagging` plugin, which is **not supported** by the default GitHub Pages build engine.

For that reason, the recommended production setup is:

1. Build and deploy with **GitHub Actions**.
2. Publish to **GitHub Pages** from the workflow artifact.
3. Attach a custom domain in the repository’s Pages settings (and add a `CNAME` file if needed).

In short: use GitHub Pages for hosting, but let GitHub Actions do the build.

## Attribution

This theme is based on an existing open-source Jekyll template. The original author and repository are acknowledged and credited here in accordance with the original license.

## License

This project is released under the MIT License. See the [LICENSE](./LICENSE) file for details.
