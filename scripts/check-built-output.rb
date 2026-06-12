#!/usr/bin/env ruby

require "pathname"

module Eyvan
  class BuiltOutputCheck
    FORBIDDEN_ROOT_FILES = %w[
      ACCESSIBILITY_TESTING.md
      CHANGELOG.md
      CONTRIBUTING.md
      LICENSE
      RELEASE_CHECKLIST.md
      SECURITY.md
    ].freeze

    FORBIDDEN_SITEMAP_PATHS = %w[
      /assets/files/resume.pdf
    ].freeze

    def initialize(site_dir)
      @site_dir = Pathname(site_dir).expand_path
    end

    def errors
      return ["Built site directory does not exist: #{@site_dir}"] unless @site_dir.directory?

      forbidden_files + source_maps + sitemap_policy_errors + remote_runtime_dependencies
    end

    private

    def forbidden_files
      FORBIDDEN_ROOT_FILES.filter_map do |name|
        path = @site_dir.join(name)
        "Repository-only file was published: #{path.relative_path_from(@site_dir)}" if path.exist?
      end
    end

    def source_maps
      @site_dir.glob("**/*.map").map do |path|
        "Source map was published: #{path.relative_path_from(@site_dir)}"
      end
    end

    def sitemap_policy_errors
      sitemap = @site_dir.join("sitemap.xml")
      return ["Built sitemap is missing: sitemap.xml"] unless sitemap.file?

      contents = sitemap.read

      FORBIDDEN_SITEMAP_PATHS.filter_map do |path|
        "Sitemap contains excluded path: #{path}" if contents.include?(path)
      end
    end

    def remote_runtime_dependencies
      errors = []

      @site_dir.glob("**/*.html").sort.each do |path|
        contents = path.read
        relative = path.relative_path_from(@site_dir)

        contents.scan(/<script\b[^>]*\bsrc=["'](https?:\/\/[^"']+)["']/i) do |match|
          errors << "Remote script was published in #{relative}: #{match.first}"
        end

        contents.scan(
          /<link\b(?=[^>]*\brel=["'][^"']*preload[^"']*["'])(?=[^>]*\bas=["']font["'])[^>]*\bhref=["'](https?:\/\/[^"']+)["']/i
        ) do |match|
          errors << "Remote font preload was published in #{relative}: #{match.first}"
        end
      end

      @site_dir.glob("assets/js/**/*.js").sort.each do |path|
        contents = path.read
        relative = path.relative_path_from(@site_dir)

        contents.scan(/(?:\.src|src)\s*=\s*["'](https?:\/\/[^"']+)["']/i) do |match|
          errors << "Remote runtime loader was published in #{relative}: #{match.first}"
        end

        contents.scan(/import\s*\(\s*["'](https?:\/\/[^"']+)["']/i) do |match|
          errors << "Remote module import was published in #{relative}: #{match.first}"
        end
      end

      @site_dir.glob("assets/css/**/*.css").sort.each do |path|
        contents = path.read
        relative = path.relative_path_from(@site_dir)

        contents.scan(/url\(\s*["']?(https?:\/\/[^)"']+\.(?:woff2?|ttf|otf))["']?\s*\)/i) do |match|
          errors << "Remote font URL was published in #{relative}: #{match.first}"
        end
      end

      errors
    end
  end
end

if $PROGRAM_NAME == __FILE__
  site_dir = ARGV.fetch(0, "_site")
  check = Eyvan::BuiltOutputCheck.new(site_dir)
  errors = check.errors

  if errors.empty?
    puts "Built output policy passed for #{Pathname(site_dir).expand_path}."
  else
    warn errors.map { |error| "ERROR: #{error}" }.join("\n")
    exit 1
  end
end
