require "fileutils"
require "minitest/autorun"
require "open3"
require "pathname"
require "rbconfig"
require "tmpdir"

# Exercises scripts/check-color-contract.rb against the real sources (must pass)
# and against fixtures with a single injected defect (must fail), so the guard
# itself cannot silently rot.
class ColorContractTest < Minitest::Test
  ROOT = Pathname(__dir__).join("..").expand_path
  SCRIPT = ROOT.join("scripts/check-color-contract.rb")

  # The files the guard reads; copied verbatim to build a passing fixture.
  FIXTURE_FILES = %w[
    _data/theme.yml
    _sass/0-settings/_light-mode.scss
    _sass/0-settings/_dark-mode.scss
    _sass/3-base/_base.scss
    _includes/head.html
    assets/js/theme-toggle.js
    assets/js/demo-climate-charts.js
  ].freeze

  def test_passes_for_canonical_repository
    stdout, stderr, status = run_script

    assert status.success?, stderr
    assert_includes stdout, "Color contract policy passed"
  end

  def test_passes_for_clean_fixture
    with_color_fixture do |root|
      stdout, stderr, status = run_script("--root", root)

      assert status.success?, stderr
      assert_includes stdout, "Color contract policy passed"
    end
  end

  def test_flags_undefined_custom_property
    with_color_fixture do |root|
      FileUtils.mkdir_p(root.join("_sass/5-components"))
      File.write(
        root.join("_sass/5-components/_phantom.scss"),
        ".c-phantom { color: var(--color-does-not-exist); }\n"
      )

      _stdout, stderr, status = run_script("--root", root)

      refute status.success?
      assert_includes stderr, "--color-does-not-exist"
    end
  end

  def test_flags_theme_color_drift
    with_color_fixture do |root|
      path = root.join("_data/theme.yml")
      File.write(path, File.read(path, encoding: "UTF-8").sub("#7E4D7C", "#444444"))

      _stdout, stderr, status = run_script("--root", root)

      refute status.success?
      assert_includes stderr, "theme-color"
    end
  end

  def test_flags_insufficient_contrast
    with_color_fixture do |root|
      path = root.join("_sass/0-settings/_light-mode.scss")
      mutated = File.read(path, encoding: "UTF-8")
        .sub(/\$on-surface-variant:\s*#[0-9A-Fa-f]{6};/, "$on-surface-variant: #BBBBBB;")
      File.write(path, mutated)

      _stdout, stderr, status = run_script("--root", root)

      refute status.success?
      assert_includes stderr, "contrast"
    end
  end

  def test_flags_retired_hex
    with_color_fixture do |root|
      path = root.join("assets/js/theme-toggle.js")
      File.write(path, "#{File.read(path, encoding: 'UTF-8')}\n// stray #00796B\n")

      _stdout, stderr, status = run_script("--root", root)

      refute status.success?
      assert_includes stderr, "retired hex"
    end
  end

  private

  def run_script(*arguments)
    Open3.capture3(RbConfig.ruby, SCRIPT.to_s, *arguments.map(&:to_s))
  end

  def with_color_fixture
    Dir.mktmpdir("eyvan-color-contract") do |directory|
      root = Pathname(directory)

      FIXTURE_FILES.each do |relative|
        destination = root.join(relative)
        FileUtils.mkdir_p(destination.dirname)
        FileUtils.cp(ROOT.join(relative), destination)
      end

      yield root
    end
  end
end
