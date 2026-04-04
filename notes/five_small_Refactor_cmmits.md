Goal: bring the site from “already strong” to “tight, production-grade, and easier to maintain” in **5 small refactor commits**, without changing the overall Jekyll-first architecture.

Brief overview: your current structure is already solid. The best next move is not a rewrite. It is a **boundary-tightening pass**: make layout spacing more systematic, reduce container duplication, standardize page headers, improve accessibility at the shell level, and clean up the post/page composition rules. That fits the current architecture shown in `default.html`, `page.html`, `post.html`, `homepage.html`, `projects.html`, `tag-page.html`, and `section-heading.html`.       

## Refactor plan: 5 commits max

### Commit 1 — Normalize shell spacing and ownership

### Commit 2 — Standardize page-header composition with `section-heading`

### Commit 3 — Tighten container policy

### Commit 4 — Shell accessibility pass

**Goal:** improve site-wide accessibility.

**Files to touch**

* `_layouts/default.html`
* `_includes/header.html`
* `7-trumps/_a11y.scss`
* Possibly `5-components/_navigation.scss`
* Possibly test files for header/navigation

**What to do**

1. Add a visible-on-focus **skip link** before the header:

   * points to `#main-content`
2. Keep `main` id as-is, since it already exists in `default.html`. 
3. Check header/menu toggle labels remain synchronized between visible state and screen-reader text. `header.html` already has good foundations with `aria-expanded`, `aria-controls`, and hidden text. 
4. Verify no heading-level jumps are introduced when `section-heading` is reused across page types.

**Why this is high value**
This is small but meaningful. Your semantic structure is already strong, so the skip link is the cleanest missing shell-level improvement.

**Definition of done**

* Keyboard users can jump past header
* No visual regressions
* Accessibility improvement is site-wide, not page-by-page

---

### Commit 5 — Simplify post/page composition boundaries

**Goal:** make long-form templates easier to evolve.

**Files to touch**

* `_layouts/post.html`
* `_layouts/page.html`
* `_includes/post-share.html`
* `_includes/post-navigation.html`
* `_includes/related-posts.html`
* Possibly create:

  * `_includes/post-header.html`
  * `_includes/page-header.html`

**What to do**

1. Split the monolithic top section of `post.html` into a dedicated include, likely `post-header.html`.
2. Keep:

   * share logic in `post-share.html`
   * adjacent post navigation in `post-navigation.html`
   * related grid in `related-posts.html`
     which you already do well.   
3. For `page.html`, consider a parallel `page-header.html` only if it stays thin.
4. Do **not** split too far. The point is clarity, not micro-includes.

**Why this helps**
`post.html` is structurally correct, but it is your densest layout. Pulling the header block into its own include will make future changes to metadata, tags, subtitle, and share composition safer. 

**Definition of done**

* `post.html` becomes easier to scan
* Header composition is isolated
* Future experiments with post hero / meta / share do not require editing the whole layout

---

## Recommended order of execution

Do them in this exact order:

1. **Shell spacing**
2. **Section-heading standardization**
3. **Container policy**
4. **Accessibility shell pass**
5. **Post/page composition split**

That order minimizes churn. It starts with layout rules, then consolidates reusable page structure, then trims wrappers, then improves UX, then cleans the densest template.

---

## What I would not change right now

I would leave these alone for now:

* `head.html` — it is already strong and centralized, including tag-title handling and theme initialization.  
* `post-card.html` — it has excellent ownership boundaries already. 
* `footer.html` — clean enough; not a priority refactor. 
* Overall directory shape — the repository structure is already coherent and broad enough for a real theme system.

---

## Expected outcome after these 5 commits

You would have:

* a single clear vertical rhythm system
* one consistent top-of-page heading pattern
* cleaner containment rules
* better keyboard accessibility
* thinner, easier-to-maintain long-form layouts

That gets you from “strong architecture” to “very polished architecture” without overengineering.

I can turn this into a **file-by-file implementation plan with exact edits** for Commit 1 next.
