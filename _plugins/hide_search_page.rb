module Jekyll
  # Builds the search page and its script only when `search` is set, so a site
  # with search off ships no /search/ URL, no sitemap entry, and no search.js.
  class HideSearchPage < Generator
    safe true
    priority :lowest

    SEARCH_PATHS = %w[search.html assets/js/search.js].freeze

    def generate(site)
      return if site.config["search"]

      site.pages.reject! { |page| search_path?(page) }
      site.static_files.reject! { |file| search_path?(file) }
    end

    private

    def search_path?(item)
      SEARCH_PATHS.include?(item.relative_path.delete_prefix("/"))
    end
  end
end
