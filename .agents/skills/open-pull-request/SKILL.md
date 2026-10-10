---
name: open-pull-request
description: Open a draft GitHub pull request whose body is the full report. Use when a change is committed and ready for review, or to update an open pull request's body; not for reviewing someone else's pull request.
---

# Open a pull request

1. Check the branch, the working tree, and `HEAD`. Run the checks AGENTS.md,
   "Commands", calls for: the full gate when the change affects rendered
   output, otherwise `bundle exec jekyll build`.
2. Before the push, review the diff: `git status --short`, then the whole
   branch diff, `git diff develop...HEAD`, for unrelated files, secrets,
   private data, and accidental deletions. A change on the list in AGENTS.md,
   "Ask first", needs that approval before you push it.
3. Write the body from `.github/pull_request_template.md`: every section, in
   order; a section that does not apply says `None`.
   - Summary: the reason only as the maintainer supplied it.
   - Related issues: one `Closes #n` per issue the pull request completes;
     `Refs #n` for one it covers only in part.
   - Checks run: commands you ran in this session, with their actual output.
   - Notes for review: mark every wording or design you proposed.
   - Last, your own trailer block, as AGENTS.md, "Provenance", gives it. Do
     not list the commits' trailers. Keep each trailer line within 72
     characters, since GitHub wraps the body into the merge commit; give a
     long check result in "Checks run" and a short one in the trailer.
4. Title and labels: follow "Names" in CONTRIBUTING.md. The type comes from
   the branch name; the areas, from the parts the diff changes.
5. Push the branch, open a draft, then read it back with `gh pr view`:
   `gh pr create --draft --base develop --title "<title>" --label <labels> --body-file <file>`.
   Never mark it ready or merge it.
6. If the branch already has an open pull request, push, then replace its
   body and read it back: `gh pr edit <n> --body-file <file>`.
