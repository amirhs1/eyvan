# Sass Learning Map + Template Design & Review Plan (iwanjekyll)

This document is based on the current repository structure  
(`_sass/`, `_includes/`, `_layouts/`, `assets/`, `_posts/`, etc.).

It serves two purposes:
- A **learning map** for Sass within this specific theme
- A **design + UX review checklist** that preserves maintainability

---

## Sass Learning Map (Diagram)

> If your Markdown renderer supports Mermaid, the diagram below will render visually.  
> If not, use the “Readable checklist” section that follows.

```mermaid
flowchart TD
  A["assets/css/main.scss (entry point)"] --> B["0-settings (tokens)"]
  B --> B1["_colors.scss (palette, semantic colors)"]
  B --> B2["_global.scss (type scale, spacing, globals)"]

  B --> C["1-tools (helpers, no UI)"]
  C --> C1["_mixins.scss (@mixin / @include)"]
  C --> C2["_grid.scss (containers, layout math)"]
  C --> C3["_reset.scss + _normalize.scss (read-only early)"]
  C --> C4["_syntax-highlighting.scss (read later)"]

  C --> D["2-base (element defaults)"]
  D --> D1["_base.scss (body, headings, links, lists)"]

  D --> E["3-modules (components)"]
  E --> E1["_buttons.scss"]
  E --> E2["_footer.scss"]
  E --> E3["_pagination.scss"]

  E --> F["4-layouts (page-level styling)"]
  F --> F1["_home.scss"]
  F --> F2["_page.scss"]
  F --> F3["_post.scss"]
  F --> F4["_tags.scss"]

  F --> G["5-trumps (utilities / overrides)"]
  G --> G1["_helpers.scss"]

  %% HTML pairings
  E1 -.-> H1["_includes/post-card.html"]
  E2 -.-> H2["_includes/footer.html"]
  E3 -.-> H3["_includes/pagination.html"]
  F3 -.-> L1["_layouts/post.html"]
  F2 -.-> L2["_layouts/page.html"]
  F1 -.-> P1["index.html"]
````

---

## Readable checklist (no Mermaid required)

### Phase 1 — Tokens (fast wins)

1. `_sass/0-settings/_colors.scss`
2. `_sass/0-settings/_global.scss`

---

### Phase 2 — Tools (read to recognize patterns)

3. `_sass/1-tools/_mixins.scss`
4. `_sass/1-tools/_grid.scss`

*Read later:*

* `_reset.scss`
* `_normalize.scss`
* `_syntax-highlighting.scss`

---

### Phase 3 — Foundation CSS

5. `_sass/2-base/_base.scss`

---

### Phase 4 — Components (pair Sass with HTML)

6. `_sass/3-modules/_buttons.scss` ↔ `_includes/post-card.html`
7. `_sass/3-modules/_footer.scss` ↔ `_includes/footer.html`
8. `_sass/3-modules/_pagination.scss` ↔ `_includes/pagination.html`

---

### Phase 5 — Page layouts (pair with layouts)

9. `_sass/4-layouts/_post.scss` ↔ `_layouts/post.html`
10. `_sass/4-layouts/_page.scss` ↔ `_layouts/page.html`
11. `_sass/4-layouts/_home.scss` ↔ `index.html`
12. `_sass/4-layouts/_tags.scss` ↔ `tags.html`

---

### Phase 6 — Utilities / overrides

13. `_sass/5-trumps/_helpers.scss`

---

## Template Design & Review Plan

### Goals

* Keep changes **maintainable**
* Improve UX without breaking Jekyll/Liquid conventions
* Fix Sass warnings while learning (one file at a time)

---

## Baseline & guardrails (once)

### Baseline

* Create branch: `design-refresh`
* Capture “before” screenshots:

  * Home
  * Post
  * Tags
  * 404

### Guardrails

* Do **not** edit `_site/`
* Treat `assets/css/main.scss` as an import hub only
* Prefer `_sass/` over inline or scattered CSS

---

## Design tokens review

**Files**

* `_sass/0-settings/_colors.scss`
* `_sass/0-settings/_global.scss`

**Checklist**

* Semantic color roles (primary, accent, text, muted, border, background)
* Link + hover contrast
* Consistent type scale (body, small, h1–h4)
* Readable line-height and max-width

**Output**

* Optional palette section in README
* Token summary comment at top of `_colors.scss`

---

## Typography & base styling

**Files**

* `_sass/2-base/_base.scss`
* `_includes/head.html` (font loading reference)

**Checklist**

* Body text readable (≈16–18px)
* Line-height comfortable (≈1.5–1.7)
* Headings spaced consistently
* Links clearly recognizable
* Code blocks readable and distinct

---

## Layout structure review

**Files**

* `_layouts/default.html`
* `_includes/header.html`
* `_includes/footer.html`
* `_sass/1-tools/_grid.scss`
* `_sass/4-layouts/_home.scss`
* `_sass/4-layouts/_page.scss`
* `_sass/4-layouts/_post.scss`

**Checklist**

* Single, clear content width
* Predictable navigation
* Footer essentials only
* Mobile spacing comfortable

---

## Component review

### Buttons

* Sass: `_sass/3-modules/_buttons.scss`
* HTML: `_includes/post-card.html`

Checklist:

* One primary, one secondary style
* Visible hover + focus
* Consistent padding and radius

---

### Pagination

* Sass: `_sass/3-modules/_pagination.scss`
* HTML: `_includes/pagination.html`

Checklist:

* Active state clear
* Touch targets large enough

---

### Post cards

* Sass: `_sass/4-layouts/_home.scss`
* HTML: `_includes/post-card.html`

Checklist:

* Title dominant
* Excerpt readable
* Metadata visually secondary

---

## Content templates review

**Files**

* `_layouts/post.html`
* `_layouts/page.html`
* `_includes/read-time.html`
* `_includes/social-share.html`
* `_posts/*.md`

Checklist:

* Clear post header hierarchy
* Images scale cleanly
* Lists and blockquotes spaced well
* Code blocks scroll or wrap safely

---

## Utilities / trumps (last)

**File**

* `_sass/5-trumps/_helpers.scss`

Checklist:

* Clear naming (optional `u-` prefix)
* Avoid one-off helpers
* Used only for intentional overrides

---

## QA pass (every change)

**Pages**

* Home
* One post
* Tags
* 404

**Checklist**

* No horizontal scroll (mobile)
* Consistent links
* Consistent heading rhythm
* Responsive images
* Visible focus states

---

## Fast Sass-only workflow (no full Jekyll rebuild)

```
# Compile once
sass assets/css/main.scss _site/assets/css/main.css

# Watch
sass --watch assets/css/main.scss:_site/assets/css/main.css

# Watch with source maps
sass --watch --source-map assets/css/main.scss:_site/assets/css/main.css

```

```

## Notes

### Design decisions

* Primary color:
* Accent color:
* Body font:
* Heading font:
* Base font size:
* Line-height:
* Max content width:

### Issues to revisit

* [ ]
* [ ]
* [ ]
