---
description: Run the Eyvan template audit and write AUDIT_REPORT.md
model: opus
---
# Eyvan Jekyll Template Audit Prompt

You are auditing this repository as a professional Jekyll template reviewer. Assume the **repository is the current working directory** unless your initial reconnaissance shows otherwise.

The repository is **Eyvan**, a visually minimalist, feature-rich Jekyll template intended for GitHub Pages. Your goal is to produce an evidence-based audit report that determines whether the template is clean, maintainable, accessible, performant, legally reusable, easy to customize, and reliable to build/deploy.

Do not make code changes unless explicitly asked. Do not delete files. Do not modify lockfiles. Do not edit configuration. Do not deploy or publish anything. The one file you may **create** is the audit report itself (see Section 11). Your job is to audit, verify, score, and recommend.

## 0. Workflow Overview

Work in this order, and do not skip ahead:

1. **Recon** — map the repository and identify what it is (Section 4).
2. **Build verification** — confirm it builds, including subpath/`baseurl` behavior (Section 6).
3. **Selective deep reads** — read representative files against the checklists (Section 8); do not read everything.
4. **Score** — apply the weighted scorecard (Section 9) and assign severities (Section 10).
5. **Report** — write the report to a file in the repo root (Section 11), formatted per Section 12.

## 1. Audit Philosophy

Evaluate Eyvan as **a visually minimalist, feature-rich professional portfolio Jekyll template**, not as a large documentation framework or enterprise CMS.

Prefer simple, Jekyll-native solutions. Do not penalize the project for avoiding complex frontend tooling unless that creates a real limitation. Do not praise or criticize based on visual appearance alone. Use evidence from actual files, structure, command output, and built output.

Clearly separate **Evidence**, **Interpretation**, and **Recommendation** throughout.

Do not guess external metrics such as GitHub stars, traffic, usage, or maintainership signals unless they are visible in the repository or accessible through safe commands.

## 2. Eyvan-Specific Context

Treat these as the intended design goals of the template:

- Minimalist personal portfolio / research / writing website
- GitHub Pages compatible **via GitHub Actions** (the native GitHub Pages builder is intentionally not used, because `jekyll/tagging` is not supported by it)
- Beginner-friendly customization
- Jekyll-first, Markdown-first architecture
- Clean Liquid includes and layouts
- ITCSS-based SCSS organization with BEM-style class naming
- Self-hosted or easily replaceable assets
- Clear typography, spacing, and visual hierarchy
- Accessible navigation, posts, project cards, TOC, buttons, and icons
- Correct behavior under a GitHub Pages project `baseurl`
- No frontend JavaScript framework or Node-based **site build** step. Node tooling is present only for **QA/testing** (accessibility and end-to-end checks via pa11y-ci and Playwright + axe); the site itself is built by Jekyll. Do not treat the test toolchain as a site build step or penalize its presence.

## 3. Audit Scope

Evaluate the repository across these ten categories. The specific items to check for each are defined once in Section 8.

1. Build and deployment reliability
2. Jekyll architecture and content model
3. Configuration and front matter design
4. Liquid code quality and template structure
5. SCSS architecture and maintainability
6. Accessibility
7. Performance and SEO
8. Security, dependency hygiene, and supply chain
9. Legal and licensing risk
10. Documentation and customization guidance

## 4. Initial Repository Reconnaissance

Identify and summarize: repository name, purpose, template type, primary hosting target, main technologies, Jekyll/GitHub Pages gem version (if identifiable), Ruby/Bundler requirements (if documented), dependency manager, CI/CD system (if present), license (if present), demo link (if present), main customization points, and whether the project is a reusable template or a personal-site snapshot.

Run:

```bash
pwd
ls -la
find . -maxdepth 3 -type f | sort | sed 's#^\./##' | head -250
ruby --version || true
bundle --version || true
jekyll --version || true
node --version || true
npm --version || true
```

Inspect important files if present:

```bash
sed -n '1,240p' Gemfile 2>/dev/null || true
sed -n '1,280p' _config.yml 2>/dev/null || true
sed -n '1,260p' README.md 2>/dev/null || true
sed -n '1,220p' package.json 2>/dev/null || true
```

Map the project before reading deeply. Use `find`, `ls`, `grep`, `rg`, or `tree`, then read only representative files that support the audit. Relevant locations include `_layouts/`, `_includes/`, `_data/`, `_sass/`, `assets/`, `_posts/`, any custom collections, `index.*`, `projects.html`, `404.html`, `.github/workflows/`, `LICENSE`, `CHANGELOG.md`, `CONTRIBUTING.md`, `SECURITY.md`, and `structure.txt` if present.

## 5. Command Safety Rules

Run only safe read-only or low-risk commands. Do **not** run commands that deploy, publish, delete files, destructively clean generated files, modify lockfiles or source files, require secrets/credentials, run unreviewed remote scripts, or create commits/PRs.

Before running any `Makefile` target, npm script, Rake task, or custom script, inspect it first. If a command is unclear or risky, do not run it — record it as "not run" and explain why.

## 6. Build Verification

If safe and practical, run:

```bash
bundle install
bundle exec jekyll build
```

To verify project-page (subpath) deployment **without editing configuration**, use the non-destructive build flag rather than modifying `_config.yml`. The repository ships with `baseurl: "/eyvan"`, so test that real subpath:

```bash
bundle exec jekyll build --baseurl "/eyvan"
```

Also confirm behavior at the root (user/org site) with `--baseurl ""`. Compare builds and inspect `_site` for hardcoded root-relative links that break under a subpath. Run `bundle exec jekyll serve` only if useful; if the environment cannot interact with the served site, rely on the build output instead.

Optional checks, if available and safe:

```bash
bundle outdated
bundle audit
```

If `bundle audit` is unavailable, do not install it globally — skip it and state the limitation. If Node tooling is present, inspect `package.json` scripts before running any Node command, and only run scripts that are clearly safe.

### Accessibility and end-to-end test tooling

The repository ships with **pa11y-ci** and **Playwright + axe** for accessibility and end-to-end testing. Use them rather than defaulting to a static-only accessibility review.

First inspect `package.json` and any test config (`.pa11yci`, `pa11yci.json`, `playwright.config.*`, the `tests/`/`e2e/` directory) to learn the configured commands, then prefer the project's own scripts:

```bash
sed -n '1,200p' package.json 2>/dev/null || true
cat .pa11yci pa11yci.json 2>/dev/null || true
ls -la playwright.config.* tests e2e 2>/dev/null || true
# then run the project's configured scripts, for example:
npm ci
npm run test:a11y    # or the project's pa11y-ci script
npm run test:e2e     # or the project's Playwright + axe script
```

Notes and guardrails:

- pa11y-ci and Playwright typically run against the **built** site or a locally served build, so build first (Section 6) before running them.
- Playwright may require a one-time browser download (`npx playwright install`). Treat that as a download step under the command-safety rules: note it, and only perform it if the environment clearly expects it.
- **Lighthouse CI (`@lhci/cli`) was intentionally removed** because it introduced npm-audit vulnerabilities and an unsafe dependency-downgrade path. **Do not reinstall, reintroduce, or run Lighthouse CI, PageSpeed, or any replacement performance tool**, and do not flag its absence as a deficiency. Performance is assessed statically from build output (Section 8.7).
- Apply the one-retry and timeout rules from Section 7 to all test commands. Record which tools ran, which did not, and why.

## 7. Bailout and Timeout Rules

If `bundle install`, `jekyll build`, a lint command, or an audit command fails, retry at most **once** and only for an obvious environment issue (such as using a documented Ruby version).

If it fails again, stop retrying and record: the command, the failure, and whether it appears to be a repository issue, environment issue, missing dependency, unclear-documentation issue, or unknown.

If a command hangs or runs unusually long, stop it, record it as timed out, and move on.

## 8. Review Requirements by Category

This is the single source of truth for what to evaluate. Each subsection maps directly to a scoring category in Section 9 and a report subsection in Section 12. Flag misplaced or fragile patterns only when they create real maintainability, accessibility, or compatibility risk.

### 8.1 Build and Deployment Reliability

- Result of `bundle install` and `bundle exec jekyll build`; warnings and errors.
- GitHub Pages compatibility and gem/version constraints.
- **`baseurl` behavior** at both `/` (user/org site) and the shipped subpath `/eyvan/` (project site), using the build flag from Section 6.
- Correct use of `relative_url`, `absolute_url`, `site.url`, and `site.baseurl`; flag hardcoded root-relative links that break project-page deployment.
- Workflow/deployment reliability in `.github/workflows/`. **The GitHub Actions build path is expected and required** (because `jekyll/tagging` is not supported by the native GitHub Pages builder) — do not flag the presence of the Actions workflow as a deviation; evaluate its correctness instead.

### 8.2 Jekyll Architecture and Content Model

- Layouts and includes structure; whether includes are focused, reusable, and documented. Review representative files, especially: `_layouts/default.html`, `homepage.html`, `page.html`, `post.html`; `_includes/head.html`, `header.html`, `footer.html`, `navigation.html`, `hero.html`, `post-card.html`, `post-toc-mobile.html`, `post-toc-desktop.html`, `toc.html`, `post-share.html`, `read-time.html`, `math.html`, `video.html`, and any figure/table/audio/image includes.
- `_data` usage and the **posts-as-projects content model**: Eyvan uses posts as project/writing entries unless a separate collection exists. Flag confusion if the template calls entries "projects" but relies on `_posts` without explaining that design.
- Homepage project preview, projects archive, post cards, tags and tag-archive behavior, related posts, post navigation.
- **Post experience** as a long-form writing/project-detail page: title/subtitle, cover image, image alt fallback, metadata, share controls, mobile and desktop TOC, content width, heading hierarchy, keyboard/scroll behavior, back-to-top (if present).
- **Figures, media, and cross-references**: images, GIFs, videos, audio, tables, captions, numbering, cross-references, responsive aspect ratios, missing-media handling, lazy loading, accessible labels. Flag cases where users won't know which include to use.
- **Intended behaviors — evaluate as designed, do not flag as defects**: reading time is global (set via `read_time` and `words_per_minute` in `_config.yml`), not a per-post front-matter override; cross-reference links degrade to plain anchors and only render numbered labels (e.g., "Figure 1") when `crossrefs: true`; MathJax loads only when `math: true`. Assess whether these are documented and behave as described, not whether they "should" be per-post.

### 8.3 Configuration and Front Matter Design

- `_config.yml` quality, defaults, and permalink strategy.
- SEO/social fields and required vs. optional front matter.
- Safety of optional front matter (graceful handling when fields are absent).

### 8.4 Liquid Code Quality and Template Structure

- Readability and maintainability of Liquid.
- Missing-field handling, duplication, include parameterization, and hardcoding.

### 8.5 SCSS Architecture and Maintainability

- **ITCSS layering**: There are file subdirectories within the `_sass` directory: `0-settings`, `1-tools`, `2-generic`, `3-base`, `4-objects`, `5-components`, `6-layouts`, `7-trumps`. Each subdirectory contains multiple Sass files. Verify responsibilities are correctly separated: settings = tokens only; tools = mixins/functions only; generic = resets/normalization; base = element defaults; objects = layout abstractions; components = styled UI; layouts = page-level composition; trumps = utilities/overrides.
- **BEM and naming**: prefixes `o-` (objects), `c-` (components), `l-` (layouts), `u-` (utilities), `is-` (state). Check consistency and readability. Flag excessive nesting, fragile selectors, unnecessary IDs, excessive `!important`, inconsistent component names, layout rules leaking into components, and components depending unnecessarily on page-specific contexts.
- Design tokens, responsive behavior, and customization safety.

### 8.6 Accessibility

Run the project's accessibility tooling — **pa11y-ci** and **Playwright + axe** (see Section 6) — and report the results. Fall back to a static review only for checks the tools cannot cover, or if the tools cannot run (state which case applies). Either way, check: semantic landmarks; skip link (if present); keyboard navigation; visible focus states; mobile menu and theme-toggle accessibility; TOC and share-button accessibility; icon-only button labels; `aria-expanded`, `aria-controls`, `aria-current`; decorative SVG handling; heading hierarchy; image alt strategy; color contrast; reduced-motion support.

### 8.7 Performance and SEO

Evaluate built output statically; do not invent Lighthouse, PageSpeed, or WebPageTest scores, and do not install or reintroduce any performance tool — Lighthouse CI was deliberately removed for supply-chain reasons (Section 6), and its absence is not a deficiency. Check: CSS/JS size; image sizes and `width`/`height` attributes where practical; lazy loading; font loading; external requests and layout-shift risks; unused CSS/JS risk; SEO metadata, page descriptions, canonical URLs, Open Graph and Twitter card metadata, sitemap/feed support, and readable URLs.

- **Math and syntax highlighting**: confirm math rendering is opt-in and not loaded globally; check syntax highlighting for Ruby, Liquid, HTML, SCSS, CSS, JavaScript, YAML, Bash, and Python; confirm code blocks are readable in light and dark themes.
- **External requests**: classify mandatory third-party requests (fonts, icons, scripts, analytics, embeds, MathJax, comments, forms, tracking) by purpose, whether optional, and impact on privacy, performance, licensing, or offline durability. Do not treat every external request as inherently bad.

### 8.8 Security, Dependencies, and Supply Chain

Check: Ruby gem vulnerabilities (if `bundle audit` can run); outdated dependencies (if `bundle outdated` can run); **Node dev-dependency vulnerabilities** via `npm audit` against the QA tooling (pa11y-ci, Playwright, axe); Dependabot/Renovate config; minified or obfuscated JavaScript; third-party scripts, analytics, embeds, and forms; possible secrets; GitHub Actions permissions and unsafe workflow triggers; remote-theme dependencies.

Treat the deliberate **removal of `@lhci/cli`** (due to npm-audit vulnerabilities and an unsafe downgrade path) as a positive supply-chain hygiene signal, not a gap. If `npm audit` surfaces issues, distinguish those in the **site's runtime output** from those confined to **dev-only QA tooling**, and report severity accordingly.

If `gitleaks` is available, you may run:

```bash
gitleaks detect --source .
```

Do not expose secret values — report only the file path and that a possible secret exists.

### 8.9 Legal and Licensing

Check the repository license and its compatibility for reuse/modification; licensing of assets, demo images, fonts, icons, and third-party scripts/libraries; attribution requirements; and whether example content and screenshots are covered. Do not provide legal advice — present this as technical/legal-risk screening.

### 8.10 Documentation and Customization Guidance

Documentation matters because the target user may be a beginner. Check whether the README/docs explain: what Eyvan is and who it's for; installation; local development; GitHub Pages deployment; project `baseurl` setup; custom-domain setup (if relevant); how to customize identity, navigation, colors/typography; how to replace logo/favicons/social images; and how to add posts/projects, use tags, enable TOC, enable math, and add figures/tables/videos. Note which files are safe to edit, which are core template internals, and any known limitations.

- **Customization path**: identify the safest files a beginner edits first, and confirm common changes flow through `_config.yml`, `_data/*.yml` (`author.yml`, `hero.yml`, `navigation.yml`, `social-links.yml`, `share.yml`, `footer.yml`), SCSS design tokens, and clearly named asset folders — so a user can change name, role, location, navigation, social links, CV link, logo, favicon, default social image, hero content, colors, typography, spacing, and posts/projects without editing many unrelated layouts/includes.
- **Favicon, logo, and social assets**: confirm handling is centralized and easy to replace. Verify references to `/favicon.ico`, `/assets/favicon/favicon-16x16.png`, `/assets/favicon/favicon-32x32.png`, `/assets/favicon/apple-touch-icon.png`, `/assets/favicon/site.webmanifest`, the default Open Graph image, and the logo/brand image — and that changing them requires editing only obvious files.

## 9. Scoring

Use this weighted scorecard. **Score each category as points earned out of its weight** (e.g., 17 out of 20). The total is the sum of earned points out of 120.

| Category                                   | Weight |
| ------------------------------------------ | -----: |
| Build and deployment reliability           |     20 |
| Jekyll architecture and content model      |     20 |
| Configuration and front matter design      |     10 |
| Liquid code quality and template structure |     10 |
| SCSS architecture and maintainability      |     10 |
| Accessibility                              |     15 |
| Performance and SEO                        |     10 |
| Security, dependencies, and supply chain   |     10 |
| Legal and licensing risk                   |      5 |
| Documentation and customization guidance   |     10 |
| **Total**                                  |    120 |

**Report the final result as a percentage of points earned: percentage = (total earned ÷ 120) × 100.**

Interpretation:

- 90–100%: Excellent; low adoption risk
- 75–89%: Strong; acceptable with minor improvements
- 60–74%: Moderate; usable but needs caution/refactoring
- 40–59%: Weak; significant adoption or maintenance risk
- 0–39%: High risk; avoid unless there is a strong reason

A single critical issue — a broken build, missing license, unsafe dependency, or broken deployment path — can outweigh a high numeric score.

Do not lower a category score for a capability that is **intentionally and documentedly** out of scope (e.g., no search, posts-as-projects model, global read time). Record those as future enhancements in report Section 9, not as scored deficiencies.

## 10. Severity Levels

- **Critical**: prevents build, deployment, legal reuse, secure operation, or safe adoption
- **High**: major maintainability, accessibility, compatibility, security, or performance risk
- **Medium**: important quality gap that should be addressed before serious use
- **Low**: minor improvement or best-practice gap
- **Informational**: useful context only

## 11. Output Location

Write the final audit report as a **new Markdown file in the repository root**, named `AUDIT_REPORT.md`. This is the only file you may create; do not modify any existing file. Format the report exactly as specified in Section 12.

## 12. Required Final Report Format

````markdown
# Eyvan Jekyll Template Audit Report

## 1. Executive Summary

- What Eyvan does
- Overall score as a percentage out of 100
- Overall risk rating
- Recommendation (one of): Adopt as-is · Adopt with minor improvements · Adopt with refactoring · Do not release/adopt yet · Reject or avoid · Not enough information
- Top 3 strengths
- Top 3 risks

## 2. Repository Context

Repository name; template/project type; main technologies; Jekyll/Ruby/Bundler versions (if available); dependency manager; CI/CD system; hosting/deployment target; documentation quality; license; demo site (if available); date of audit.

## 3. Scorecard

| Category                                   | Score | Weight | Notes |
| ------------------------------------------ | ----: | -----: | ----- |
| Build and deployment reliability           |     X |     20 | ...   |
| Jekyll architecture and content model      |     X |     20 | ...   |
| Configuration and front matter design      |     X |     10 | ...   |
| Liquid code quality and structure          |     X |     10 | ...   |
| SCSS architecture and maintainability      |     X |     10 | ...   |
| Accessibility                              |     X |     15 | ...   |
| Performance and SEO                        |     X |     10 | ...   |
| Security, dependencies, and supply chain   |     X |     10 | ...   |
| Legal and licensing risk                   |     X |      5 | ...   |
| Documentation and customization guidance   |     X |     10 | ...   |
| **Total**                                  |     X |    120 | X%    |

(Score = points earned out of the category weight; X% = total ÷ 120 × 100.)

## 4. Key Findings by Severity

Group under **Critical**, **High**, **Medium**, **Low**, **Informational**. For each finding include: Finding · Evidence · Impact · Recommendation.

## 5. Detailed Category Review

One subsection per scope category, discussing results and evidence against the corresponding checklist in Section 8. Do not re-list the checklist items — report what you found.

- 5.1 Build and Deployment Reliability (incl. `baseurl` behavior at `/` and at a subpath)
- 5.2 Jekyll Architecture and Content Model
- 5.3 Configuration and Front Matter Design
- 5.4 Liquid Code Quality and Template Structure
- 5.5 SCSS Architecture and Maintainability
- 5.6 Accessibility
- 5.7 Performance and SEO
- 5.8 Security, Dependencies, and Supply Chain
- 5.9 Legal and Licensing
- 5.10 Documentation and Customization Guidance

## 6. Commands Run

List every command. For each:

```bash
COMMAND
```

Result: pass/fail/not run
Notes: brief explanation

Include commands intentionally not run, and why.

## 7. Adoption or Release Recommendation

Choose one (Adopt as-is · Adopt with minor improvements · Adopt with refactoring · Do not release/adopt yet · Reject or avoid · Not enough information) and explain why.

## 8. Prioritized Remediation Plan

| Priority | Recommendation | Severity | Effort | Expected Benefit |
| -------: | -------------- | -------- | ------ | ---------------- |
|        1 | ...            | High     | Medium | ...              |

Prioritize fixes affecting, in order: build/deployment, legal reuse, accessibility, broken user-facing behavior, customization clarity, maintainability, performance/SEO polish.

## 9. Optional Enhancements and Future Development

Separate from remediation, propose forward-looking improvements and net-new features that would extend Eyvan without contradicting its minimalist, content-first intent. These are suggestions only.

**These must not be counted against the score.** Eyvan intentionally omits some capabilities; do not treat a documented, deliberate omission (e.g., no search, posts-as-projects rather than a separate collection, global rather than per-post read time) as a defect. List enhancements here, not as findings in Section 4.

Candidate areas to consider (include only those that fit the template's goals):

- A dedicated `projects` collection separate from `_posts`, if the posts-as-projects model becomes limiting.
- A per-post read-time override in addition to the global setting.
- Optional client-side search.
- Any other additions surfaced by the README's Limitations section or the design documentation.

For each suggested enhancement include: idea, rationale/benefit, rough effort, and any risk to simplicity or maintainability.

## 10. Limitations of This Audit

State what could not be verified (e.g., no internet access, GitHub settings not visible, external metrics unverifiable, could not install dependencies, could not run build, no accessibility/Lighthouse tooling, no browser testing, no security tooling, license compatibility requires legal review).

## 11. Final Notes

Concise summary of whether Eyvan is structurally sound, whether it is ready for public reuse, what must be fixed before release, and what can be improved later.
````

**Final instruction:** produce a professional, concise, evidence-based Markdown report at `AUDIT_REPORT.md`. Do not modify or fix the repository. Audit, verify, score, and recommend.
