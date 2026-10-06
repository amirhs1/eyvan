---
name: write-commit
description: Write and make a commit in this project's format. Use for every commit.
---

# Write a commit

1. Read the staged diff (`git diff --cached`). One commit holds one coherent
   change.
2. Subject: `<type>(<scope>): <imperative subject>`, with the types and scopes
   in AGENTS.md, "Commit format".
3. Body: bullets of what changed, including which wording or code you were
   given and which you wrote. This is where the detail of your role goes.
4. `Why:` only for a reason the maintainer supplied, in the issue, the pull
   request, or this session. You may copy-edit it, adding no new reason.
   Otherwise leave it out.
5. End with one trailer block, after a blank line, with no blank line in it
   and nothing after it:
   `Assisted-by: <tool>, <model id or not recorded> (<role>)`, then
   `Checks-run:` for each check you ran, then `Ground-truth-source:` if a
   reference value changed. Pick the role as AGENTS.md, "Commit format",
   defines it.
6. Commit from a file: `git commit -F <message file>`. Never add an AI
   `Co-authored-by:` line, and never use `--no-verify`.
7. Check that git reads every trailer: `git log -1 --format='%(trailers)'`.
