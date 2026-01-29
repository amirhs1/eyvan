Got it. I’ll keep this **Jekyll-native, concrete, and actionable**.

---

## 1) Mapping the 10 layout steps → Jekyll files

Below is a **direct translation** from design principle → *where it actually lives* in your Jekyll project.

---

### **1. Start with layout early**

**→ `_layouts/`**

* `_layouts/default.html`
  Defines the global skeleton (head → header → content → footer)
* `_layouts/page.html`
  Used for static pages (About, Projects index)
* `_layouts/post.html`
  Used for blog posts (reading flow, metadata)

👉 Layout decisions here determine *everything downstream*.

---

### **2. Prioritize visual hierarchy**

**→ `_layouts/*.html` + `_includes/header.html`**

* Heading order (`h1 → h2 → h3`)
* Placement of:

  * Site title / tagline
  * Page title
  * Metadata (date, tags, read time)

**Files involved**

* `_layouts/post.html`
* `_layouts/page.html`
* `_includes/header.html`
* `_includes/post-card.html`

---

### **3. Balance text, imagery, whitespace**

**→ `_sass/3-base` + `_sass/4-objects`**

This is *not* layout HTML—it’s CSS structure.

* Text rhythm → `_sass/3-base/_typography.scss`
* Vertical spacing → `_sass/3-base/_spacing.scss`
* Content containers → `_sass/4-objects/_stack.scss`, `_box.scss`

👉 Layouts decide *structure*; base + objects decide *readability*.

---

### **4. Use intuitive navigation patterns**

**→ `_includes/header.html` + `_includes/footer.html`**

* Primary navigation location
* Logo → homepage affordance
* Secondary navigation (tags, pagination)

**Files**

* `_includes/header.html`
* `_includes/navigation.html` (if present)
* `_includes/pagination.html`
* `_includes/footer.html`

---

### **5. Choose layouts that fit content type**

**→ Layout selection via front matter**

```yaml
layout: post
layout: page
layout: default
```

**Mapping**

* Blog posts → `_layouts/post.html`
* Static content → `_layouts/page.html`
* Landing/home → `index.html` using `default`

This is where **content → layout matching** happens.

---

### **6. Leverage reading patterns (Z / F)**

**→ `_layouts/*.html` markup order**

* Z-pattern → hero + CTA (homepage)
* F-pattern → text-first posts

**Examples**

* Homepage:

  * Header → hero → CTA → sections
* Post:

  * Title → metadata → body → navigation

Files:

* `_layouts/post.html`
* `_layouts/page.html`
* `index.html`

---

### **7. Apply proven design principles (Gestalt, rule of thirds)**

**→ `_sass/4-objects` + `_sass/6-layouts`**

* Grouping → `.stack`, `.cluster`
* Consistency → shared layout objects
* Continuity → predictable section flow

Files:

* `_sass/4-objects/*.scss`
* `_sass/6-layouts/_home.scss`
* `_sass/6-layouts/_post.scss`

---

### **8. Use structure to create focus**

**→ `_includes/` components**

Focus elements live in *components*, not layouts.

* Hero blocks
* Call-to-action sections
* Highlighted project cards

Files:

* `_includes/post-card.html`
* `_includes/hero.html` (if added)
* `_sass/5-components/_hero.scss`

---

### **9. Design mobile-first**

**→ `_sass/0-settings` + `_sass/1-tools`**

* Breakpoints
* Fluid spacing
* Responsive typography

Files:

* `_sass/0-settings/_breakpoints.scss`
* `_sass/1-tools/_spacing-fluid.scss`
* `_sass/1-tools/_mixins.scss`

Layouts should be **simple HTML**, responsiveness handled in CSS.

---

### **10. Customize and refine**

**→ `_includes/` + content cleanup**

* Remove unused includes
* Simplify layouts
* Tighten header/footer content

Files touched last:

* `_includes/header.html`
* `_includes/footer.html`
* `_config.yml`

---

## 2) Layout decision checklist for your portfolio

This is the **practical checklist you actually use** when deciding layouts.

---

## 🏠 Homepage (`index.html`)

**Goal:** First impression + orientation

### Layout

* [ ] Uses `default` layout
* [ ] One clear `h1` (who you are / what you do)
* [ ] Hero section above the fold
* [ ] Z-pattern structure:

  * Logo (top-left)
  * Nav (top-right)
  * Core message (center)
  * CTA (below)

### Includes

* [ ] `header.html`
* [ ] Hero / intro section
* [ ] Project highlights (cards)
* [ ] Footer

### UX sanity checks

* [ ] Obvious next action
* [ ] No dense text blocks
* [ ] Reads well on mobile

---

## ✍️ Blog Posts (`_layouts/post.html`)

**Goal:** Reading flow and credibility

### Layout

* [ ] Title first
* [ ] Metadata grouped (date, tags, read time)
* [ ] F-pattern friendly
* [ ] Single-column body

### Includes

* [ ] `read-time.html`
* [ ] `pagination.html`
* [ ] `social-share.html` (optional)

### UX sanity checks

* [ ] Comfortable line length
* [ ] Clear hierarchy of headings
* [ ] Easy to navigate to next post

---

## 🧪 Projects (project pages or section)

**Goal:** Showcase work clearly, not creatively

### Layout

* [ ] Uses `page` or custom `project` layout
* [ ] Clear structure:

  * What it is
  * Why it matters
  * How it works
  * Links / demo

### Structure

* [ ] Box / card-based sections
* [ ] Images paired with explanation
* [ ] CTA (GitHub, demo, writeup)

### UX sanity checks

* [ ] Scannable in under 30 seconds
* [ ] No buried links
* [ ] Consistent across projects

---

## Mental model to keep

> **Layouts define flow.
> Includes define meaning.
> CSS defines comfort.**

If you want, next we can:

* Audit **one specific layout file** against this checklist
* Or design a **custom `project.html` layout** cleanly and minimally
