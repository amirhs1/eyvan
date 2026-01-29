
# Project Summary: Website Layout Decision (Portfolio Template)

## Context

* One shared **Jekyll + GitHub Pages** codebase.
* Used for **two portfolio websites**:

  1. An **applied scientist** (Apple-adjacent, research/engineering focus).
  2. A **professional fine-art artist**.
* Strong emphasis on:

  * Clean architecture (`_layouts`, `_includes`, ITCSS SCSS).
  * Long-term maintainability.
  * Minimal text, strong visuals.
  * Signal over noise.

---

## Key Constraint

* **Content is NOT text-heavy**.
* Visitors scan visually, not read long paragraphs.
* Goal is fast identity recognition + work discovery.

---

## Chosen Layout Pattern (Final Decision)

### Overall Pattern

**Top identity box + grid of cards (single-column page spine)**

This is intentionally *not* a classic F-pattern or magazine layout.

---

### Section 1: Top Box (Identity Anchor)

Purpose: establish who the person is in 1–2 seconds.

Contents:

* Avatar **or** figure (never both).
* Name.
* One-line descriptor.
* Optional: minimal links (CV / contact).

This is an **identity card**, not a marketing hero.

Same structure for scientist and artist; only styling differs.

---

### Section 2: Grid of Work (Core Content)

Purpose: showcase recent / important work.

Key decisions:

* **CSS Grid (not flexbox)**.
* Predictable rows and columns.
* Strong visual rhythm.

Each grid item (card) contains:

* Image (required).
* Title.
* Tags.
* Estimated read time (or equivalent for art).

Cards are:

* Neutral.
* Reusable.
* Non-hierarchical.
* Scannable.

---

## Why This Pattern Was Chosen

* Better than text-driven layouts (F-pattern, magazine).
* Stronger than fullscreen or asymmetrical designs for maintainability.
* Optimized for **recognition over reading**.
* Works equally well for:

  * Scientist (credibility, clarity).
  * Artist (visual primacy, gallery feel).

---

## Jekyll Mapping (High Level)

* `_layouts/home.html`

  * Renders:

    1. Identity box
    2. Grid include

* `_includes/hero.html` (or semantic header)

  * Identity box only.

* `_includes/post-card.html`

  * Single reusable card component.
  * Same structure for science + art.

* Content source:

  * One feed / collection, filtered by context (projects, posts, artworks, etc.).

## CSS / UX Principles

* Grid over flex for the main work section.
* Consistent gaps, padding, and alignment.
* No masonry, no hover gimmicks.
* Image first, metadata second, tags tertiary.
* Same skeleton, different “skin” via tokens (colors, type, spacing).

## Final Verdict

The **identity box + grid of cards** layout is:

* Cleaner than most “standard” layout patterns.
* More appropriate for low-text, high-signal portfolios.
* Scalable, modern, and future-proof.
* A strong foundation for both science and fine-art identities.
