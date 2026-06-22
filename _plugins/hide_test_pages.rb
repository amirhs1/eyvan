module Jekyll
  class HideTestPages < Generator
    safe true
    priority :lowest

    TEST_PATH_PREFIX = "tests/".freeze

    def generate(site)
      return if site.config["dev_only"]

      site.pages.reject! { |page| test_path?(page) }
      site.static_files.reject! { |file| test_path?(file) }
    end

    private

    def test_path?(item)
      item.relative_path.delete_prefix("/").start_with?(TEST_PATH_PREFIX)
    end
  end
end
