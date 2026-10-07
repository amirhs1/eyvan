## Summary

What changed and why. The reason comes from a person or an outside report, not
from an AI tool; an agent gives it only as supplied.

## Related issues

`Closes #n` for each issue this pull request completes, or `None`.

## Problem

What was wrong or missing, with evidence.

## What changed

Files as `path:line`, plus reasoning the diff does not show.

## Checks run

Each check actually run, as `command → result`, and any human review or
independent reference used to judge correctness. Then a `Not verified:` line
for anything not checked, and why.

## Decisions and risks

Choices made, the alternatives rejected, and what could break.

## Notes for review

What needs line-by-line review, and any uncertainty, limitation, or follow-up.

## AI assistance

Write `None`, or name each AI tool used, its model if known, its role, and what
it did. If the model was not recorded, write `not recorded`; do not guess. For
example:

```text
<tool> (<model>): drafted the parser and tests; I revised the error handling
and reviewed the result.
```

Then repeat the branch's `Assisted-by:` lines so the commit and pull request
records agree. Copy them from the actual commits, not from an example:
`git log --no-merges --format=%B develop..HEAD | grep '^Assisted-by:'`. Do not
include prompts, secrets, or personal data.
Responsibility for the contribution remains with the contributor; see
`AI-POLICY.md` where that policy exists.
