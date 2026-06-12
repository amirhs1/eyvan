# Remaining Audit Items

**Report date:** 2026-06-12
**Comparison baseline:** `origin/develop` at `8e0685ec45dd7703de633841231debbdcf96b544`
**Oldest audit date:** 2026-06-07
**PR comparison window:** PRs merged into `develop` from 2026-06-07 through PR #104

## Scope and Method

This report reconciles every Markdown audit, audit handoff, remediation plan,
and color-architecture report currently under `notes/` against:

- PRs merged into `develop` since the oldest audit date;
- the current files on `origin/develop`;
- recommendations explicitly marked optional, deferred, or decision-dependent.

A document is listed as safe to remove only when every actionable issue or
recommendation it raised has been addressed. A newer report superseding an
older report is not, by itself, enough to classify the older file as complete.

The comparison excludes PR #105 because it merged `develop` into `main`; it did
not add a change to `develop`.

## Audit Files in Generation Order

The order below uses the local file creation timestamp, which is more precise
than filename dates. The declared audit date is shown separately where it
differs.

| Order | File | Local creation time | Declared/file date | Disposition |
| ---: | --- | --- | --- | --- |
| 1 | `A11-AUDIT-20260607.md` | 2026-06-07 23:16 EDT | 2026-06-07 | Safe to remove |
| 2 | `AUDIT_REPORT-20260607.md` | 2026-06-07 23:49 EDT | 2026-06-07 | Retain: responsive-image work remains |
| 3 | `color-system-a11y-report-20260608.md` | 2026-06-10 12:07 EDT | 2026-06-08 | Retain: palette/elevation/persona work remains |
| 4 | `Option-3-Color-System-Modernization-20260610.md` | 2026-06-10 14:18 EDT | 2026-06-10 | Retain: most modernization work remains |
| 5 | `Color_System_Audit-20260610.md` | 2026-06-10 21:36 EDT | 2026-06-10 | Retain: it explicitly hands off Option 3 work |
| 6 | `AUDIT_REPORT-20260611.md` | 2026-06-10 22:34 EDT | 2026-06-11 | Retain: syntax contrast and runtime supply chain remain |
| 7 | `Web_Color_Architecture_Report.md` | 2026-06-11 10:13 EDT | Undated 2026 reference | Reference, not an Eyvan audit |
| 8 | `color-issues-20260611.md` | 2026-06-11 11:34 EDT | 2026-06-11 | Retain: several listed items remain |
| 9 | `Non-Color Audit Remediation Plan-20260611.md` | 2026-06-11 11:49 EDT | 2026-06-11 | Retain: PR 1 remains; PR 8 is monitored/deferred |

## 1. Audit Files Safe to Remove

### `notes/A11-AUDIT-20260607.md`

All six findings are addressed:

| Audit item | Resolution |
| --- | --- |
| Light syntax strings, numbers, and comments fail contrast | PR #38 remapped light `base0b`, `base09`, and `base03` to compliant darker values and expanded code-heavy coverage. |
| Horizontally scrollable code blocks are not keyboard reachable | PR #35 added `code-block-a11y.js`. |
| Desktop TOC uses a redundant nested `aside` landmark | PR #35 changed the outer wrapper to a non-landmark element. |
| GFM task-list checkboxes have no accessible names | PR #35 added `task-list-a11y.js`. |
| New-tab links do not announce the new browsing context | PR #35 updated the relevant labels. |
| Share-copy feedback uses blocking `alert()` | PR #35 replaced it with non-blocking live-region feedback. |

PR #101 later made the code-block, task-list, share, and mobile-TOC scripts
conditional without undoing those accessibility fixes.

## Files Not Yet Safe to Remove

### `notes/AUDIT_REPORT-20260607.md`

Nearly all findings and remediation items are closed by PRs #35, #38, #88,
#97, #98, #100, #103, and #104. Keep it because Section 9, "Optional
Enhancements," still recommends responsive `srcset`/`sizes` support. Intrinsic
figure and cover dimensions were added, and the oversized cover was replaced,
but responsive image variants have not been implemented.

### `notes/color-system-a11y-report-20260608.md`

Keep it for Section 7 deferred items 3, 4, 6, 8, and 9: gray-ramp rebuilding,
formal elevation tokens, success-color policy, Art persona policy, and the
`plum` naming cleanup.

### `notes/Option-3-Color-System-Modernization-20260610.md`

Keep it as the detailed design proposal for the still-deferred palette, hue
ramp, elevation, status-color, Art persona, and naming work. PR #102 completed
the three-tier token contract but explicitly deferred this phase-two palette
work.

### `notes/Color_System_Audit-20260610.md`

PR #102 addressed Findings F1-F6: undefined properties, hover shadows, print
literals, dead configuration, fixture vocabulary, and inaccurate documentation.
The file is not fully complete because Section 9 explicitly recommends resuming
the Option 3 ramp/elevation work. F7 and F8 also remain useful context for
unused-token and Art-persona decisions.

### `notes/AUDIT_REPORT-20260611.md`

PRs #95-#104 addressed H1, M1-M5, L1, L2, L4, release checks, and secret
scanning. Keep it because H2 (light syntax operators), H3 (mutable runtime
JavaScript), L3 (deprecated QA transitives), and the responsive-image optional
enhancement remain open or deferred.

### `notes/Web_Color_Architecture_Report.md`

This is general web-color research rather than an evidence-based Eyvan audit.
It should not be used as a mandatory backlog: OKLCH conversion, DTCG
`.token.json` files, and a prescribed 35-45-token primitive palette are not
required for this Jekyll-only template. It may be removed as a redundant
research note if no longer useful, but it is not included in the
"addressed-complete" removal list above.

### `notes/color-issues-20260611.md`

PR #102 closed the undefined properties, shadow fallback, print literals, dead
flags, invalid documentation names, and fixture drift. Keep the file because
operator contrast, deterministic contrast coverage, gray/elevation
modernization, Art persona policy, naming/headroom cleanup, and tooling guards
remain.

### `notes/Non-Color Audit Remediation Plan-20260611.md`

PRs #95-#104 completed plan items 2-7, 9, and 10. Keep it because:

- PR 1, vendoring runtime dependencies, has not been implemented.
- PR 8, refreshing QA dependencies, remains deferred until upstream packages
  provide a supported upgrade path that removes the deprecated transitives.

## 2. Remaining Changes

The items below are consolidated so the same finding is not counted repeatedly
when several audits describe it.

### R1. Fix light-theme syntax operator contrast and add a deterministic CI guard

**Priority:** High
**Type:** Accessibility defect and regression prevention

`_sass/0-settings/_colors-science-light.scss` still maps `base0c` to
`$clr-p-azure` (`#74BBFB`) against the light syntax background `#F5F7FA`.
The reported contrast is approximately 1.91:1. The current Playwright tests
visit code-heavy pages in both themes, but the audits established that axe can
miss punctuation-only operator tokens.

Required work:

1. Assign light `base0c` a token that reaches at least 4.5:1 against light
   `base00`.
2. Audit every light and dark Base16 foreground/background pair, including the
   disabled Art persona if it remains in the repository.
3. Add a deterministic token-contrast test or run the HTML-only sitemap Pa11y
   crawl in CI. Do not rely solely on axe for punctuation tokens.

Related audit sections:

- `AUDIT_REPORT-20260611.md` - Section 4, H2; Section 8, item 2.
- `color-issues-20260611.md` - "Light syntax operators still fail contrast"
  and "Contrast CI coverage remains incomplete."
- `Non-Color Audit Remediation Plan-20260611.md` - PR 9 acceptance criteria
  mention Pa11y/sitemap checks, although PR #103 did not add the sitemap Pa11y
  command to CI.

### R2. Remove mutable third-party runtime JavaScript

**Priority:** High
**Type:** Supply-chain, privacy, reliability, and self-containment

`assets/js/demo-climate-charts.js` still dynamically executes the unversioned
URL `https://cdn.jsdelivr.net/npm/chart.js`. `_includes/math.html` still loads
MathJax from a mutable major-version CDN URL. This conflicts with the
repository's self-hosted asset policy.

Required work:

1. Vendor an exact reviewed Chart.js distribution and its license under
   `assets/vendor/`, then load it with `relative_url`.
2. Vendor the exact MathJax runtime subset used by current content, including
   required fonts/extensions and its license, while preserving `math: true`
   opt-in behavior.
3. Document versions, sources, checksums, and the update process.
4. Verify the climate charts, ordinary math, and Braket notation under
   `baseurl: "/eyvan"` and a root-baseurl build.
5. Confirm rendered pages make no remote runtime-code requests.

Related audit sections:

- `AUDIT_REPORT-20260611.md` - Section 4, H3; Section 8, item 3.
- `Non-Color Audit Remediation Plan-20260611.md` - PR 1, "Vendor Runtime
  Dependencies," including its files, sequence, and acceptance criteria.

### R3. Add responsive variants for in-content images

**Priority:** Medium/optional
**Type:** Performance enhancement

PRs #38 and #98 added intrinsic dimensions and replaced the animated quantum
cover with a small static cover. The original animation correctly remains
inside the article. The figure system still emits only `src`, without
`srcset`/`sizes`, so large in-article images cannot select a viewport-appropriate
resource.

Required work if this recommendation is accepted:

1. Define a no-bundler workflow for generating a small, documented set of WebP
   variants.
2. Extend `figure.html` and relevant poster/cover handling with optional
   baseurl-safe `srcset` and `sizes`.
3. Keep width/height metadata and existing lazy/eager loading behavior.
4. Document authoring and fallback behavior.

Related audit sections:

- `AUDIT_REPORT-20260607.md` - Section 4, Finding 7; Section 9,
  "Responsive images."
- `AUDIT_REPORT-20260611.md` - Section 9, "Add responsive image variants for
  unusually large visual assets."

### R4. Rebuild the primitive gray and hue ramps

**Priority:** Medium, planned enhancement
**Type:** Color-system maintainability

The current gray sequence remains incomplete and non-monotonic:
`gray-400 #5C6473` is darker than `gray-500 #888891`, and the ramp mixes
neutral, blue, violet, and teal tendencies. Chromatic variants still use
ad-hoc names such as `-light`, `-dark`, `-deep`, and `-deeper`.

Required work:

1. Design a monotonic, hue-coherent neutral ramp with documented roles.
2. Organize chromatic primitives into consistent hue ramps.
3. Mechanically remap all four persona/mode semantic maps.
4. Re-run every text, UI-control, focus, and syntax contrast pair before
   merging.

Important correction:

The sample ramp in `Option-3-Color-System-Modernization-20260610.md` must not
be copied mechanically. It proposes `gray-400: #C0C0CC`, while the current
Science light map uses `gray-400` for muted text. That sample value would be
far too light on white/off-white and would likely reintroduce an accessibility
failure. Design the ramp and semantic mappings together rather than preserving
the current numeric references blindly.

Related audit sections:

- `color-system-a11y-report-20260608.md` - Section 4a, item 4; Section 7,
  items 3 and 6.
- `Option-3-Color-System-Modernization-20260610.md` - Problem Statement
  items 1-2; Detailed Changes 1-2.
- `Color_System_Audit-20260610.md` - Section 9, item 6.
- `color-issues-20260611.md` - "Gray ramp modernization remains deferred."

### R5. Formalize the elevation token model

**Priority:** Medium, planned enhancement
**Type:** Color-system architecture

Core surface tokens exist, but several components still define their own
`color-mix()` backdrop or shadow recipes. The Option 3 plan proposes an
explicit base/raised/overlay ladder.

Required work:

1. Define the intended surface levels and their light/dark luminance behavior.
2. Add a semantic overlay/elevation token only if it replaces meaningful
   repeated component logic.
3. Replace compatible component-local recipes in the mobile menu, TOC, site
   header, and post navigation.
4. Verify contrast, transparency fallback, reduced-transparency behavior where
   relevant, and both themes.

Related audit sections:

- `color-system-a11y-report-20260608.md` - Section 7, item 4.
- `Option-3-Color-System-Modernization-20260610.md` - Problem Statement
  item 3; Detailed Changes 3.
- `color-issues-20260611.md` - gray/elevation modernization bullet.

### R6. Decide and document the Art persona lifecycle

**Priority:** Medium decision
**Type:** Architecture and maintenance policy

The Art maps are disabled but retained. PR #102 aligned them with the 33-token
contract, but their values are explicitly marked as pending a phase-two
accessibility pass. For example, Art light still maps several syntax roles to
the original low-contrast primitives.

Choose one:

- Retire the Art persona and remove the unreachable maps and commented imports.
- Keep it disabled but document it as unsupported experimental code.
- Maintain it fully by applying the palette modernization and complete
  light/dark contrast tests before allowing activation.

Related audit sections:

- `color-system-a11y-report-20260608.md` - Section 7, item 8.
- `Option-3-Color-System-Modernization-20260610.md` - Detailed Changes 5.
- `Color_System_Audit-20260610.md` - F8.
- `color-issues-20260611.md` - "Decision outstanding: Art persona."

### R7. Resolve optional token naming and headroom decisions

**Priority:** Low/optional
**Type:** Maintainability cleanup

The audits leave three small policy questions:

1. Rename `$clr-p-plum` because `#701C1C` is oxblood/maroon, not plum.
2. Decide whether `state-success` should remain distinct from the teal brand
   family or be mapped to a brand-ramp step.
3. Document whether unused state, Base16, and pink tokens are intentional
   extension points; remove only tokens confirmed to have no planned role.

Do not collapse status and brand colors merely to reduce token count. Status
meaning and accessible differentiation take priority over palette neatness.

Related audit sections:

- `color-system-a11y-report-20260608.md` - Section 7, items 6 and 9.
- `Option-3-Color-System-Modernization-20260610.md` - Detailed Changes 4
  and 6.
- `Color_System_Audit-20260610.md` - F7.
- `color-issues-20260611.md` - optional cleanup bullet.

### R8. Add static guards for token-contract drift and browser theme colors

**Priority:** Medium
**Type:** Regression prevention

PR #102 fixed the existing undefined-property drift, but no checked-in test
currently compares all consumed `var(--color-*)` names with emitted
definitions. The theme color is also represented in Sass, head metadata, and
JavaScript fallbacks, which can drift.

Required work:

1. Add a repository-native static check that fails when a consumed color custom
   property has no definition or approved fallback.
2. Add a guard for synchronized light/dark browser `theme-color` values, or
   reduce the number of manually synchronized definitions.
3. Run the checks in the existing release test job without adding a frontend
   build system.

Related audit sections:

- `AUDIT_REPORT-20260611.md` - H1 recommendation and Section 9 optional
  custom-property linter.
- `color-issues-20260611.md` - tooling recommendation.
- `Color_System_Audit-20260610.md` - F1/F2 root cause and compliance verdict.

### R9. Monitor deprecated QA transitive dependencies

**Priority:** Low, currently blocked upstream
**Type:** Dependency hygiene

`package-lock.json` still contains deprecated `glob@7`, `inflight`, and
`whatwg-encoding`. The PR #103 dependency review found that direct packages
were current, `npm audit` reported no vulnerabilities, and the deprecated
packages remained in the latest Pa11y dependency tree.

Required handling:

1. Continue Dependabot updates.
2. Re-check supported direct dependency releases periodically.
3. Remove the transitives when upstream updates make that possible.
4. Do not replace or weaken Pa11y/axe coverage solely to silence deprecation
   warnings.

No immediate code change is justified while the supported direct dependencies
remain current.

Related audit sections:

- `AUDIT_REPORT-20260611.md` - L3.
- `Non-Color Audit Remediation Plan-20260611.md` - PR 8.

## Recommendations That Do Not Require Current Changes

The following statements from `Web_Color_Architecture_Report.md` are useful
research context but are not mandatory Eyvan changes:

- Migrating all primitives to OKLCH.
- Adding DTCG `.token.json` files.
- Expanding to a prescribed 35-45 primitive-token minimum.
- Implementing APCA as a production conformance gate before WCAG 3 is stable.

Eyvan is a Jekyll-only web template with Sass as its existing token source of
truth. These changes should be considered only if there is a concrete need for
design-tool/native-app interoperability or a measured problem that the current
Sass architecture cannot solve.

## Closed Work by PR

| PR | Audit work closed |
| --- | --- |
| [#35](https://github.com/amirhs1/eyvan/pull/35) | Code-block keyboard access, task-list names, TOC landmark, new-tab labels, live-region share feedback |
| [#38](https://github.com/amirhs1/eyvan/pull/38) | Original light syntax contrast findings, figure dimensions, Dependabot, Ruby version, project docs |
| [#88](https://github.com/amirhs1/eyvan/pull/88) | Teal brand unification and synchronized theme-color updates |
| [#94](https://github.com/amirhs1/eyvan/pull/94) | Restored configurable logo behavior |
| [#95](https://github.com/amirhs1/eyvan/pull/95) | Mobile overlay dialog semantics and background isolation |
| [#96](https://github.com/amirhs1/eyvan/pull/96) | Job-scoped Pages permissions and immutable Action SHAs |
| [#97](https://github.com/amirhs1/eyvan/pull/97) | Bundled self-hosted font licenses |
| [#98](https://github.com/amirhs1/eyvan/pull/98) | Static quantum cover, cover dimensions, eager post cover |
| [#100](https://github.com/amirhs1/eyvan/pull/100) | Logo documentation, sitemap PDF exclusion, generated-output cleanup |
| [#101](https://github.com/amirhs1/eyvan/pull/101) | Conditional feature-script loading |
| [#102](https://github.com/amirhs1/eyvan/pull/102) | Three-tier token contract, undefined properties, print tokens, dead flags, fixtures, docs |
| [#103](https://github.com/amirhs1/eyvan/pull/103) | Release checks, site-integrity crawl, placeholder warnings, manual accessibility/release guidance |
| [#104](https://github.com/amirhs1/eyvan/pull/104) | Automated full-history Gitleaks scanning |

## Recommended Delivery Order

1. R1 - syntax operator contrast and deterministic test.
2. R2 - vendor runtime dependencies.
3. R8 - token and theme-color regression guards.
4. R4 and R5 - palette and elevation modernization in one focused color PR.
5. R6 and R7 - settle persona and token policy as part of that color PR or a
   preceding decision document.
6. R3 - responsive image variants when performance work is prioritized.
7. R9 - dependency refresh when upstream support makes it actionable.

After R1-R9 are resolved or explicitly declined and documented, the remaining
audit files can be re-evaluated for removal as a group.
