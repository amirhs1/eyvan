# SITE LAYOUT SYSTEM

Minimalist Research + Artist Portfolio Architecture

## 1. Core Page Types

### 1.1 Homepage

Purpose:

* Introduce the person behind the work
* Provide conceptual positioning (research + artistic practice)
* Offer immediate access to CV and projects
* Showcase selected work

Key Elements:

* Hero introduction
* Primary actions (View Projects / Download CV)
* Featured projects
* Social links

### 1.2 Webpage (Project / Post / Publication)

Purpose:

* Long-form reading
* Research documentation
* Case study or artistic project presentation
* Publication or essay presentation

Characteristics:

* Single reading column
* Media integrated into narrative
* Clear typographic hierarchy
* Minimal distractions

### 1.3 Navigation

Navigation contains only **three items**:

```text
Home
About
Projects
```

Design Rules:

* Minimal navigation to reduce cognitive load
* No secondary navigation bars
* No sidebar navigation
* Clear hierarchy between pages

Navigation Behavior:

Desktop:

```text
LOGO + Horizontal navigation
```

Tablet & Mobile:

```text
LOGO + Hamburger Menu (Overlay Navigation)
```

## 2. Content Organization

### 2.1 About Page

Purpose:

* Provide background and context
* Present professional and artistic identity
* Offer downloadable materials

Content:

* Portrait or profile image
* Short biography
* Research interests or artistic statement
* CV / Resume download
* Optional portfolio download

The CV **is not a navigation item** but is accessible via:

* Hero CTA on homepage
* Download link on About page

The About page provides **context about the person behind the work**.

It should answer:

* Who are you?
* What do you research or create?
* What is your background?
* How can someone contact you?

It also hosts **downloadable documents** like:

* CV
* resume
* portfolio PDF

### 2.2 Projects Page

Purpose:

* Central archive of work
* Host all creative and research output

Projects include:

* Research projects
* Artistic works
* Publications
* Essays or blog posts
* Code snippets
* Jupyter notebooks
* Media documentation

Filtering System:

```text
All | Research | Art | Writing | Publications
```

Content Structure:

* Tag filter bar
* Grid of project cards
* Each card links to a full project page

### 2.3 Project / Post Page Layout

Project pages include posts, research documentation, blog entries, Jupyter notebooks, publications, etc Project pages are designed for **long-form reading and documentation**.

They should support:

* research explanations
* artistic documentation
* technical walkthroughs
* essays or blog posts
* embedded media (video, images, notebooks)

Key Design Principles:

* Single-column reading flow
* No sidebar
* Content-driven layout
* Media integrated into narrative

Project pages may contain:

* paragraphs
* images
* figure captions
* block quotes
* video embeds
* code blocks
* Jupyter notebook output
* diagrams
* tables

Example content sequence:

```text
Intro
↓
Context
↓
Process
↓
Documentation (images/video/code)
↓
Results / Reflection
```

This works well for **research documentation and artistic process writing**.

## 3. Desktop Layout (Large Screens)

### 3.1 Homepage

```text
+--------------------------------------------------------------------+
| [LOGO]                       NAV: Home   About   Projects          |
+--------------------------------------------------------------------+
|                                                                    |
|  HERO SECTION (Full Width)                                         |
|                                                                    |
|  [ Name / Title ]                                                  |
|  Short 2–3 sentence bio describing research focus or artistic work|
|                                                                    |
|  [ View Projects ]   [ Download CV ]                               |
|                                                                    |
|  Social Links: LinkedIn  GitHub  Instagram                         |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
|  FEATURED PROJECTS                                                 |
|                                                                    |
|  +-------------------+  +-------------------+  +------------------+|
|  | Project Card      |  | Project Card      |  | Project Card     ||
|  | Image             |  | Image             |  | Image            ||
|  | Time to Read Tags |  | Time to Read Tags |  | Time to Read Tags||
|  | Title             |  | Title             |  | Title            ||
|  | Short Summary     |  | Short Summary     |  | Short Summary    ||
|  +-------------------+  +-------------------+  +------------------+|
|  +-------------------+  +-------------------+  +------------------+|
|  | Project Card      |  | Project Card      |  | Project Card     ||
|  | Image             |  | Image             |  | Image            ||
|  | Time to Read Tags |  | Time to Read Tags |  | Time to Read Tags||
|  | Title             |  | Title             |  | Title            ||
|  | Short Summary     |  | Short Summary     |  | Short Summary    ||
|  +-------------------+  +-------------------+  +------------------+|
|                                                                    |
+--------------------------------------------------------------------+
| FOOTER                                                             |
| Email | LinkedIn | GitHub | Last Updated                           |
+--------------------------------------------------------------------+
```

Layout Rules:

* Single-column structure
* No sidebar
* Work visible quickly
* Hero establishes identity and purpose

### 3.2 Projects Page

```text
+--------------------------------------------------------------------+
| [LOGO]                       NAV: Home   About   Projects          |
+--------------------------------------------------------------------+
|                                                                    |
| TAG FILTER BAR                                                     |
|                                                                    |
| All | Research | Art | Writing | Publications                      |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
| PROJECT GRID (Responsive Grid)                                     |
|                                                                    |
| +-------------------+  +-------------------+  +------------------+ |
| | Project Card      |  | Project Card      |  | Project Card     | |
| | Image             |  | Image             |  | Image            | |
| | Time to Read Tags |  | Time to Read Tags |  | Time to Read Tags| |
| | Title             |  | Title             |  | Title            | |
| | One-line summary  |  | One-line summary  |  | One-line summary | |
| +-------------------+  +-------------------+  +------------------+ |
|                                                                    |
+--------------------------------------------------------------------+
| FOOTER                                                             |
+--------------------------------------------------------------------+
```

Layout Rules:

* Grid-based visual browsing
* Cards prioritized over long excerpts
* Tags used for filtering rather than navigation categories

### 3.3 Project / Post Page Layout

```text
+--------------------------------------------------------------------+
| [LOGO]                      NAV: Home   About   Projects           |
+--------------------------------------------------------------------+
| HERO / PAGE HEADER                                                 |
|                                                                    |
|  Title of Project / Post                                           |
|  Short subtitle or context line                                    |
|                                                                    |
|  Metadata: Date | Tags | Read Time                                 |
+--------------------------------------------------------------------+
|                                                                    |
| MAIN CONTENT (Single Reading Column)                               |
|                                                                    |
|  Paragraph introducing the project or article.                     |
|                                                                    |
|  <h2> Section Header </h2>                                         |
|                                                                    |
|  Text explaining the concept, research process, or narrative.      |
|                                                                    |
|  [ FULL WIDTH IMAGE / MEDIA ]                                      |
|                                                                    |
|  Caption describing the image or documentation.                    |
|                                                                    |
|  <blockquote>                                                      |
|    Pull quote or key insight that breaks visual rhythm.            |
|  </blockquote>                                                     |
|                                                                    |
|  <h2> Method / Process </h2>                                        |
|                                                                    |
|  Explanation of workflow, methodology, or artistic process.        |
|                                                                    |
|  [ CODE BLOCK / JUPYTER OUTPUT / VIDEO ]                           |
|                                                                    |
|  <h2> Results / Reflection </h2>                                    |
|                                                                    |
|  Discussion of findings, outcomes, or conceptual implications.     |
|                                                                    |
+--------------------------------------------------------------------+
| RELATED PROJECTS (Optional Grid)                                   |
|                                                                    |
|  +-------------------+  +-------------------+  +------------------+ |
|  | Related Project   |  | Related Project   |  | Related Project  | |
|  +-------------------+  +-------------------+  +------------------+ |
|                                                                    |
+--------------------------------------------------------------------+
| FOOTER                                                             |
| Email | GitHub | LinkedIn | Last Updated                           |
+--------------------------------------------------------------------+
```

Layout Rules:

* Maximum readable width (~65–75 characters per line)
* Images span the content column
* Media breaks text rhythm
* Code blocks supported for technical content

### 3.4 About Page

```text
+--------------------------------------------------------------------+
| [LOGO]                      NAV: Home   About   Projects           |
+--------------------------------------------------------------------+
| PAGE HEADER                                                        |
|                                                                    |
| About                                                              |
|                                                                    |
+--------------------------------------------------------------------+
|                                                                    |
| ABOUT CONTENT                                                      |
|                                                                    |
| +----------------------+   +------------------------------------+ |
| |                      |   | Short biography describing         | |
| |  PROFILE IMAGE      |   | research interests, artistic       | |
| |                      |   | practice, and conceptual focus.   | |
| |                      |   |                                    | |
| |                      |   |                                    | |
| +----------------------+   +------------------------------------+ |
|                                                                    |
| Research Interests / Practice Areas                                |
|                                                                    |
| - Topic 1                                                          |
| - Topic 2                                                          |
| - Topic 3                                                          |
|                                                                    |
| Downloadable Documents                                             |
|                                                                    |
| [ Download CV ]   [ Download Resume ]                              |
|                                                                    |
| Contact                                                            |
| Email | LinkedIn | GitHub                                          |
|                                                                    |
+--------------------------------------------------------------------+
| FOOTER                                                             |
+--------------------------------------------------------------------+
```

Layout Rules:

* Two-column section for portrait + bio
* Remaining content single column
* Clear access to CV download

## 4. Tablet Layout (Medium Screens)

Navigation:

```text
LOGO + Hamburger Menu
```

### 4.1 Homepage

```text
+-------------------------------------------------------+
| LOGO                                         [≡] MENU |
+-------------------------------------------------------+
| HERO SECTION                                          |
| Name / Short Bio                                      |
| [ View Projects ]                                     |
| [ Download CV ]                                       |
+-------------------------------------------------------+
| FEATURED PROJECTS (Responsive Grid)                   |
|                                                       |
| +-------------------+  +-------------------+          |
| | Project Card      |  | Project Card      |          |
| | Image             |  | Image             |          |
| | Time to Read Tags |  | Time to Read Tags |          |
| | Title             |  | Title             |          |
| | One-line summary  |  | One-line summary  |          |
| +-------------------+  +-------------------+          |
|                                                       |
+-------------------------------------------------------+
| FOOTER                                                |
+-------------------------------------------------------+
```

Layout Rules:

* Two-column grid allowed
* Hero still dominant
* No sidebar

### 4.2 Project / Post Page Layout

```text
+-------------------------------------------------------+
| LOGO                                         [≡] MENU |
+-------------------------------------------------------+
| TITLE / METADATA                                      |
+-------------------------------------------------------+
| MAIN CONTENT                                          |
| Paragraph                                             |
| Image                                                 |
| Section Header                                        |
| Code Block                                            |
| Video                                                 |
+-------------------------------------------------------+
| RELATED PROJECTS                                      |
+-------------------------------------------------------+
| FOOTER                                                |
+-------------------------------------------------------+
```

Layout Rules:

* Full-width reading column
* Media scales responsively
* No secondary columns

### 4.3 About Page

```text
+-------------------------------------------------------+
| LOGO                                         [≡] MENU |
+-------------------------------------------------------+
| ABOUT PAGE TITLE                                      |
+-------------------------------------------------------+
| PROFILE IMAGE                                         |
|                                                       |
| Short biography text                                  |
|                                                       |
| Research interests                                    |
|                                                       |
| [ Download CV ]                                       |
|                                                       |
| Contact links                                         |
+-------------------------------------------------------+
| FOOTER                                                |
+-------------------------------------------------------+
```

Layout Rules:

* Image stacked above bio
* Clear reading flow

## 5. Mobile Layout (Small Screens)

Navigation:

```text
LOGO + Hamburger Menu
```

## 5.1 Mobile Homepage

```text
+--------------------------------------+
| LOGO                        [≡] MENU |
+--------------------------------------+
| HERO                                |
| Name                                |
| Short Bio                           |
| [ View Projects ]                   |
| [ Download CV ]                     |
+--------------------------------------+
| PROJECT CARD (Stacked)              |
| [ Image ]                           |
| Time to Read                 Tag(s) |
| Title                               |
| One-line summary                    |
| CTA                                 |
+--------------------------------------+
| FOOTER                              |
+--------------------------------------+
```

Layout Rules:

* Fully stacked layout
* Generous spacing
* Easy thumb interaction

### 5.2 Project / Post Page Layout

```text
+--------------------------------------+
| LOGO                        [≡] MENU |
+--------------------------------------+
| TITLE                                |
| Metadata                             |
+--------------------------------------+
| CONTENT                              |
| Paragraph                            |
| Image                                |
| Subhead                              |
| Code                                 |
| Video                                |
+--------------------------------------+
| RELATED PROJECTS                     |
+--------------------------------------+
| FOOTER                               |
+--------------------------------------+
```

Layout Rules:

* Stacked content blocks
* Readability prioritized
* Touch-friendly spacing

### 5.3 About Page

```text
+--------------------------------------+
| LOGO                        [≡] MENU |
+--------------------------------------+
| ABOUT                               |
+--------------------------------------+
| PROFILE IMAGE                       |
|                                     |
| BIOGRAPHY TEXT                      |
|                                     |
| RESEARCH INTERESTS                  |
|                                     |
| [ Download CV ]                     |
|                                     |
| CONTACT LINKS                       |
+--------------------------------------+
| FOOTER                              |
+--------------------------------------+
```

Layout Rules:

* Fully stacked layout
* Simple reading hierarchy

## 6. Page System Summary

The site consists of **three primary page types**:

| Page             | Purpose                                 |
| ---------------- | --------------------------------------- |
| **Home**         | Entry point and featured work           |
| **Projects**     | Archive of research and creative output |
| **Project/Post** | Detailed documentation or article       |
| **About**        | Biography and professional information  |

Navigation remains minimal:

```text
Home
About
Projects
```

## 7. Design Principles

1. Minimal Navigation: Only essential pages appear in the navigation.
2. Single Column Content: No sidebars are used to maintain visual clarity.
3. Work-Centered Design: Projects and research outputs are prioritized visually.
4. Tag-Based Organization: Projects are grouped using tags rather than complex navigation hierarchies.
5. Responsive First: Design adapts smoothly across devices.
6. Clear Entry Points: Hero provides two primary actions:

    ```text
    View Projects
    Download CV
    ```

7. Typography Over Decoration: Clean typography and spacing drive visual hierarchy rather than heavy graphics.
