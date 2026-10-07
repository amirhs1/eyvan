---
name: open-pull-request
description: Push the branch and open a draft pull request whose body is the full report. Use when a change is ready for review.
---

# Open a pull request

1. Check the branch, the working tree, and `HEAD`. Run the checks AGENTS.md,
   "Commands", calls for: the full gate when the change affects rendered
   output, otherwise `bundle exec jekyll build`.
2. Write the body from `.github/pull_request_template.md`: every section, in
   order; a section that does not apply says `None`.
   - Summary: the reason only as the maintainer supplied it.
   - Related issues: one `Closes #n` per issue the pull request completes;
     `Refs #n` for one it covers only in part.
   - Checks run: commands you ran in this session, with their actual output.
   - Notes for review: mark every wording or design you proposed.
   - AI assistance, last: tool, model, role, then the branch's `Assisted-by:`
     lines from
     `git log --no-merges --format=%B develop..HEAD | grep '^Assisted-by:'`.
3. Title and label: follow "Names" in AGENTS.md, "Git". The label is the one
   the branch prefix sets, or none. Only these labels exist; never create
   others: `bug`, `enhancement`, `documentation`, `chore`, `dependencies`,
   `release`, `question`, `help wanted`. Never apply `release`, `question`,
   or `help wanted`; they are for human triage.
4. Push the branch and open a draft into `develop`:
   `gh pr create --draft --base develop --title "<title>" --label <label> --body-file <file>`
   (leave out `--label` when no label fits). Never mark it ready or merge it;
   humans own every merge.
5. Read the body back (`gh pr view`), then give the full chat report.
