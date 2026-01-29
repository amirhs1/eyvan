# Website Essentials: Summary & Improvement Roadmap

This document summarizes the current state of your Jekyll-based website against the **"Essential Parts of a Website"** checklist and provides a **clear, actionable roadmap** to revise, strengthen, and add missing elements.

The goal is **completeness, clarity, and UX intent**, not feature bloat.


TBased on the provided article, there are **11 essential parts** that form the backbone of a professional and functional website. These components ensure the site is cohesive, easy to navigate, and capable of engaging visitors effectively.

## 1. Executive Summary

Your website already implements **most structural essentials** of a modern website. The foundation is strong:

- Summary of the essential website elements
- Clean Jekyll architecture
- Excellent content and blog system
- Well-structured SCSS using ITCSS
- Clear separation of layout, components, and content

**What’s missing is not capability, but emphasis.**
Several essential elements exist implicitly or partially, but are not yet:

- Clearly signposted to users
- Intentionally composed as UX moments
- Consistently reused across layouts

Overall alignment: **~85% complete**

---

## 2. Essential Parts of a Website

### The Core Structure (The "Backbone")

These elements are fundamental to the layout and immediate user experience of the site.

* **Homepage:** This is the main entry point and the "hub" of your website. It sets the tone for your brand and connects visitors to all other sections of the site.

* **Header:** Acting as the "front door" to your site, this is the first thing visitors see. It typically sits at the top of the page and includes your logo and menu to establish your identity immediately.

* **Menu (Navigation):** This functions like a GPS for your visitors, helping them find the information they need quickly. It should be clean and organized, often appearing as a horizontal bar, dropdown, or "hamburger" icon.

* **Above-the-Fold Visuals:** Located immediately below the header, these visuals (images or videos) are crucial for creating a strong first impression before a user scrolls down. They should convey the "feel" of your brand instantly.

* **Website Content:** This encompasses the actual text and media on your site, explaining your mission, products, and services. It includes everything from paragraph text to the specific micro-copy on buttons.

* **Footer:** Found at the very bottom of the site, the footer usually contains a sitemap, contact details, social media icons, and copyright information. It catches visitors who haven't found what they needed in the header.

### Functional & Engagement Elements

These parts drive user interaction, build trust, and support specific business goals.

* **Logo:** A critical part of your brand identity that makes your company recognizable. It is usually placed in the top-left corner of the header and links back to the homepage.

* **Call-to-Action (CTA):** Short, actionable text (often on buttons) like "Start now" or "Buy yours" that guides users toward a specific goal, such as making a purchase or signing up.

* **Sidebar:** A horizontal bar, typically on the right side, that offers secondary navigation, links to recent content, or space for advertisements and newsletter signups.

* **Blog:** A section for articles and posts related to your business that helps demonstrate expertise and drives traffic through SEO.

* **Forms:** Interactive elements used to collect information from visitors, such as contact inquiries, feedback, or lead generation via newsletter signups.


### Infrastructure Essentials (Non-Design)

While not visible design parts, the article notes these are essential for the site to exist online:

* **Web Hosting:** The "storage unit" on a server where your website lives.

* **Domain Name:** The web address (e.g., https://www.google.com/search?q=yoursite.com) that serves as your unique access point.

* **SEO (Search Engine Optimization):** The process of optimizing your site structure and content so it can be found on search engines like Google.


**Would you like me to create a checklist for your specific type of website (e.g., portfolio, e-commerce, or blog) based on these components?**

---
## 3. Current State: What Exists vs What’s Missing

### Fully in Place (Solid)
- Header structure and branding container
- Navigation system (desktop + mobile capable)
- Core content (posts, pages, layouts)
- Blog, pagination, tags, read-time
- Footer structure and styling
- Homepage as entry point
- Hosting, build output, sitemap

These elements require **refinement**, not replacement.

---

### Partially Implemented (Needs Strengthening)

#### Above-the-Fold / Hero
- Styles exist (`_hero.scss`)
- Layout support exists (`_home.scss`)
- No enforced hero section in markup

**Issue:**
The first impression depends on content coincidence rather than layout intent.

---

#### Logo
- Avatar image functions visually as a logo
- No explicit logo component or semantic clarity

**Issue:**
The site has branding, but not a clearly defined brand object.

---

#### Call-to-Action (CTA)
- Button styles exist
- No repeated, intentional CTAs in layouts

**Issue:**
Users are not guided toward actions.

---

#### Forms
- Form styles exist
- No functional contact or signup form

**Issue:**
No interaction or conversion point.

---

## 4. Improvement Roadmap (Prioritized)

This roadmap is ordered by **impact vs effort**, not by theory.

---

### Phase 1 – Clarify First Impression (High Impact, Low Risk)

**Goal:** Make the homepage immediately understandable.

#### 1. Add a Dedicated Hero Include
- Create `_includes/hero.html`
- Use on `index.html` only
- Contents:
  - Primary headline (who you are)
  - Short value proposition (what you do)
  - One primary CTA

**Why:**
Guarantees above-the-fold clarity regardless of content changes.

---

#### 2. Formalize CTAs
- Add 1 primary CTA style (already styled)
- Place CTAs in:
  - Hero section
  - End of homepage
  - End of blog posts

**Examples:**
- “Contact me”
- “View projects”
- “Read more posts”

---

### Phase 2 – Strengthen Identity & Semantics

**Goal:** Make branding and structure explicit.

#### 3. Decide on Logo Strategy
Choose one:

**Option A – Avatar as Logo (Minimalist)**
- Document this decision
- Rename variables/comments for clarity

**Option B – Explicit Logo Component**
- Add `_includes/logo.html`
- Use in header and footer

**Why:**
Reduces ambiguity and improves long-term maintainability.

---

#### 4. Improve Navigation Clarity
- Ensure primary nav links are intentional:
  - Home
  - About
  - Blog
  - Tags / Topics
  - Contact

- Audit mobile navigation behavior

---

### Phase 3 – Add Interaction & Conversion

**Goal:** Allow visitors to respond.

#### 5. Add a Contact Form Page
- Create `contact.md`
- Add basic form markup
- Connect to:
  - Formspree
  - Netlify Forms
  - Static mailto (fallback)

**Why:**
Completes the feedback loop.

---

#### 6. Add Light SEO Enhancements
- Page-level meta descriptions
- Optional OpenGraph / Twitter cards

**Why:**
Improves discoverability without changing layout.

---

### Phase 4 – Optional Enhancements (Only If Needed)

These are **non-essential** for your current goals:

- Sidebar (newsletter, metadata)
- Featured posts module
- Homepage content blocks (projects, highlights)

Add only if they serve a clear purpose.

---

## 5. Guiding Principle Going Forward

> Don’t add features.
> **Make existing intent visible.**

Your architecture is already strong. Each improvement should:
- Clarify user understanding
- Reduce ambiguity
- Reinforce hierarchy

If you want, the next step can be:
- Implementing the hero section end-to-end
- Designing a single, canonical CTA pattern
- Adding the contact form with minimal backend

This roadmap is designed to be executed incrementally without breaking the site.
