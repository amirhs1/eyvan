---
name: draft-release
description: Prepare a release's changelog section and draft its GitHub release; never tag or publish it. Use only when the person running you asks for a release.
disable-model-invocation: true
---

# Draft a release

The person running you chooses the version, merges, tags, and publishes. You
prepare the changelog and the draft.

1. Tag and release title: both `v<MAJOR>.<MINOR>.<PATCH>`, as
   CONTRIBUTING.md, "Names", sets them.
2. Release pull request into `develop`, before the `develop` → `main` merge:
   - Branch `release/<MAJOR>.<MINOR>.<PATCH>` from `origin/develop`
     (create-branch).
   - The person runs `npm version <MAJOR>.<MINOR>.<PATCH> --no-git-tag-version`;
     `package-lock.json` is not yours to edit (AGENTS.md, "Where you may
     write"). Check that the diff changes only the version fields.
   - List what merged since the last tag:
     `git log --first-parent --format='%h %s' <last tag>..origin/develop`.
     Every pull request in it has a changelog line, or is a `develop` ↔
     `main` merge, a release pull request, or a change no site sees; name
     the ones you leave out.
3. CHANGELOG.md, in the Keep a Changelog form the file states:
   - Move the `## [Unreleased]` entries under
     `## [<MAJOR>.<MINOR>.<PATCH>] - <YYYY-MM-DD>`, and leave
     `## [Unreleased]` empty above it.
   - Use the headings and order of the file's latest version section, each
     only when it has a change. A release with breaking changes opens with
     `### Breaking changes`, one migration step per item.
   - One line per change that a site built on Eyvan can see, citing its pull
     request as `(#n)`.
   - Links at the end of the file: `[Unreleased]` compares
     `v<MAJOR>.<MINOR>.<PATCH>...HEAD`, and a new
     `[<MAJOR>.<MINOR>.<PATCH>]` line compares the last tag with
     `v<MAJOR>.<MINOR>.<PATCH>`.
   - No trailer in the file; the commit carries one (write-commit). Open the
     pull request with type `release` (open-pull-request).
4. Once the person has merged the release pull request and the `develop` →
   `main` pull request: check the branch, the working tree, and `HEAD` — on
   `main`, clean, level with `origin/main`, at that merge commit.
5. Release notes: the version's changelog section without its heading, word
   for word, then your trailer block (AGENTS.md, "Provenance"). Check that the
   two match. Create the draft against the merge commit, and never tag or
   publish it:
   `gh release create v<version> --draft --title v<version> --target <full SHA> --notes-file <file>`.
6. Hand over: the person creates and pushes the annotated tag, then publishes
   the draft, as RELEASE_CHECKLIST.md, "Post-Merge Publishing", sets out:
   `git tag -a v<version> <full SHA> -m "v<version>"`, then
   `git push origin v<version>`.
7. To revise the draft: `gh release edit v<version> --notes-file <file>`.
