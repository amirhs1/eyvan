module Jekyll
  class HideTestPages < Generator
    safe true
    priority :lowest

    def generate(site)
      return if site.config["dev_only"]

      site.pages.reject! do |page|
        page.relative_path.start_with?("tests/")
      end
    end
  end
end
