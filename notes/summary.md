Perfect 👍
Below is a clean, copy-pasteable summary of what we decided, why, and what remains to be discussed later, written specifically so you can drop it into a new chat and immediately continue.
This assumes Approach A: GitHub Pages template throughout.



1) Ionicons → SVG icons only (DONE, pending deeper discussion)

What we decided
	•	Do not load Ionicons via CDN or icon font.
	•	Use SVG icons only, downloaded individually.
	•	Only keep icons actually used:
	•	GitHub
	•	LinkedIn
	•	Instagram
	•	Twitter
	•	RSS
	•	Email
	•	Menu (hamburger)

Current setup
	•	SVG icons stored in:

assets/icons/


	•	Ionicons CDN link removed from head.html.

Why
	•	Smaller payload (no unused icons).
	•	Better accessibility.
	•	No external dependencies.
	•	Ideal for a reusable GitHub Pages template.

To discuss next
	•	SVG usage strategy:
	•	Inline SVG vs <use> sprite
	•	_includes/icon.html API design
	•	Styling icons via CSS (size, color, hover)
	•	Accessibility conventions (aria-hidden, title, role)

⸻

3) Favicon setup (DONE, pending refinement)

What we decided
	•	Add favicon support now, branding can change later.
	•	Use PNG favicons (multiple colors).
	•	Files stored in:

assets/favicon/



Current status
	•	Relevant <link rel="icon"> lines added to head.html.
	•	Multiple color variants exist.

Why
	•	Favicons are required for professional polish.
	•	Browsers and platforms cache them aggressively.
	•	Easy to replace later without changing structure.

To discuss next
	•	Final favicon strategy:
	•	Sizes (16x16, 32x32, 180x180)
	•	Mask icon / theme color
	•	Whether to add a monochrome SVG favicon.
	•	Naming conventions for template users.

⸻

4) Social preview meta tags (DONE)

What we decided
	•	Add Open Graph + Twitter meta tags.
	•	Use Liquid fallbacks:
	•	page.title → site.title
	•	page.description → site.description
	•	Include optional og:image.

Current status
	•	Meta tags added to:
	•	head.html
	•	header.html (where appropriate)
	•	Required variables added to _config.yml.

Why
	•	Correct previews on Twitter, LinkedIn, Slack, etc.
	•	Essential for blogs, portfolios, and research sites.
	•	Centralized and reusable for a template.

To discuss next
	•	Per-page social images via front matter.
	•	Default OG image generation strategy.
	•	Art vs science preview styling (if needed).

⸻

5) <title> formatting improvement (DONE)

What we changed
	•	Title format changed from:

Page Title · Site Title


	•	Replaced . with | as separator.

Why
	•	Cleaner visual separation in browser tabs.
	•	Common convention for technical / academic sites.
	•	Purely stylistic choice, SEO-neutral.

Current status
	•	Updated in head.html.

⸻

6) Dark/Light mode + Art/Science palettes (NOT IMPLEMENTED YET)

What we agreed conceptually
	•	Theme (art/science) and mode (light/dark) are separate concerns.
	•	Do not hardcode palette or mode in _config.yml.
	•	Do not generate multiple CSS files.

Planned architecture
	•	Use CSS custom properties for colors.
	•	Use:
	•	data-theme="light|dark"
	•	data-palette="art|science"
	•	Default mode from OS (prefers-color-scheme).
	•	Optional user toggle (persisted in localStorage).
	•	Palette chosen via front matter or site default.

Why
	•	Scales cleanly for templates.
	•	Avoids duplication and CSS bloat.
	•	Matches modern design system practices.

To discuss next
	•	Final structure of _sass/0-settings/colors.scss.
	•	Mapping your existing 4 palette files into tokens.
	•	HTML attribute placement (<html> vs <body>).
	•	Header UI for toggling mode (and maybe palette).

⸻

Overall philosophy we aligned on
	•	Template-first design
	•	No external runtime dependencies
	•	Explicit, documented architecture
	•	Separation of:
	•	Content
	•	Theme
	•	Mode
	•	Assets
	•	GitHub Pages–safe, but portable anywhere

⸻

When you open the new chat, you can start with something like:

“Here’s a summary of where we left off. I want to continue with point X.”

and we’ll pick up exactly where you want, no rework needed.