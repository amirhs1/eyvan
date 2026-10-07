---
name: open-issue
description: Open an issue that states a problem, its evidence, and the proposed change. Use when asked to file an issue.
---

# Open an issue

1. Open an issue only for deferred or undecided work; work starting now gets
   a pull request (AGENTS.md, "Git"). Search for a duplicate first:
   `gh issue list --state all --search "<terms>"`.
2. Title: follow "Names" in AGENTS.md, "Git".
3. Body: follow the matching form in `.github/ISSUE_TEMPLATE/`, with its
   bold headings in order: `bug_report.md` for a bug, `feature_request.md`
   otherwise. Leave out a heading that does not apply, such as the device
   details for a bug that does not depend on them.
   - Give evidence as `path:line`, `command → result`, or a link.
   - Mark wording you drafted as a proposal.
4. The reason comes from the person who asked, or from the evidence; never
   invent it. Include no secrets or personal data.
5. Open it with `gh issue create --title "<title>" --body-file <file>`, then
   give the full chat report.
