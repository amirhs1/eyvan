require "fileutils"
require "minitest/autorun"
require "open3"
require "pathname"
require "rbconfig"
require "tmpdir"

class ReleaseChecksTest < Minitest::Test
  ROOT = Pathname(__dir__).join("..").expand_path
  BUILT_OUTPUT_SCRIPT = ROOT.join("scripts/check-built-output.rb")
  PLACEHOLDER_SCRIPT = ROOT.join("scripts/check-template-placeholders.rb")

  def test_built_output_check_accepts_clean_site
    with_site_fixture do |site|
      stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site)

      assert status.success?, stderr
      assert_includes stdout, "Built output policy passed"
    end
  end

  def test_built_output_check_reads_utf8_when_the_shell_locale_is_ascii
    with_site_fixture do |site|
      File.write(
        site.join("sitemap.xml"),
        "<urlset><!-- Résumé — café --></urlset>",
        encoding: "UTF-8"
      )
      File.write(
        site.join("unicode.html"),
        "<p>Résumé — café</p>",
        encoding: "UTF-8"
      )

      stdout, stderr, status = run_script(
        BUILT_OUTPUT_SCRIPT,
        site,
        env: { "LANG" => "C", "LC_ALL" => "C" }
      )

      assert status.success?, stderr
      assert_includes stdout, "Built output policy passed"
    end
  end

  def test_built_output_check_rejects_forbidden_files_source_maps_and_resume_sitemap
    with_site_fixture do |site|
      File.write(site.join("LICENSE"), "license")
      FileUtils.mkdir_p(site.join("assets/css"))
      File.write(site.join("assets/css/main.css.map"), "{}")
      File.write(
        site.join("sitemap.xml"),
        "<loc>https://example.test/assets/files/resume.pdf</loc>"
      )

      _stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site)

      refute status.success?
      assert_includes stderr, "Repository-only file was published: LICENSE"
      assert_includes stderr, "Source map was published: assets/css/main.css.map"
      assert_includes stderr, "Sitemap contains excluded path: /assets/files/resume.pdf"
    end
  end

  def test_built_output_check_rejects_machine_local_agent_files
    with_site_fixture do |site|
      File.write(site.join("AGENTS.local.md"), "local settings")
      File.write(site.join("CLAUDE.local.md"), "@AGENTS.local.md")

      _stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site)

      refute status.success?
      assert_includes stderr, "Repository-only file was published: AGENTS.local.md"
      assert_includes stderr, "Repository-only file was published: CLAUDE.local.md"
    end
  end

  def test_built_output_check_rejects_mutable_or_unprotected_mathjax
    with_site_fixture do |site|
      File.write(
        site.join("math.html"),
        <<~HTML
          <script
            id="MathJax-script"
            async
            src="https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js">
          </script>
        HTML
      )

      _stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site)

      refute status.success?
      assert_includes stderr, "MathJax loader policy failed in math.html"
      assert_includes stderr, "mathjax@4/tex-chtml.js"
      assert_includes stderr, "integrity=nil"
      assert_includes stderr, "defer attribute is required"
      assert_includes stderr, "async attribute is forbidden"
    end
  end

  def test_built_output_check_accepts_the_approved_mathjax_loader
    with_site_fixture do |site|
      File.write(
        site.join("math.html"),
        <<~HTML
          <script
            id="MathJax-script"
            defer
            src="https://cdn.jsdelivr.net/npm/mathjax@4.1.2/tex-chtml.js"
            integrity="sha384-zAhQQhdaMeHsMProNntGGg6nOUVcfuF9F22C3d1qJ9NZAVzCplXk1X85D2O5iufn"
            crossorigin="anonymous"
            referrerpolicy="no-referrer">
          </script>
        HTML
      )

      _stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site)

      assert status.success?, stderr
    end
  end

  def test_built_output_check_rejects_mutable_or_unprotected_chartjs_demo
    with_site_fixture do |site|
      File.write(
        site.join("climate.html"),
        <<~HTML
          <script
            id="ChartJS-demo-script"
            async
            src="https://cdn.jsdelivr.net/npm/chart.js">
          </script>
        HTML
      )

      _stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site)

      refute status.success?
      assert_includes stderr, "Chart.js demo loader policy failed in climate.html"
      assert_includes stderr, "cdn.jsdelivr.net/npm/chart.js"
      assert_includes stderr, "integrity=nil"
      assert_includes stderr, "defer attribute is required"
      assert_includes stderr, "async attribute is forbidden"
    end
  end

  def test_built_output_check_accepts_the_approved_chartjs_demo_loader
    with_site_fixture do |site|
      File.write(
        site.join("climate.html"),
        <<~HTML
          <script
            id="ChartJS-demo-script"
            defer
            src="https://cdn.jsdelivr.net/npm/chart.js@4.5.1/dist/chart.umd.min.js"
            integrity="sha384-jb8JQMbMoBUzgWatfe6COACi2ljcDdZQ2OxczGA3bGNeWe+6DChMTBJemed7ZnvJ"
            crossorigin="anonymous"
            referrerpolicy="no-referrer">
          </script>
        HTML
      )

      _stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site)

      assert status.success?, stderr
    end
  end

  def test_built_output_check_rejects_search_output_when_search_is_off
    with_site_fixture do |site|
      config = site.join("_config.yml")
      File.write(config, "search: false\n")
      write_search_output(site)

      _stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site, config)

      refute status.success?
      assert_includes stderr, "Search file was published while search is off: search/index.html"
      assert_includes stderr, "Search file was published while search is off: assets/js/search.js"
      assert_includes stderr, "Search index was published while search is off: pagefind/"
      assert_includes stderr, "Search markup was published while search is off: index.html"
      assert_includes stderr, "Search markup was published while search is off: projects/post/index.html"
      assert_includes stderr, "Search markup was published while search is off: assets/css/main.css"
    end
  end

  def test_built_output_check_accepts_search_output_when_search_is_on
    with_site_fixture do |site|
      config = site.join("_config.yml")
      File.write(config, "search: true\n")
      write_search_output(site)

      stdout, stderr, status = run_script(BUILT_OUTPUT_SCRIPT, site, config)

      assert status.success?, stderr
      assert_includes stdout, "Built output policy passed"
    end
  end

  def test_placeholder_check_is_silent_for_canonical_repository
    with_template_fixture do |root|
      stdout, stderr, status = run_script(
        PLACEHOLDER_SCRIPT,
        "--root",
        root,
        "--repository",
        "amirhs1/eyvan"
      )

      assert status.success?, stderr
      assert_includes stdout, "0 warning(s)"
      refute_includes stdout, "WARNING"
    end
  end

  def test_placeholder_check_warns_without_failing_for_derived_repository
    with_template_fixture do |root|
      stdout, stderr, status = run_script(
        PLACEHOLDER_SCRIPT,
        "--root",
        root,
        "--repository",
        "example/portfolio",
        env: { "GITHUB_ACTIONS" => "true" }
      )

      assert status.success?, stderr
      assert_includes stdout, "::warning file=_config.yml"
      assert_includes stdout, "::warning file=_data/author.yml"
      assert_includes stdout, "::warning file=_data/footer.yml"
      assert_includes stdout, "10 warning(s)"
    end
  end

  def test_placeholder_check_warns_without_failing_when_config_has_a_date
    with_template_fixture do |root|
      File.write(root.join("_config.yml"), "last_updated: 2026-01-15\n", mode: "a")

      stdout, stderr, status = run_script(
        PLACEHOLDER_SCRIPT,
        "--root",
        root,
        "--repository",
        "example/portfolio"
      )

      assert status.success?, stderr
      assert_includes stdout, "Template identity check completed with 10 warning(s)."
    end
  end

  private

  def run_script(script, *arguments, env: {})
    Open3.capture3(env, RbConfig.ruby, script.to_s, *arguments.map(&:to_s))
  end

  def with_site_fixture
    Dir.mktmpdir("eyvan-built-output") do |directory|
      site = Pathname(directory)
      File.write(site.join("sitemap.xml"), "<urlset></urlset>")
      yield site
    end
  end

  # One file per kind of output a search-enabled build ships.
  def write_search_output(site)
    FileUtils.mkdir_p(site.join("search"))
    File.write(site.join("search/index.html"), '<div class="c-search" data-search></div>')
    FileUtils.mkdir_p(site.join("assets/js"))
    File.write(site.join("assets/js/search.js"), "")
    FileUtils.mkdir_p(site.join("pagefind"))
    File.write(site.join("pagefind/pagefind.js"), "")
    File.write(site.join("index.html"), '<a class="c-icon-link c-search-link" href="/search/">Search</a>')
    FileUtils.mkdir_p(site.join("projects/post"))
    File.write(site.join("projects/post/index.html"), "<article data-pagefind-body></article>")
    FileUtils.mkdir_p(site.join("assets/css"))
    File.write(site.join("assets/css/main.css"), ".c-search-link{border-color:transparent}")
  end

  def with_template_fixture
    Dir.mktmpdir("eyvan-template") do |directory|
      root = Pathname(directory)
      FileUtils.mkdir_p(root.join("_data"))
      File.write(
        root.join("_config.yml"),
        <<~YAML
          title: "Your Name"
          author:
            name: "Your Name"
            email: "hello@example.com"
            uri: "https://example.com"
          url: "https://amirhs1.github.io"
          baseurl: "/eyvan"
        YAML
      )
      File.write(
        root.join("_data/author.yml"),
        <<~YAML
          name: "Your Name"
          email: "hello@example.com"
          website: "https://example.com"
        YAML
      )
      File.write(root.join("_data/footer.yml"), "copyright: \"© 2026 Your Name\"\n")
      yield root
    end
  end
end
