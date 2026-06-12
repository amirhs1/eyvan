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

      forbidden_files + source_maps + sitemap_policy_errors
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
