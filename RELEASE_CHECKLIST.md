# Release Checklist

Use this checklist before merging `develop` into `main`, creating a tag, or
publishing a template release.

## Identity and Configuration

- [ ] Confirm `_config.yml` has the intended `url`, `baseurl`, title, author,
      email, and default social image.
- [ ] Confirm `_data/author.yml`, `_data/hero.yml`, `_data/footer.yml`, and
      social links contain the intended public identity.
- [ ] Confirm the logo, favicon, avatar, resume, and Open Graph fallback assets
      are final and baseurl-safe.

## Automated Checks

- [ ] Run `bundle exec jekyll build`.
- [ ] Run `npm run test:release`.
- [ ] Run `ruby scripts/check-built-output.rb`.
- [ ] Start the local site and run `npm run test:site`.
- [ ] Run `npm run test:a11y`.
- [ ] Confirm the required GitHub Actions checks pass on the release PR.

## Manual Review

- [ ] Complete [`ACCESSIBILITY_TESTING.md`](ACCESSIBILITY_TESTING.md) for
      keyboard, VoiceOver, and NVDA coverage.
- [ ] Check the home page, projects archive, a long post with a TOC, a post
      without optional features, and the 404 page at desktop and mobile widths.
- [ ] Verify canonical, Open Graph, Twitter, sitemap, and feed URLs use the
      intended production domain and base URL.
- [ ] Verify internal navigation, images, downloads, sharing, print, theme
      switching, mobile overlays, and back-to-top behavior.

## Release Notes

- [ ] Update `CHANGELOG.md` with user-visible changes and migration notes.
- [ ] Confirm documentation reflects new or changed front matter, config keys,
      assets, scripts, and contributor workflows.
- [ ] Confirm the version and tag name match the release notes.
- [ ] Let a human maintainer merge and publish the release.
