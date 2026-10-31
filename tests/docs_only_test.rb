require "fileutils"
require "minitest/autorun"
require "open3"
require "pathname"
require "rbconfig"
require "tmpdir"

# Exercises scripts/classify-docs-only.rb in throwaway git repositories shaped
# like the checkout of a pull_request run: a merge commit whose first parent is
# the base tip. Each rule has a case that may skip and a case with a single
# injected defect that must run every step.
class DocsOnlyTest < Minitest::Test
  ROOT = Pathname(__dir__).join("..").expand_path
  SCRIPT = ROOT.join("scripts/classify-docs-only.rb")

  # The docs-only list in issue #98, item 3, as the maintainer approved it: one
  # path per listed file, and one file inside each listed directory.
  DOCS_ONLY_PATHS = %w[
    .agents/skills/write-test/SKILL.md
    .claude/settings.json
    .githooks/commit-msg
    .github/ISSUE_TEMPLATE/bug_report.md
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

  # Keeps the person's own git configuration, hooks, and signing out of the
  # fixture repositories.
  GIT_ENV = {
    "GIT_CONFIG_GLOBAL" => File::NULL,
    "GIT_CONFIG_NOSYSTEM" => "1",
    "GIT_AUTHOR_NAME" => "Eyvan Test",
    "GIT_AUTHOR_EMAIL" => "test@example.test",
    "GIT_COMMITTER_NAME" => "Eyvan Test",
    "GIT_COMMITTER_EMAIL" => "test@example.test"
  }.freeze

  # The event variables GitHub sets. Every case sets all of them, so a run
  # inside CI never reads or writes the real job's values.
  PULL_REQUEST_INTO_DEVELOP = {
    "GITHUB_EVENT_NAME" => "pull_request",
    "GITHUB_BASE_REF" => "develop"
  }.freeze

  # The reason logged when HEAD has no second parent.
  NOT_A_MERGE = "HEAD is not a merge commit, or its parents were not fetched".freeze

  Run = Struct.new(:stdout, :output, :summary)

  def test_pull_request_into_develop_changing_only_listed_paths_may_skip
    run = classify_pull_request { |repo| DOCS_ONLY_PATHS.each { |path| write(repo, path) } }

    assert_equal "docs_only=true\n", run.output
    assert_equal "docs_only=true: 17 docs-only paths changed\n", run.stdout
  end

  def test_push_to_develop_runs_every_step
    run = classify_pull_request(
      env: { "GITHUB_EVENT_NAME" => "push", "GITHUB_BASE_REF" => "" }
    ) { |repo| write(repo, "AGENTS.md") }

    assert_equal "docs_only=false\n", run.output
    assert_equal "docs_only=false: not a pull request into develop\n", run.stdout
  end

  def test_pull_request_into_main_runs_every_step
    run = classify_pull_request(
      env: { "GITHUB_EVENT_NAME" => "pull_request", "GITHUB_BASE_REF" => "main" }
    ) { |repo| write(repo, "AGENTS.md") }

    assert_equal "docs_only=false\n", run.output
    assert_equal "docs_only=false: not a pull request into develop\n", run.stdout
  end

  def test_one_code_path_among_docs_paths_runs_every_step
    run = classify_pull_request do |repo|
      write(repo, "AGENTS.md")
      write(repo, "_includes/head.html")
    end

    assert_equal "docs_only=false\n", run.output
    assert_equal "docs_only=false: not a docs-only path: \"_includes/head.html\"\n", run.stdout
  end

  # Root docs are excluded from the build; a README below the root is published.
  def test_nested_file_named_like_a_root_doc_runs_every_step
    run = classify_pull_request { |repo| write(repo, "assets/fonts/licenses/README.md") }

    assert_equal "docs_only=false\n", run.output
    assert_equal(
      "docs_only=false: not a docs-only path: \"assets/fonts/licenses/README.md\"\n",
      run.stdout
    )
  end

  def test_github_path_outside_the_listed_ones_runs_every_step
    run = classify_pull_request { |repo| write(repo, ".github/workflows/develop.yml") }

    assert_equal "docs_only=false\n", run.output
    assert_equal(
      "docs_only=false: not a docs-only path: \".github/workflows/develop.yml\"\n",
      run.stdout
    )
  end

  def test_directory_sharing_a_listed_name_prefix_runs_every_step
    run = classify_pull_request { |repo| write(repo, ".agents-archive/notes.md") }

    assert_equal "docs_only=false\n", run.output
    assert_equal(
      "docs_only=false: not a docs-only path: \".agents-archive/notes.md\"\n",
      run.stdout
    )
  end

  def test_empty_diff_runs_every_step
    run = classify_pull_request { |_repo| }

    assert_equal "docs_only=false\n", run.output
    assert_equal "docs_only=false: no changed files\n", run.stdout
  end

  # Without the merge check, HEAD^1..HEAD shows only AGENTS.md and skips.
  def test_non_merge_head_runs_every_step
    run = with_repository do |repo, outputs|
      write(repo, "_includes/head.html")
      commit(repo, "code change")
      write(repo, "AGENTS.md")
      commit(repo, "docs change")
      run_classifier(repo, outputs, PULL_REQUEST_INTO_DEVELOP)
    end

    assert_equal "docs_only=false\n", run.output
    assert_equal "docs_only=false: #{NOT_A_MERGE}\n", run.stdout
  end

  # A depth-1 clone, the actions/checkout default, has no parents of HEAD.
  def test_missing_base_commit_runs_every_step
    run = with_repository do |repo, outputs|
      merge_pull_request(repo) { write(repo, "AGENTS.md") }
      clone = repo.dirname.join("shallow")
      git(repo.dirname, "clone", "-q", "--depth", "1", "file://#{repo}", clone.to_s)
      run_classifier(clone, outputs, PULL_REQUEST_INTO_DEVELOP)
    end

    assert_equal "docs_only=false\n", run.output
    assert_equal "docs_only=false: #{NOT_A_MERGE}\n", run.stdout
  end

  # Deleting the base commit's root tree makes the diff itself fail.
  def test_failed_diff_runs_every_step
    run = with_repository do |repo, outputs|
      merge_pull_request(repo) { write(repo, "AGENTS.md") }
      tree = git(repo, "rev-parse", "HEAD^1^{tree}").strip
      File.delete(repo.join(".git/objects", tree[0, 2], tree[2..]))
      run_classifier(repo, outputs, PULL_REQUEST_INTO_DEVELOP)
    end

    assert_equal "docs_only=false\n", run.output
    assert_match(/\Adocs_only=false: git diff failed: "/, run.stdout)
  end

  def test_renaming_a_docs_file_within_the_list_may_skip
    run = classify_pull_request do |repo|
      FileUtils.mkdir_p(repo.join(".claude"))
      FileUtils.mv(repo.join(".agents/notes.md"), repo.join(".claude/notes.md"))
    end

    assert_equal "docs_only=true\n", run.output
  end

  def test_moving_a_code_file_into_a_docs_directory_runs_every_step
    run = classify_pull_request do |repo|
      FileUtils.mv(repo.join("_includes/head.html"), repo.join(".agents/head.html"))
    end

    assert_equal "docs_only=false\n", run.output
    assert_equal "docs_only=false: not a docs-only path: \"_includes/head.html\"\n", run.stdout
  end

  # Without -z, git quotes a non-ASCII name, and the quoted name is off the list.
  def test_non_ascii_docs_path_may_skip
    run = classify_pull_request { |repo| write(repo, ".agents/café.md") }

    assert_equal "docs_only=true\n", run.output
  end

  def test_skip_lists_each_changed_file_in_the_job_summary
    run = classify_pull_request do |repo|
      write(repo, "AGENTS.md")
      write(repo, ".agents/notes.md")
    end

    assert_equal(
      <<~MARKDOWN,
        ### Playwright steps skipped: docs-only change

        Changed files, all on the docs-only list:

        - `.agents/notes.md`
        - `AGENTS.md`
      MARKDOWN
      run.summary
    )
  end

  def test_running_every_step_writes_no_job_summary
    run = classify_pull_request do |repo|
      write(repo, "AGENTS.md")
      write(repo, "_includes/head.html")
    end

    assert_equal "", run.summary
  end

  def test_summary_keeps_backticks_and_line_breaks_in_file_names_inside_inline_code
    run = classify_pull_request do |repo|
      write(repo, ".agents/a`b.md")
      write(repo, ".agents/edge`")
      write(repo, ".agents/x\n\n# Injected heading")
    end

    assert_includes run.summary, "- ``.agents/a`b.md``\n"
    assert_includes run.summary, "- `` .agents/edge` ``\n"
    assert_includes run.summary, "- `.agents/x\\n\\n# Injected heading`\n"
    refute_match(/^# Injected heading/, run.summary)
  end

  private

  # Builds develop with a base commit, branches a pull request, lets the block
  # change it, moves develop on by one commit, then merges the pull request
  # with --no-ff, the shape GitHub's merge ref has. Only the first parent sees
  # the commit that moved develop on, so diffing the wrong parent shows a
  # _layouts/ path and fails the docs-only cases.
  def classify_pull_request(env: PULL_REQUEST_INTO_DEVELOP, &changes)
    with_repository do |repo, outputs|
      merge_pull_request(repo, &changes)
      run_classifier(repo, outputs, env)
    end
  end

  def merge_pull_request(repo)
    git(repo, "switch", "-q", "-c", "pull-request")
    yield repo
    commit(repo, "pull request")
    git(repo, "switch", "-q", "develop")
    write(repo, "_layouts/default.html")
    commit(repo, "develop moves on")
    git(repo, "merge", "-q", "--no-ff", "-m", "merge pull request", "pull-request")
  end

  def with_repository
    Dir.mktmpdir("eyvan-docs-only") do |directory|
      repo = Pathname(directory).join("repo")
      outputs = Pathname(directory).join("outputs")
      FileUtils.mkdir_p([repo, outputs])
      git(repo, "init", "-q", "-b", "develop")
      write(repo, "_includes/head.html")
      write(repo, "AGENTS.md")
      write(repo, ".agents/notes.md")
      commit(repo, "base")
      yield repo, outputs
    end
  end

  def run_classifier(repo, outputs, env)
    output = outputs.join("github_output")
    summary = outputs.join("step_summary")
    FileUtils.touch([output, summary])
    environment = GIT_ENV.merge(env).merge(
      "GITHUB_OUTPUT" => output.to_s,
      "GITHUB_STEP_SUMMARY" => summary.to_s
    )

    stdout, stderr, status = Open3.capture3(
      environment, RbConfig.ruby, SCRIPT.to_s, chdir: repo.to_s
    )

    assert status.success?, stderr
    Run.new(stdout, output.read, summary.read)
  end

  # Each write has new content, so rewriting a base file is a change.
  def write(repo, path)
    @writes = @writes.to_i + 1
    file = repo.join(path)
    FileUtils.mkdir_p(file.dirname)
    File.write(file, "#{path} #{@writes}\n")
  end

  def commit(repo, message)
    git(repo, "add", "-A")
    git(repo, "commit", "-q", "--allow-empty", "-m", message)
  end

  def git(repo, *arguments)
    stdout, stderr, status = Open3.capture3(GIT_ENV, "git", *arguments, chdir: repo.to_s)
    assert status.success?, stderr
    stdout
  end
end
