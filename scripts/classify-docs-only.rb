#!/usr/bin/env ruby

# Decides whether a pull request into develop changes only documentation and
# agent files, so .github/workflows/develop.yml may skip its Playwright steps.
# Writes docs_only=true or docs_only=false to $GITHUB_OUTPUT, and on true lists
# the changed files in $GITHUB_STEP_SUMMARY.
#
# Fails closed: any other event or base branch, a missing base commit, a failed
# diff, an empty diff, or any path off the list gives docs_only=false.
#
# Changed paths come from the pull request, so on a fork they are untrusted:
# git runs without a shell, -z keeps each name whole, and names are escaped
# before they reach the log or the job summary.

require "open3"

module Eyvan
  class DocsOnlyClassifier
    DOCS_ONLY_FILES = %w[
      .github/pull_request_template.md
      .gitmessage
      ACCESSIBILITY_TESTING.md
      AGENTS.md
      AI-POLICY.md
      CHANGELOG.md
      CLAUDE.md
      CONTRIBUTING.md
      LICENSE
      README.md
      RELEASE_CHECKLIST.md
      SECURITY.md
      THIRD_PARTY_NOTICES.md
    ].freeze

    DOCS_ONLY_DIRECTORIES = %w[
      .agents/
      .claude/
      .github/ISSUE_TEMPLATE/
      .githooks/
    ].freeze

    # On a pull_request run the checkout is GitHub's merge commit, whose first
    # parent is the base branch tip. --no-renames lists both sides of a rename,
    # so moving a code file into a docs directory still lists the code path.
    DIFF_COMMAND = %w[git diff -z --name-only --no-renames HEAD^1 HEAD].freeze

    SKIP_HEADING = "Playwright steps skipped: docs-only change".freeze

    Result = Struct.new(:docs_only, :reason, :paths)

    def initialize(event_name, base_ref)
      @event_name = event_name
      @base_ref = base_ref
    end

    def classify
      unless @event_name == "pull_request" && @base_ref == "develop"
        return Result.new(false, "not a pull request into develop", [])
      end

      stdout, stderr, status = Open3.capture3(*DIFF_COMMAND)
      return Result.new(false, "git diff failed: #{stderr.strip.dump}", []) unless status.success?

      paths = stdout.force_encoding(Encoding::UTF_8).split("\0")
      return Result.new(false, "no changed files", paths) if paths.empty?

      off_list = paths.find { |path| !docs_only_path?(path) }
      return Result.new(false, "not a docs-only path: #{off_list.dump}", paths) if off_list

      Result.new(true, "#{paths.length} docs-only paths changed", paths)
    rescue SystemCallError => error
      Result.new(false, "git diff failed: #{error.message.dump}", [])
    end

    def summary(paths)
      items = paths.map { |path| "- #{inline_code(path)}" }
      "### #{SKIP_HEADING}\n\nChanged files, all on the docs-only list:\n\n#{items.join("\n")}\n"
    end

    private

    def docs_only_path?(path)
      DOCS_ONLY_FILES.include?(path) ||
        DOCS_ONLY_DIRECTORIES.any? { |directory| path.start_with?(directory) }
    end

    # A code span cannot backslash-escape a backtick, so the fence is one
    # backtick longer than the longest run in the name, padded with spaces when
    # the name starts or ends with a backtick or space (CommonMark, "Code
    # spans"). Control characters are shown escaped, so a line break in a name
    # cannot end the span or start a new block.
    def inline_code(path)
      text = path.scrub.gsub(/[[:cntrl:]]/) { |character| character.dump[1..-2] }
      fence = "`" * (text.scan(/`+/).map(&:length).max.to_i + 1)
      padding = text.start_with?("`", " ") || text.end_with?("`", " ") ? " " : ""
      "#{fence}#{padding}#{text}#{padding}#{fence}"
    end
  end
end

if $PROGRAM_NAME == __FILE__
  classifier = Eyvan::DocsOnlyClassifier.new(ENV["GITHUB_EVENT_NAME"], ENV["GITHUB_BASE_REF"])
  result = classifier.classify
  puts "docs_only=#{result.docs_only}: #{result.reason}"

  output = ENV["GITHUB_OUTPUT"].to_s
  File.write(output, "docs_only=#{result.docs_only}\n", mode: "a") unless output.empty?

  summary = ENV["GITHUB_STEP_SUMMARY"].to_s
  File.write(summary, classifier.summary(result.paths), mode: "a") if result.docs_only && !summary.empty?
end
