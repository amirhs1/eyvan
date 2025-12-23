source "https://rubygems.org"

# Core site generator
# This file `Gemfile` is used to set which Jekyll version is used to run.
# To use a different Jekyll version, change it below, save the
# file and run `bundle install`. Run Jekyll with `bundle exec`, like so:
#
#     bundle exec jekyll serve
#
# This will help ensure the proper Jekyll version is running.

# Below, Jekyll is pinned to the 4.4.x for stability but allowing patch updates
gem "logger"
gem "jekyll-sass-converter", "~> 3.0"
gem "sass-embedded"
gem "jekyll", "~> 4.4"

# To use GitHub Pages, remove the `gem "jekyll" ...` above and uncomment the line 
# below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins

# Jekyll plugins: Add any plugins here!
group :jekyll_plugins do
  gem "jekyll-paginate"
  gem "jekyll-sitemap"
end

# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
gem "tzinfo-data", platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Performance-booster for watching directories on Windows
gem "wdm" if Gem.win_platform?