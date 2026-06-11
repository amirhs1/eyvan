require "fileutils"
require "minitest/autorun"
require "open3"
require "pathname"
require "rbconfig"
require "tmpdir"

class ReleaseChecksTest < Minitest::Test
  ROOT = Pathname(__dir__).join("..").expand_path
  BUILT_OUTPUT_SCRIPT = ROOT.join("scripts/check-built-output.rb")

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

end
