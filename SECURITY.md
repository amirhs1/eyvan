# Security Policy

Eyvan is a static Jekyll template — it has no server-side runtime, database, or
authentication layer. Security-relevant issues are most likely to involve the
build toolchain (Ruby gems, npm packages), generated markup/JavaScript (for
example, XSS via unescaped Liquid output), or the GitHub Actions workflows that
build and deploy the site.

## Supported Versions

Only the latest release and the `main` branch receive security fixes. Eyvan is
a template that people fork and customize, so there is no long-term support for
older tags — if you forked an earlier version, diff against the latest release
to pick up fixes.

## Reporting a Vulnerability

Please do not open a public issue for security reports. Instead, use GitHub's
private vulnerability reporting for this repository:

1. Open the [**Report a vulnerability**](https://github.com/amirhs1/eyvan/security/advisories/new) form.
2. Describe the issue, its impact, and steps to reproduce it.

This opens a private advisory so the issue can be discussed and fixed before
any public disclosure. We aim to acknowledge new reports within a few days.

If the vulnerability lives in a third-party dependency rather than in this
template's own code, please also report it to that project directly (and feel
free to let us know, so we can update or replace the dependency).
