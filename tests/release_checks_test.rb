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
