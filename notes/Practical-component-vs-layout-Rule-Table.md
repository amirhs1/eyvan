# Practical `c-` vs `l-` Rule Table for This Project

## Goal

Create a simple, repeatable rule for deciding when a root class should be a **component (`c-`)** and when it should be a **layout (`l-`)** in this Jekyll + ITCSS project.

---

## Core Rule

| Use           | Prefix | Ask yourself                                                     |
| ------------- | ------ | ---------------------------------------------------------------- |
| **Component** | `c-`   | “Is this a self-contained UI block with its own internal parts?” |
| **Layout**    | `l-`   | “Is this mainly arranging multiple blocks/regions on a page?”    |

---

## Short Version

| If the thing is mostly...              | Use  |
| -------------------------------------- | ---- |
| a **single content/UI block**          | `c-` |
| a **page/section composition wrapper** | `l-` |

---

## Practical Decision Table

| Question                                                                                   | If yes | If no         |
| ------------------------------------------------------------------------------------------ | ------ | ------------- |
| Does it have a clear, reusable UI identity of its own?                                     | `c-`   | keep checking |
| Is it mostly made of title, text, media, buttons, meta, tags, etc. inside one block?       | `c-`   | keep checking |
| Is it mainly responsible for spacing/placement **between multiple independent blocks**?    | `l-`   | keep checking |
| Could its children be swapped out for different blocks without changing the wrapper’s job? | `l-`   | usually `c-`  |
| Is it a template shell for a page, archive, or section?                                    | `l-`   | usually `c-`  |

---

## Project-Specific Rule Table

| Case in this project               | Recommended prefix                                                                                      | Why                                                                     |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `page`                             | `c-page`                                                                                                | It is one self-contained content block: image, header, meta, tags, body |
| `post`                             | `c-post`                                                                                                | It is one article UI block with internal structure                      |
| `post-card`                        | `c-post-card`                                                                                           | Reusable summary card component                                         |
| `entry-meta`                       | `c-entry-meta`                                                                                          | Reusable metadata component                                             |
| `section-heading`                  | `c-section-heading`                                                                                     | Reusable heading block                                                  |
| `site-header`                      | `c-site-header`                                                                                         | Distinct reusable UI shell                                              |
| `site-footer`                      | `c-site-footer`                                                                                         | Distinct reusable UI shell                                              |
| `tag-page`                         | `l-tag-page`                                                                                            | Composes heading, grid, cards, empty state                              |
| homepage “latest projects” wrapper | usually `l-` if it mainly composes blocks; `c-` if it is a branded section with its own visual identity | Depends on responsibility                                               |
| grid placement wrapper             | `l-` or `o-` depending on scope                                                                         | It arranges blocks, not presentational UI                               |
| page shell around `c-page`         | `l-page`                                                                                                | Only if introduced to control outer composition                         |

---

## How to Classify Common Patterns

### Use `c-` when the block owns:

* its own title/subtitle/meta/tags/body
* its own visual presentation
* its own internal spacing
* its own media/content/actions
* a recognizable reusable UI pattern

### Use `l-` when the block owns:

* spacing between major page regions
* arrangement of independent child blocks
* page template composition
* section-to-section flow
* multi-column or multi-region page structure

---

## Good Examples for This Project

### `c-page`

Use when the root wraps one page content block:

```html id="81929"
<article class="c-page">
  <header class="c-page__header">...</header>
  <div class="c-page__body o-prose">...</div>
</article>
```

Why:

* one block
* internal elements belong to it
* it presents content, not other reusable sections

---

### `l-tag-page`

Use when the root composes independent blocks:

```html id="23681"
<section class="l-tag-page">
  <div class="l-tag-page__heading">
    {% include section-heading.html %}
  </div>

  <div class="o-grid">
    {% include post-card.html %}
  </div>
</section>
```

Why:

* heading is its own component
* cards are their own components
* grid is its own object
* wrapper mainly controls composition

---

## Borderline Cases

Some things can look like either one. Use this tie-breaker:

| If the root mostly answers...    | Use  |
| -------------------------------- | ---- |
| “What is this thing?”            | `c-` |
| “How are these things arranged?” | `l-` |

Examples:

| Block                         | Better choice     | Reason                                         |
| ----------------------------- | ----------------- | ---------------------------------------------- |
| About page article            | `c-page`          | It is primarily the content block itself       |
| Archive page wrapper          | `l-archive-page`  | It arranges heading, filters, grid, pagination |
| Projects listing page wrapper | `l-projects-page` | Usually composition of multiple blocks         |
| Reusable CTA banner           | `c-cta-banner`    | One recognizable reusable UI block             |

---

## Recommended Naming Rules for Future Pages

| Future page type                 | Recommended pattern                                             |
| -------------------------------- | --------------------------------------------------------------- |
| simple static content page       | `c-page`                                                        |
| long-form article page           | `c-post`                                                        |
| archive/listing page             | `l-archive-page`, `l-tag-page`, `l-projects-page`               |
| docs page with sidebar + content | `l-docs-page` + `c-page` or `c-doc-content`                     |
| landing page with many sections  | `l-landing-page` for page shell, then section components inside |

---

## Best Pattern Going Forward

Use this layered pattern when a page has both composition and a main content block:

```html id="98054"
<div class="l-page">
  <article class="c-page">
    ...
  </article>
</div>
```

Meaning:

* `l-page` = outer page composition
* `c-page` = actual page content block

This is useful only when the page truly has extra layout responsibility outside the content block.

---

## Anti-Patterns to Avoid

| Avoid                                                         | Why                                                       |
| ------------------------------------------------------------- | --------------------------------------------------------- |
| Using `l-` just because the block has margins/gaps            | Components also own internal spacing                      |
| Using `c-` for a page wrapper that only arranges other blocks | That is layout responsibility                             |
| Renaming things just for symmetry                             | Prefix should reflect responsibility, not naming symmetry |
| Moving all positional rules into `6-layouts`                  | Internal component spacing belongs in components          |

---

## Final Cheat Sheet

| Situation                                        | Prefix |
| ------------------------------------------------ | ------ |
| one reusable block with its own internal parts   | `c-`   |
| one article/page/post block                      | `c-`   |
| one card                                         | `c-`   |
| one heading block                                | `c-`   |
| wrapper that arranges several independent blocks | `l-`   |
| archive/listing page shell                       | `l-`   |
| page shell with sidebar/content/filters/sections | `l-`   |

---

## Recommendation for Your Current Files

| File/class                                 | Keep as |
| ------------------------------------------ | ------- |
| `5-components/_page.scss` / `.c-page`      | keep    |
| `5-components/_post.scss` / `.c-post`      | keep    |
| `6-layouts/_tag-page.scss` / `.l-tag-page` | keep    |

---

## One-Sentence Rule

> If the root is the **thing itself**, use `c-`; if the root mainly **arranges other things**, use `l-`.
