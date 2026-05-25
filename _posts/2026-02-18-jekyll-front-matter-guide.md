---
title: "Front Matter Field Reference"
subtitle: "Every supported key, what it does, and when to use it"
tags: [documentation, jekyll, reference, technical-writing]
image: "assets/images/posts/front-matter-cover.webp"
image_alt: "A minimalist line-art illustration of an open vaulted Iranian architectural arch (eyvan) framing a dark-themed code browser window that displays Jekyll front matter configuration keys, utilizing the custom Persian SCSS color palette."
toc: true
description: "A complete reference guide for all supported front matter fields in this Jekyll template."
---

> **Note:** This post was generated with OpenAI's ChatGPT for the sole purpose of demonstrating the rich typographic and mathematical capabilities of the Eyvan Jekyll template.


Front matter is the small YAML block at the top of a Jekyll page or post. It sits between two lines of three dashes and tells Jekyll how to process the file before it becomes HTML. In this template, front matter controls the page layout, post header, metadata, table of contents, social previews, MathJax loading, cover images, tags, and sharing behavior[^1].

Think of front matter as configuration for one content file. `_config.yml` defines global site settings, layout defaults, plugin behavior, and build settings. Front matter defines the exceptions and content-specific values for an individual post or page. When Jekyll builds the site, it reads the YAML first, stores those values on the `page` object, and then makes them available to Liquid templates such as `_layouts/post.html`, `_includes/head.html`, `_includes/math.html`, and the post card or metadata includes.

This post is a practical reference for the front matter fields supported by this template. It is written for future posts, documentation pages, project write-ups, and long-form technical notes. The goal is simple: you should be able to open a blank Markdown file, add the right fields, and know exactly what each key changes on the rendered page.

> **Note:** This guide focuses on fields that are used by the current template. Jekyll itself supports many more patterns, but adding fields that no layout or include reads will not change the page unless you also update the template.

## Front matter basics

A post begins with a YAML block like this:

```yaml
---
title: "Front Matter Field Reference"
subtitle: "Every supported key, what it does, and when to use it"
tags: [documentation, jekyll, reference, technical-writing]
toc: true
description: "A complete reference guide for all supported front matter fields in this Jekyll template."
---
```

Everything between the opening and closing `---` is parsed as YAML. Everything after the closing `---` is the body of the post. The body can use Markdown, HTML, Liquid includes, fenced code blocks, tables, blockquotes, footnotes, and any other syntax supported by the site’s Markdown engine.

In this template, posts live in `_posts/` and usually follow the filename pattern:

```text
YYYY-MM-DD-post-slug.md
```

For this article, the file should be saved as:

```text
_posts/2026-02-18-jekyll-front-matter-guide.md
```

Because `_config.yml` sets defaults for posts, you usually do not need to write `layout: post` manually. Jekyll applies it automatically to files in the posts collection. You can still write it explicitly if you want the file to be self-documenting.

## How Jekyll processes front matter

Jekyll processes a post in a predictable order.

1. It reads the YAML front matter.
2. It merges any matching defaults from `_config.yml`.
3. It renders Liquid variables and includes.
4. It converts Markdown to HTML with kramdown.
5. It wraps the result in the selected layout.
6. It writes the final HTML into the generated site.

That order matters. For example, when a post sets `math: true`, the post body is rendered as usual, but the global layout also includes the MathJax loader because `_includes/math.html` checks `page.math`. When a post sets `image`, the post layout uses it as a cover image, and the head include can reuse the same value for Open Graph and Twitter preview metadata. When a post sets `toc: true`, the post layout exposes mobile and desktop table-of-contents areas that can be populated by the TOC include.

> **Tip:** Treat front matter as a post-level API. The Markdown body should hold the content; front matter should describe how the template should present that content.

## Layout fields

Layout fields determine which template wraps the content and how the page is positioned inside the site.

{% include table-caption.html
   caption="Layout-related front matter fields."
   id="tbl-layout-fields"
%}

| Field | Type | Default | Used by | What it does |
|:---|:---|:---|:---|:---|
| `layout` | string | `post` for posts, `default` globally | `_layouts/*.html` | Selects the layout that wraps the page content. |
| `permalink` | string | Site permalink pattern | Jekyll routing | Overrides the generated URL for a specific page or post. |
| `title` | string | none | Post, page, head, cards | Main page title and browser/social title. |
| `subtitle` | string | none | Post and page headers | Optional supporting text below the title. |
{: .c-prose-table }

For normal posts, the most important layout field is `title`. The post layout renders it as the main `h1`, while the head include uses it for the document title and social metadata. `subtitle` is optional, but it is useful for documentation posts because it clarifies scope without making the title too long.

Use `layout` only when you want to override the default. For example, a static About page uses `layout: page`, while the homepage uses `layout: homepage`. A post can rely on the default `post` layout unless you are testing another layout.

```yaml
---
layout: post
title: "Building a Token-Bucket Rate Limiter"
subtitle: "Design, implementation, and benchmarks in Python and Go"
---
```

> **Warning:** Do not use `layout: default` for long-form posts. The default layout only provides the site shell. The `post` layout adds the post header, tags, metadata row, optional cover image, TOC placement, post navigation, and related posts.

## SEO and social preview fields

SEO fields help the page appear correctly in search engines, feeds, and social previews. The template centralizes this behavior in the head include, so most pages only need a good `title`, `description`, and optional `image`.

{% include table-caption.html
   caption="SEO and social preview front matter fields."
   id="tbl-seo-fields"
%}

| Field | Type | Default | Used by | What it does |
| :--- | :--- | :--- | :--- | :--- |
| `title` | string | Site title fallback | `<title>`, Open Graph, Twitter | Defines the page title. |
| `description` | string | `site.description` | Meta description, Open Graph, Twitter | Short summary for search and previews. |
| `image` | string | `site.default_og_image` or placeholder | Post cover, Open Graph, Twitter | Preview image and optional post cover. |
| `image_alt` | string | `page.title` | Post/page image alt text | Accessible text for the cover or page image. |
{: .c-prose-table }

A strong `description` should be specific, concise, and readable outside the page context. Aim for one sentence. Avoid keyword lists. Good descriptions explain what the reader will learn.

```yaml
description: "A complete reference guide for all supported front matter fields in this Jekyll template."
```

The `image` field has two roles. In the post layout, it renders a full-width cover image above the article header. In the head include, it becomes the social preview image. That makes it powerful, but it also means you should use it intentionally. If you want a header-only documentation post, omit `image`.

```yaml
image: "assets/images/posts/template-design.jpg"
image_alt: "A clean website layout showing cards, typography, and navigation"
```

> **Note:** This post intentionally has no `image` field. That tests the header-only post layout and keeps the reference guide focused on text, tables, and code blocks.

## Display fields

Display fields control what appears in the post header and archive cards. They do not usually change the body content, but they strongly affect navigation and scanning.

{% include table-caption.html
   caption="Display and metadata front matter fields."
   id="tbl-display-fields"
%}

| Field | Type | Default | Used by | What it does |
| :--- | :--- | :--- | :--- | :--- |
| `tags` | array | none | Post header, project archive, tag pages | Groups posts and creates tag navigation. |
| `author` | string | template-dependent | Entry metadata | Displays one author when metadata includes it. |
| `authors` | array | template-dependent | Entry metadata | Displays multiple authors when supported. |
| `avatar` | string | none | Entry metadata | Optional author image in post metadata. |
| `date` | date | Filename date for posts | Entry metadata, ordering | Controls publication date and post sorting. |
{: .c-prose-table }


Tags are especially important in this template because the Projects page groups content around posts, cards, and tag archives. Use a small, consistent set of tags. For example, prefer `technical-writing` everywhere instead of mixing `technical-writing`, `tech-writing`, and `docs`.

```yaml
tags: [documentation, jekyll, reference, technical-writing]
```

The post date usually comes from the filename. A file named `2026-02-18-jekyll-front-matter-guide.md` automatically has the date February 18, 2026. You can still set `date` manually if you need a specific time, but the filename is cleaner for most posts.

```yaml
date: 2026-02-18 09:00:00 -0500
```

> **Tip:** Keep tags lowercase and hyphenated. They become part of tag archive URLs, so `technical-writing` is more predictable than `Technical Writing`.

## Feature fields

Feature fields are boolean switches. They turn optional behavior on or off for a single page.

{% include table-caption.html
   caption="Feature-toggle front matter fields."
   id="tbl-feature-fields"
%}

| Field | Type | Default | Used by | What it does |
| :--- | :--- | :--- | :--- | :--- |
| `toc` | boolean | none/false | Post TOC includes | Enables the table of contents experience for long posts. |
| `math` | boolean | false | `_includes/math.html` | Loads MathJax only on pages that need LaTeX math. |
| `share` | boolean | true for posts | Post header | Shows or hides the share controls. |
| `read_time` | boolean | include-dependent | Entry metadata | Can be used to show or suppress reading-time metadata if supported. |
{: .c-prose-table }

Use `toc: true` for long posts with several headings. The post layout includes mobile and desktop TOC wrappers, so a long technical article can remain navigable on both wide and narrow screens. This is especially useful for documentation, architecture notes, and tutorials.

```yaml
toc: true
```

Use `math: true` only when the post contains LaTeX-style math. The MathJax include is guarded by `page.math`, so leaving it off avoids loading a third-party script unnecessarily.

```yaml
math: true
```

Use `share: false` when sharing controls would be distracting or unnecessary. For example, a private test post, internal reference page, or draft-style note might not need them.

```yaml
share: false
```

> **Warning:** Do not enable `math: true` globally unless almost every page uses math. Conditional loading is better for performance and keeps simple posts simple.

## Supported fields by content type

Different content types need different front matter. A short page, a long documentation post, and a visual project should not all use the same fields.

{% include table-caption.html
   caption="Recommended fields by content type."
   id="tbl-content-types"
%}

| Content type | Recommended fields | Usually omit |
|:---|:---|:---|
| Short static page | `layout`, `title`, `permalink`, `description` | `toc`, `math`, `image` |
| Documentation post | `title`, `subtitle`, `tags`, `toc`, `description` | `image` unless visual |
| Math-heavy post | `title`, `tags`, `math`, `toc`, `description` | `image` if not needed |
| Visual project | `title`, `subtitle`, `tags`, `image`, `image_alt`, `description` | `math` |
| Private/dev test | `title`, `tags`, `share: false` | `image`, `math` |
{: .c-prose-table }

The best front matter is not the longest. It is the smallest set of fields that accurately describes the content and activates the features the post needs.

## Creating your first post

Follow this process when adding a new post to the template.

1. Create a new Markdown file in `_posts/`.

   ```text
   _posts/2026-02-18-jekyll-front-matter-guide.md
   ```

2. Add the required front matter.

   ```yaml
   ---
   title: "Front Matter Field Reference"
   subtitle: "Every supported key, what it does, and when to use it"
   tags: [documentation, jekyll, reference, technical-writing]
   toc: true
   description: "A complete reference guide for all supported front matter fields in this Jekyll template."
   ---
   ```

3. Write a clear opening paragraph before the first heading.

   This gives readers context immediately and keeps the post card description from doing all the explanatory work.

4. Add headings in a logical order.

   Use `##` for major sections and `###` for subsections. A table of contents is only helpful when the heading structure is clean.

5. Add tables, code blocks, or callouts where they help the reader.

   Use tables for reference material, fenced code blocks for examples, and blockquotes for notes or warnings.

6. Run the site locally.

   ```bash
   bundle exec jekyll serve
   ```

7. Check the generated page on desktop and mobile.

   Confirm that the title, subtitle, tags, metadata, TOC, and body spacing all look correct.

8. Commit the post.

   ```bash
   git add _posts/2026-02-18-jekyll-front-matter-guide.md
   git commit -m "Add front matter reference guide"
   ```

## Minimal vs full front matter

Use the minimal version for ordinary posts. Use the full version when you need every major feature.

{% include table-caption.html
   caption="Minimal vs full front matter."
   id="tbl-minimal-full-front"
%}

| Minimal front matter | Full front matter |
| :--- | :--- |
| Good for short posts, notes, and simple project updates. | Good for polished long-form posts with custom metadata and feature toggles. |
{: .c-prose-table }

Minimal:

```yaml
---
title: "A Short Project Note"
tags: [projects, notes]
description: "A short update about a recent project."
---
```

Full:

```yaml
---
layout: post
title: "Design Philosophy and Architecture of Eyvan"
subtitle: "How the template is structured and why it was built this way"
tags: [meta, design, jekyll, css, architecture]
date: 2026-03-12 09:00:00 -0500
toc: true
math: false
share: true
image: "assets/images/posts/template-design.jpg"
image_alt: "A minimalist portfolio website shown on a laptop"
description: "A behind-the-scenes look at the design decisions, CSS architecture, layout system, and feature set of this template."
---
```

The minimal version relies on defaults. The full version is more explicit. Both are valid, but the minimal version is easier to maintain when the defaults already match your intent.

## Markdown examples

Use inline code when referring to field names such as `title`, `subtitle`, `tags`, `toc`, and `description`. Use fenced YAML blocks when showing complete front matter examples. This keeps the writing scannable and makes the post useful as a reference.

For tables, use the table caption include before the Markdown table:

{% raw %}
```liquid
{% include table-caption.html
   caption="A short caption for the table."
   id="tbl-example"
%}

| Field | Purpose |
| :--- | :--- |
| `title` | Main title |
| `description` | SEO summary |
```
{% endraw %}

For figures, use the figure include instead of hand-writing image markup:

{% raw %}
```liquid
{% include figure.html
   src="/assets/images/posts/example.webp"
   alt="Example interface screenshot"
   caption="A reusable image figure with an optional numbered caption."
   id="fig-example"
%}
```
{% endraw %}

For cross-references, use the reference include:

{% raw %}
```liquid
See {% include ref.html id="tbl-feature-fields" cref="true" %} for the feature toggles.
```
{% endraw %}

These includes keep captions, numbering, layout classes, and accessibility behavior centralized.

> **Tip:** If you are writing a post that explains Liquid includes, wrap example include tags in `{% raw %}` and `{% endraw %}` so Jekyll displays the example instead of executing it.

## Troubleshooting

{% include table-caption.html
   caption="Common front matter problems and fixes."
   id="tbl-troubleshooting"
%}

| Problem | Likely cause | Fix |
| :--- | :--- | :--- |
| The page renders without the post layout | Missing front matter or wrong collection | Ensure the file starts with `---` and lives in `_posts/`. |
| The title does not appear correctly | Missing or malformed `title` | Use a quoted string: `title: "My Post Title"`. |
| Tags do not appear | `tags` is not an array | Use `tags: [jekyll, documentation]`. |
| TOC does not show | `toc` missing, false, or headings are not structured | Add `toc: true` and use clear `##` / `###` headings. |
| Math does not render | `math: true` is missing | Add `math: true` to the post front matter. |
| Social preview image is wrong | `image` missing or path incorrect | Add a valid relative path or configure `default_og_image`. |
| Cover image alt text is generic | `image_alt` missing | Add descriptive `image_alt` text. |
| YAML build error | Bad indentation, colon, or unquoted special character | Quote strings that contain punctuation and keep arrays valid. |
{: .c-prose-table }

YAML is strict about indentation and punctuation. A colon inside an unquoted string can break parsing. When in doubt, quote the value.

```yaml
title: "Front Matter Field Reference: A Practical Guide"
```

Arrays can be written inline:

```yaml
tags: [documentation, jekyll, reference]
```

Or as a block:

```yaml
tags:
  - documentation
  - jekyll
  - reference
```

Both work. Inline arrays are compact and good for short tag lists. Block arrays are easier to read when the list grows.

## Recommended front matter pattern

For most long-form posts in this template, start with this pattern:

```yaml
---
title: "Clear, Specific Title"
subtitle: "Optional sentence that explains the angle"
tags: [primary-topic, secondary-topic, format]
toc: true
description: "One concise sentence explaining what the reader will learn."
---
```

Add `image` and `image_alt` only when the post needs a cover or social preview image. Add `math: true` only when the post contains math. Add `share: false` only when you intentionally want to suppress the share controls.

This approach keeps the content clean, the build predictable, and the template easy to maintain. The front matter stays small, but each key has a real job: `title` identifies the post, `subtitle` frames it, `tags` connect it to the archive, `toc` improves navigation, and `description` supports search and previews.

Front matter is not just metadata. In this Jekyll template, it is the control panel for each page. Used consistently, it lets you publish documentation, project write-ups, visual essays, and technical tutorials without changing the layout code every time.

## Endnotes

[^1]: The diagram was generated with Google's Gemini for illustrative purposes by the author using the contents of this post as the generation prompt.