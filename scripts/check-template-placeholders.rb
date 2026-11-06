#!/usr/bin/env ruby

require "date"
require "optparse"
require "pathname"
require "yaml"

module Eyvan
  class TemplatePlaceholderCheck
    CANONICAL_REPOSITORY = "amirhs1/eyvan"

    # The front matter values the template ships in its own pages. Each one
    # names the template, so a derived site that keeps it advertises Eyvan in
    # its <title>, og:title, and meta description. Keep in sync with the pages.
    SHIPPED_PAGE_VALUES = {
      "index.html" => {
        "title" => "Home | Eyvan",
        "seo_title" => "Eyvan | Visually Minimal, Feature-rich Jekyll Portfolio Template",
        "description" => "Eyvan is a visually minimal, feature-rich Jekyll portfolio template for projects, research notes, long-form writing, media-rich posts, and GitHub Pages.",
      },
      "projects.html" => {
        "title" => "Projects | Eyvan",
        "seo_title" => "Projects | Eyvan Visually Minimal, Feature-rich Portfolio Template",
        "description" => "Browse project posts, technical writing, research notes, media examples, and publishing patterns included in the Eyvan Jekyll template.",
      },
      "about.html" => {
        "seo_title" => "About | Eyvan Portfolio Template",
        "description" => "A personal about page for Eyvan, showing biography, interests, and current focus.",
      },
      "contact.html" => {
        "seo_title" => "Contact | Eyvan Portfolio Template",
      },
      "search.html" => {
        "seo_title" => "Search | Eyvan Portfolio Template",
      },
    }.freeze

    Check = Data.define(:file, :message)

    def initialize(root:, repository:)
      @root = Pathname(root).expand_path
      @repository = repository.to_s.downcase
    end

    def warnings
      return [] if @repository == CANONICAL_REPOSITORY

      config_warnings + author_warnings + footer_warnings + page_warnings
    end

    private

    def config_warnings
      file = "_config.yml"
      config = yaml(file)
      warnings = []

      warnings << Check.new(file:, message: "Replace the placeholder site title.") if config["title"] == "Your Name"
      warnings << Check.new(file:, message: "Replace the placeholder author name.") if config.dig("author", "name") == "Your Name"
      warnings << Check.new(file:, message: "Replace the placeholder author email.") if config.dig("author", "email") == "hello@example.com"
      warnings << Check.new(file:, message: "Replace the placeholder author URL.") if config.dig("author", "uri") == "https://example.com"

      if config["url"] == "https://amirhs1.github.io"
        warnings << Check.new(file:, message: "Set the canonical site URL for this repository.")
      end

      if config["baseurl"] == "/eyvan"
        warnings << Check.new(file:, message: "Confirm or replace the demo /eyvan base URL.")
      end

      warnings
    end

    def author_warnings
      file = "_data/author.yml"
      author = yaml(file)
      warnings = []

      warnings << Check.new(file:, message: "Replace the placeholder profile name.") if author["name"] == "Your Name"
      warnings << Check.new(file:, message: "Replace the placeholder profile email.") if author["email"] == "hello@example.com"
      warnings << Check.new(file:, message: "Replace the placeholder profile website.") if author["website"] == "https://example.com"

      warnings
    end

    def footer_warnings
      file = "_data/footer.yml"
      footer = yaml(file)
      return [] unless footer["copyright"].to_s.include?("Your Name")

      [Check.new(file:, message: "Replace the placeholder footer identity.")]
    end

    def page_warnings
      SHIPPED_PAGE_VALUES.filter_map do |file, shipped|
        front_matter = front_matter(file)
        next unless shipped.any? { |key, value| front_matter[key] == value }

        Check.new(file:, message: "Replace the template's own title, SEO title, or description.")
      end
    end

    def front_matter(relative_path)
      path = @root.join(relative_path)
      return {} unless path.file?

      match = path.read(encoding: "UTF-8").match(/\A---\s*\n(.*?)^---\s*$/m)
      return {} unless match

      YAML.safe_load(match[1], permitted_classes: [Date, Time], aliases: true) || {}
    end

    def yaml(relative_path)
      path = @root.join(relative_path)
      return {} unless path.file?

      YAML.safe_load(path.read, permitted_classes: [Date, Time], aliases: true) || {}
    end
  end
end

if $PROGRAM_NAME == __FILE__
  options = {
    root: ".",
    repository: ENV.fetch("GITHUB_REPOSITORY", ""),
  }

  OptionParser.new do |parser|
    parser.on("--root PATH") { |path| options[:root] = path }
    parser.on("--repository OWNER/NAME") { |repository| options[:repository] = repository }
  end.parse!

  check = Eyvan::TemplatePlaceholderCheck.new(**options)
  warnings = check.warnings

  warnings.each do |warning|
    if ENV["GITHUB_ACTIONS"] == "true"
      puts "::warning file=#{warning.file},title=Template identity::#{warning.message}"
    else
      puts "WARNING #{warning.file}: #{warning.message}"
    end
  end

  puts "Template identity check completed with #{warnings.length} warning(s)."
end
