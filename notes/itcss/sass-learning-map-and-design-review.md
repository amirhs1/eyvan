# Sass Learning Map & Template Design Review Plan

This document is tailored to the provided Jekyll + Sass project structure.
It is intended to be used as a **living reference** while learning, refactoring,
and reviewing the design system.

---

## Part 1 — Sass Learning Map (Mental Model Diagram)

```text
┌───────────────────────────────────────────────┐
│                Design Intent                  │
│        (Typography, Color, Spacing)            │
└───────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│            0-settings (FOUNDATION)             │
│                                               │
│  _colors.scss   → color tokens                │
│  _global.scss   → fonts, spacing, scales      │
│                                               │
│  ❖ No selectors                               │
│  ❖ Variables only                             │
└───────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│              1-tools (MECHANICS)               │
│                                               │
│  _mixins.scss    → reusable logic              │
│  _grid.scss      → layout math                 │
│  _reset.scss     → browser reset               │
│  _normalize.scss → browser normalization       │
│                                               │
│  ❖ No UI meaning                               │
│  ❖ Infrastructure only                         │
└───────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│              2-base (ELEMENTS)                 │
│                                               │
│  _base.scss                                    │
│                                               │
│  body, headings, links, lists                  │
│  typography rules                              │
│                                               │
│  ❖ First real CSS output                       │
└───────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│            3-modules (COMPONENTS)              │
│                                               │
│  _buttons.scss                                 │
│  _footer.scss                                  │
│  _pagination.scss                              │
│                                               │
│  ❖ Reusable UI blocks                          │
│  ❖ Maps directly to _includes HTML             │
└───────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│            4-layouts (PAGE CONTEXT)             │
│                                               │
│  _home.scss                                    │
│  _post.scss                                    │
│  _page.scss                                    │
│  _tags.scss                                    │
│                                               │
│  ❖ Page-specific composition                   │
│  ❖ Overrides modules where needed              │
└───────────────────────────────────────────────┘
                    │
                    ▼
┌───────────────────────────────────────────────┐
│             5-trumps (OVERRIDES)                │
│                                               │
│  _helpers.scss                                 │
│                                               │
│  ❖ Utility & helper classes                    │
│  ❖ Highest specificity                         │
└───────────────────────────────────────────────┘
```

---

## Part 2 — Template Design & Review Plan

### A. Design System Review

```text
Design Tokens
├── Colors        → _sass/0-settings/_colors.scss
├── Typography    → _sass/0-settings/_global.scss
├── Spacing       → _sass/0-settings/_global.scss
└── Breakpoints   → _sass/1-tools/_mixins.scss
```

Review Goals:
- Consistent naming
- Limited palette
- Predictable spacing scale
- Single font system

---

### B. Global Structure Review

```text
HTML Skeleton
├── _layouts/default.html
│   ├── <head>    → _includes/head.html
│   ├── <header>  → _includes/header.html
│   ├── content   → layout-specific
│   └── <footer>  → _includes/footer.html
```

Review Goals:
- Semantic HTML
- Minimal wrapper divs
- Clear content hierarchy

---

### C. Component Review Matrix

```text
Component        HTML Include                  Sass Module
───────────────  ───────────────────────────  ─────────────────────
Buttons          post-card.html                _buttons.scss
Footer           footer.html                   _footer.scss
Pagination       pagination.html               _pagination.scss
Post Card        post-card.html                _post.scss + modules
```

Review Goals:
- One responsibility per component
- No layout logic inside components
- Predictable class naming

---

### D. Page-Level Review

```text
Page Type     Layout File        Sass File
───────────  ─────────────────  ─────────────────
Home         index.html         _home.scss
Post         post.html          _post.scss
Page         page.html          _page.scss
Tags         tags.html          _tags.scss
```

Review Goals:
- Page rules do not leak globally
- Layout overrides are intentional
- Typography scales correctly per page

---

### E. Override & Utility Review

```text
Helpers & Trumps
└── _sass/5-trumps/_helpers.scss
```

Review Goals:
- Utilities are rare
- No duplication with modules
- Used intentionally, not reactively

---

## Part 3 — Ongoing Maintenance Checklist

```text
✔ New color added → update _colors.scss only
✔ New component  → add to 3-modules/
✔ Page tweak     → prefer 4-layouts/
✔ Quick fix      → verify before using helpers
✔ Warning seen   → trace file ownership first
```

---

## Part 4 — Golden Rules

- Never style without knowing where the HTML lives
- Never override without checking the cascade
- Never add utilities before understanding the module
- `_site/` is output, not source
- Sass structure reflects thinking structure

---

End of document.
