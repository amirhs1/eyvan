source "https://rubygems.org"

# ------------------------------------------------------------
# Core Jekyll site generator
# ------------------------------------------------------------
# This Gemfile controls the Ruby gems used to build and run
# the Jekyll site locally.
#
# After editing this file run:
#
#     bundle install
#
# Then run the site with:
#
#     bundle exec jekyll serve --trace --drafts
#
# Using `bundle exec` ensures the project uses the exact
# gem versions defined here instead of globally installed gems.
#
# Jekyll is pinned to the 4.4 series for stability while
# still allowing patch updates.
gem "jekyll", "~> 4.4"

# ------------------------------------------------------------
# Required for `jekyll serve` with modern Ruby versions
# ------------------------------------------------------------
# Ruby 3+ removed WEBrick from the standard library.
# Jekyll's development server still uses it.
gem "webrick", "~> 1.8"

# ------------------------------------------------------------
# SCSS / Sass pipeline
# ------------------------------------------------------------
# Jekyll uses these to compile SCSS from:
#
#    assets/css/main.scss
#
# into the final CSS served on the site.
gem "jekyll-sass-converter", "~> 3.0"
gem "sass-embedded"

# ------------------------------------------------------------
# Jekyll plugins
# ------------------------------------------------------------
# Plugins listed here must also appear in `_config.yml`.
#
# NOTE:
# - `jekyll-sitemap` is supported everywhere.
# - `jekyll-feed` (Atom feed at /feed.xml) is supported everywhere.
# - `jekyll-tagging` works locally and in GitHub Actions builds.
#   It does NOT work with the native GitHub Pages builder.
#
# If deploying with GitHub Actions (recommended for custom
# plugins), this configuration will work without modification.
group :jekyll_plugins do
  gem "jekyll-tagging"
  gem "jekyll-sitemap"
  gem "jekyll-feed"
end

# ------------------------------------------------------------
# Local and CI QA tools
# ------------------------------------------------------------
# Makes `bundle exec bundle-audit check` an intentional project command.
group :development, :test do
  gem "bundler-audit", "~> 0.9"
end

# ------------------------------------------------------------
# Platform compatibility gems
# ------------------------------------------------------------

# Windows does not include timezone data
gem "tzinfo-data", platforms: [:windows]

# Faster file watching for Windows
gem "wdm", platforms: [:windows]
