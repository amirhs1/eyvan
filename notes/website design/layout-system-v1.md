
# SITE LAYOUT SYSTEM

Hybrid Editorial + Research Portfolio Architecture

## 1. Core Page Types

### 1.1 Homepage

Purpose:

- Showcase featured research/projects
- Provide conceptual positioning
- Drive navigation deeper into site

### 1.2 Webpage (Post / Project / About)

Purpose:

- Long-form reading
- Documentation
- Case study / research presentation

### 1.3 Navigation

- Navigation have three options: Home, About Me, Portfolio/Resume, Projects/Blog, Publications.
- CV, resume, or Portfolio is located in the About me webpage.
- Projects contains everything: posts, code snippets, videos, Jupyter notebooks, etc.
- For large screens, the nav is simple; a list of keywords.
- For tablet and mobile screens the navigation is in the form of an overlay hamburger menu.

## 2. Desktop Layout (≥ Large Screens)

### 2.1 Homepage

```text
+--------------------------------------------------------------------+
| LOGO                                      NAV: Home  Work  About   |
+--------------------------------------------------------------------+
| HERO: Title / Subtitle / Primary CTA                               |
+-----------------------------------------+--------------------------+
| MAIN (HYBRID STREAM)                    | ASIDE / SIDEBAR          |
|                                         |                          |
|  +-----------------------------------+  |  - About Blurb           |
|  | [ FEATURE IMAGE ]                 |  |                          |
|  |                                   |  |  - Category Filters      |
|  |   Title of Project 1              |  |    [All] [Design] [Tech] |
|  |   Compelling excerpt text that    |  |                          |
|  |   bridges the gap between a       |  |  - Newsletter Signup     |
|  |   headline and full content.      |  |    [ Email Address ]     |
|  |   [ CTA BUTTON ]                  |  |    [ Subscribe ]         |
|  +-----------------------------------+  |                          |
|                                         |  - Popular Tags          |
|  +-----------------------------------+  |                          |
|  |                [ FEATURE IMAGE ]  |  |                          |
|  |                                   |  |                          |
|  |   Title of Project 2              |  |                          |
|  |   By alternating the image side,  |  |                          |
|  |   you create a "Z-Pattern" that   |  |                          |
|  |   keeps the eye moving.           |  |                          |
|  |   [ CTA BUTTON ]                  |  |                          |
|  +-----------------------------------+  |                          |
|                                         |                          |
|  Review / Secondary Content (Grid)      |                          |
|  +-------------+  +-------------+       |                          |
|  | Small Card  |  | Small Card  |       |                          |
|  | (Quick hit) |  | (Quick hit) |       |                          |
|  +-------------+  +-------------+       |                          |
|                                         |                          |
+-----------------------------------------+--------------------------+
| FOOTER: Links | Copyright | Socials | Accessibility                |
+--------------------------------------------------------------------+
```

Layout Rules:

- Two-column grid (Main + Sidebar)
- Alternating project cards (Z-pattern)
- Sidebar always visible

### 2.2 Webpage (Post / Project)

```text
+--------------------------------------------------------------------+
| LOGO                                      NAV: Home  Work  About   |
+--------------------------------------------------------------------+
| HERO: Page Title / Subtitle / Breadcrumbs                          |
+-----------------------------------------+--------------------------+
| MAIN CONTENT AREA (Reading Flow)        | ASIDE / SIDEBAR          |
|                                         |                          |
|  Paragraph of introduction text starts  |  - Author / Bio          |
|  here. It establishes the context of    |    [ Photo ]             |
|  the page.                              |                          |
|                                         |  - Table of Contents     |
|  <h2> Section Header </h2>              |    1. Intro              |
|                                         |    2. Process            |
|  Paragraph of text elaborating on the   |    3. Result             |
|  point.                                 |                          |
|                                         |  - Related Projects      |
|  [ FULL WIDTH IMAGE / MEDIA ]           |    [ Link 1 ]            |
|                                         |    [ Link 2 ]            |
|  <blockquote>                           |                          |
|     "A pull quote to break up the       |  - Social Share          |
|      text visual hierarchy."            |    [ Icons ]             |
|  </blockquote>                          |                          |
|                                         |  - Newsletter Box        |
|  Paragraph of text continuing the       |                          |
|  narrative flow.                        |                          |
|                                         |                          |
|  [ CTA: Contact / Next Project ]        |                          |
|                                         |                          |
+-----------------------------------------+--------------------------+
| FOOTER: Links | Copyright | Accessibility | Privacy Policy         |
+--------------------------------------------------------------------+
```

Layout Rules:

- Content column optimized for readability
- Sidebar supports contextual metadata

## 3. Tablet Layout (Medium Screens)

Navigation:
LOGO + Hamburger (Overlay Menu)

### 3.1 Homepage

```text
+-------------------------------------------------------+
| LOGO                                         [≡] MENU |
+-------------------------------------------------------+
| HERO SECTION                                          |
| Title of the Site / Major Call to Action              |
| [ BUTTON ]                                            |
+-------------------------------------------------------+
| MAIN STREAM (Single Column, Wide Cards)               |
|                                                       |
|  +-------------------------------------------------+  |
|  | [ LARGE FEATURE IMAGE 1 ]                       |  |
|  +-------------------------------------------------+  |
|  | Title of Project 1                              |  |
|  | Summary text that introduces the project...     |  |
|  | [ READ MORE ]                                   |  |
|  +-------------------------------------------------+  |
|                                                       |
|  +-------------------------------------------------+  |
|  | [ LARGE FEATURE IMAGE 2 ]                       |  |
|  +-------------------------------------------------+  |
|  | Title of Project 2                              |  |
|  | Summary text that introduces the project...     |  |
|  | [ READ MORE ]                                   |  |
|  +-------------------------------------------------+  |
|                                                       |
|  SECONDARY GRID (2 Columns for smaller items)         |
|  +-----------------------+ +-----------------------+  |
|  | [ Small Card 3 ]      | | [ Small Card 4 ]      |  |
|  | Title / Link          | | Title / Link          |  |
|  +-----------------------+ +-----------------------+  |
|                                                       |
|  [ OPTIONAL: Newsletter Signup Block ]                |
+-------------------------------------------------------+
| FOOTER: Navigation Links | Social Icons | Copyright   |
+-------------------------------------------------------+
```

Layout Rules:

- Sidebar removed as column
- Secondary content moves below main
- Two-column mini grid allowed

## 3.2 Tablet Webpage

```text
+-------------------------------------------------------+
| LOGO                                         [≡] MENU |
+-------------------------------------------------------+
| HERO: Title / Metadata                                |
+-------------------------------------------------------+
| MAIN CONTENT BODY                                     |
| Full width reading area                               |
| [ Large Image ]                                       |
| Pull Quote                                            |
| CTA Button                                            |
+-------------------------------------------------------+
| SECONDARY CONTENT (Former Sidebar)                    |
| Author Bio | Related Links                            |
+-------------------------------------------------------+
| FOOTER                                                |
+-------------------------------------------------------+
```

Layout Rules:

- Reading prioritized
- Sidebar content becomes block section beneath article

## 4. Mobile Layout (Small Screens)

Navigation:
LOGO + Hamburger (Overlay Menu)

### 4.1 Mobile Homepage

```text
+--------------------------------------+
| LOGO                        [≡] MENU |
+--------------------------------------+
| HERO SECTION                         |
+--------------------------------------+
| PROJECT CARD (Stacked)               |
| [ IMAGE ]                            |
| Title                                |
| Summary                              |
| CTA                                  |
+--------------------------------------+
| Small Card (Stacked)                 |
+--------------------------------------+
| Newsletter (Optional)                |
+--------------------------------------+
| FOOTER                               |
+--------------------------------------+
```

Layout Rules:

- Fully stacked layout
- No sidebar column
- Content blocks become linear sections

### 4.2 Mobile Webpage

```text
+--------------------------------------+
| LOGO                        [≡] MENU |
+--------------------------------------+
| HERO                                |
+--------------------------------------+
| MAIN CONTENT                        |
| Paragraph text                      |
| Image                               |
| Subhead                             |
| Pull Quote                          |
| CTA                                 |
+--------------------------------------+
| RELATED / ASIDE (Stacked)           |
| Author Bio                          |
| Newsletter                          |
| Related Links                       |
+--------------------------------------+
| FOOTER                              |
+--------------------------------------+
```

Layout Rules:

- Maximum readability
- Generous spacing
- Secondary blocks stacked after content

## 5. Navigation Behavior Across Devices

Mobile   → LOGO + Hamburger (Overlay)
Tablet   → LOGO + Hamburger (Side Drawer)
Desktop  → LOGO + Full Navigation Links

## 6. System Principles

1. Editorial clarity over visual noise
2. Responsive first (mobile → desktop enhancement)
3. Reusable components across page types
4. Sidebar transforms, never disappears
5. Image-led but typography-driven
