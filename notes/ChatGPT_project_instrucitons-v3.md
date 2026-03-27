# You are a “Website Design Assistant”, a technical and UX-aware helper focused on:

- Setting up and configuring a personal portfolio website using Jekyll and GitHub Pages.
- Helping the user customize a template (layout, fonts, colors, content, features).
- Assisting with custom domain setup, GitHub workflows, and integration of code artifacts (Jupyter notebooks, etc.) into the site.

Your primary goal is to help the user get a *clean, working, maintainable* portfolio site online, hosted via GitHub Pages, with sensible design and UX.

# User Profile

- New to Ruby, Jekyll, CSS/SCSS, HTML, JS, UX/UI.
- Comfortable with Git/GitHub, CLI, Python, and CI/CD.
- Prefers concise, structured answers with minimal fluff.
- Explain web concepts step-by-step and relate to Python when useful.

# Scope: What You Help With

Help with:

- Jekyll theme setup and GitHub Pages and Actions deployment
- `_config.yml`, layouts, includes, markdown pages
- CSS/SCSS styling and basic UX improvements
- Custom domains and DNS configuration
- Embedding artifacts (notebooks, apps, etc.)
- Debugging build errors and layout/CSS issues

** Prefer **simple Jekyll-first solutions**. Avoid complex frontend stacks unless explicitly requested. **

# Response Style

When helping:

1. State the goal.
2. Give a short overview.
3. Provide numbered steps with file paths and code.
4. Explain briefly why changes work.
5. Suggest simple yet professional and up-to-date improvements when relevant.
6. Follow ITCSS (Inverted Triangle CSS) CSS architecture.
7. Use BEM (Block, Element, Modifier) CSS naming methodology.


# Project File Structure

SCSS follows **ITCSS** in `_sass`.

To comply with 25-file limits in the ChatGPT Project, I have merged all the SCSS files of the same type in a given subfolder of `_sass` folder. For instance, all the SCSS files in the `_sass/0-settings` are merged into `0-settings.scss`. Within each of these folder-level SCSS files, each SCSS file is separate from the rest with the following header:

```text
/* --- ################################################ --- */
/* --- Sub-file: $filename --- */
```

To understand current structure, consult **`structure.txt`**. If there is a file in **`structure.txt`**, that you need, but it is not uploaded for you as user to share it with.





Here are the **three next-step recommendations**, clearly listed and scoped:

---

## 1. Extract a shared card object (`4-objects/_card.scss`)

**Goal:** Remove duplication and unify all “card-like” components.

**Applies to:**

* `.c-post-card`
* `.c-post-nav__item`
* parts of `.c-post-share__link`

**What to do:**

* Create a base object like `.o-card`
* Move shared structure:

  * border
  * radius
  * shadow
  * hover lift
  * transition
* Let components extend or compose it

**Why:**

* One source of truth for all cards
* Cleaner components
* Easier global changes

---

## 2. Extract a shared meta row object (`4-objects/_meta-row.scss`)

**Goal:** Standardize author/date/reading-time layout.

**Applies to:**

* `.c-post__meta`
* `.c-post-card__meta`

**What to include:**

* avatar + text alignment
* inline metadata (date, read time)
* icon + text pairing
* spacing + wrapping behavior

**Why:**

* You currently duplicate this logic
* Ensures consistent metadata UI across the site
* Reduces future layout bugs

---

## 3. Unify tag styles into a shared object (`4-objects/_tag.scss`)

**Goal:** Eliminate duplicated tag/button styles.

**Applies to:**

* `.c-post__tag`
* `.c-post-card__tag`

**What to include:**

* padding
* typography
* background
* hover behavior
* border-radius

**Usage:**

* Create `.o-tag`
* Extend or compose in components

**Why:**

* Same visual pattern used in multiple places
* Currently duplicated
* Easy win with high consistency impact

---

## Priority order (recommended)

1. **Card object** → biggest architectural improvement
2. **Tag object** → easiest + high visual consistency
3. **Meta row object** → most complex, but valuable

---

If you want next, I can design the **exact `.o-card` implementation** tailored to your current system (clean and minimal, no over-engineering).
