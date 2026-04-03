# o-container Usage Rules

## Goal
Provide a clear, consistent rule for when and where to use `o-container` in the project.

---

## Core Principle

**`o-container` is a width limiter for content, not a universal outer wrapper.**

Use it to control horizontal alignment and max-width of content inside a section.

---

## Decision Rule

Ask:

> **Where should this section become width-constrained?**

Place `o-container` at that boundary.

---

## Pattern A — Section Shell (Full-Width Background)

Use when the section has its own visual identity (background, border, etc.).

```html
<section class="c-section">
  <div class="o-container">
    ...
  </div>
</section>
```

### Use for:
- Header
- Footer
- Related posts
- Hero (recommended)

### Why:
- Section spans full width
- Content is constrained inside

---

## Pattern B — Content Layout (No Full-Width Shell)

Use when the layout is just structured content without a visual shell.

```html
<div class="o-container">
  <section class="l-layout">
    ...
  </section>
</div>
```

### Use for:
- Page layout
- Tag page
- Main content areas

### Why:
- No need for full-width wrapper
- Entire layout is constrained

---

## Pattern C — Multi-Section Pages

Use multiple `o-container` blocks when a page has distinct horizontal sections.

```html
<div class="o-container">Post content</div>
<div class="o-container">Navigation</div>
<section class="c-related-posts">
  <div class="o-container">Related posts</div>
</section>
```

### Use for:
- Post pages
- Complex layouts with separate bands

---

## What NOT to Do

❌ Do not:
- Wrap everything blindly in `o-container`
- Nest containers unnecessarily
- Use it inside small components (buttons, cards, etc.)

---

## Summary

| Scenario                  | Where to put `o-container`        |
|--------------------------|----------------------------------|
| Full-width section       | Inside section shell             |
| Content-only layout      | As outer wrapper                 |
| Multi-section page       | Per section                      |

---

## Mental Model

Think of `o-container` as:

> **“Where content stops expanding horizontally.”**

Not:

> **“A required outer wrapper for every file.”**
