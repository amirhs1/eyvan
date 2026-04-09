# Jekyll + ITCSS Action Plan

## Goal

Make the website architecture more consistent, unified, and simplified while preserving your current naming where possible.

This plan follows the decisions from our discussion:

- keep changes targeted
- prefer Jekyll-first simplicity
- follow ITCSS cleanly
- avoid renaming unless the rename improves clarity
- do not create abstractions before the HTML structure is stable

---

## High-level strategy

The work should happen in this order:

1. Fix broken user-facing behavior first.
2. Clean up naming inconsistencies in `page.html`, `projects.html`, and `index.html`.
3. Add the highest-confidence shared objects.
4. Simplify repeated HTML structures before extracting more objects.
5. Fill the missing `6-layouts` layer.
6. Move mis-layered selectors out of `3-base`.
7. Only create optional objects like `o-card` if the final CSS duplication proves they are necessary.

---

## Phase 1 — Fix broken behavior first

### 1.1 Fix the mobile menu toggle

## Phase 2 — Rename inconsistent HTML classes

### 2.1 Update `_layouts/page.html`

### 2.2 Update `projects.html`

### 2.3 Update `index.html`

## Phase 3 — Add the highest-confidence shared objects

### 3.1 Create `4-objects/_o-tag.scss`

### 3.2 Create `4-objects/_o-prose.scss`

### 3.3 Create `4-objects/_o-action-cluster.scss`

## Phase 4 — Simplify metadata before extracting a metadata object

### 4.1 Revise the metadata markup in `post-card.html` and `post.html`

### 4.2 Create `4-objects/_o-post-metadata.scss`

## Phase 5 — Fill the missing `6-layouts` layer

Your layout layer is the biggest structural gap right now.

### 5.1 Create `6-layouts/_l-homepage.scss`

### 5.2 Create `6-layouts/_l-projects.scss`

### 5.3 Create `6-layouts/_l-page.scss`

### 5.4 Create `6-layouts/_l-tag-page.scss`

## Phase 6 — Add the missing components

### 6.1 Create `5-components/_c-page.scss`

### 6.2 Create `5-components/_c-projects.scss`

### 6.3 Create `5-components/_c-home.scss`

### 6.4 Optional: create `5-components/_c-tag-page.scss`

## Phase 7 — Clean up `3-base` and move mis-layered selectors

### 7.1 Fix mis-layered image/media selectors

**Goal**  
Remove component selectors from base styles.

**Problem**

Your base layer currently includes image/media rules tied to component selectors.
That breaks ITCSS separation.

**Correct split**

#### `3-base/_media.scss`
Keep only true element defaults such as:

- `img`
- `picture`
- `figure`
- maybe `video`

#### `4-objects/_o-media-frame.scss` (optional)
Use only if shared media wrappers are real.

Possible scope:

- generic overflow handling
- shared border-radius
- image fill behavior
- object-fit wrapper behavior

#### `5-components/*`
Keep component-specific image/media styling in component files.

Examples:

- hero image treatment
- post cover image treatment
- page image treatment
- post-card image treatment
- post-nav media treatment

**Recommendation**

Do not place component selectors in `3-base`.
If you need shared media structure, use `4-objects/_o-media-frame.scss`.

---

### 7.2 Fix list marker and list indentation behavior

**Goal**  
Fix bullet and numbered lists so markers sit properly within readable content blocks.

**Split the fix correctly**

#### In `3-base`
Add sane global list defaults:

- default `padding-inline-start`
- default margins for `ul`, `ol`, and nested lists
- spacing between sibling `li` items

#### In `o-prose`
Add content-specific improvements:

- typography-aware list spacing
- refined marker alignment
- nested list rhythm for long-form content
- optional marker color adjustments

**Why**

- base should set safe defaults site-wide
- `o-prose` should refine lists for article/page reading contexts

---

## Phase 8 — Decide later on optional objects

### 8.1 Decide later on `4-objects/_o-card.scss`

**Current stance**

Do not create this immediately.

**Why**

You still need to confirm whether `.c-post-card` and `.c-post-nav__item` truly share the same surface rules after the rest of the cleanup.

**If you do create it later**

Keep it narrowly defined as a generic surface object.

**Suggested scope**

- background
- border
- border-radius
- box-shadow
- hover or focus lift
- transition
- optional overflow clipping

**Do not let it own**

- content spacing
- card media layout
- typography
- metadata structure
- tag placement

**ITCSS rationale**

This is valid only if it stays a generic structural shell and does not become a pseudo-component.

---

### 8.2 Decide later on `4-objects/_o-media-frame.scss`

**Current stance**

Optional.

Create it only if multiple components truly share the same media wrapper logic.

**Why**

Some media behavior can stay inside component files until duplication is clear.

