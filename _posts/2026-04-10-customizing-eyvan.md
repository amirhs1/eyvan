---
title: "Customizing Eyvan"
subtitle: "A practical walkthrough for personalizing the template before your first deploy"
tags: [meta, jekyll, setup, documentation]
image: "assets/images/posts/front-matter-cover.webp"
image_alt: "Minimalist illustration of an Iranian arch framing a code editor with configuration keys"
toc: true
description: "Step-by-step guide to replacing the demo content and making Eyvan your own — from config and data files to assets and posts."
---

> **Note:** This post was written as a practical setup guide shipped with the Eyvan template. Follow it after cloning the repository and running `bundle install` for the first time.

Eyvan ships with demo content — placeholder names, example posts, and sample images — so you can see the template running immediately. This guide walks you through replacing all of it with your own content, in the order that matters. None of this requires touching the templates or SCSS.

The rule of thumb: everything about *who you are* lives in `_data/`. Everything about *how Jekyll behaves* lives in `_config.yml`. Your *posts* live in `_posts/`. Your *images, fonts, and icons* live in `assets/`.

---

## Step 1 — The two required changes

Before anything else, open `_config.yml` and fix these two fields. Until you do, your deployed site will advertise incorrect URLs in canonical tags, Open Graph previews, and the sitemap.

```yaml
url: "https://your-username.github.io"
baseurl: "/your-repository-name"
```

If you are deploying to a **user or organization site** (a repo named `your-username.github.io`), set `baseurl` to an empty string:

```yaml
url: "https://your-username.github.io"
baseurl: ""
```

If you are using a **custom domain**, set `url` to the domain and keep `baseurl` empty:

```yaml
url: "https://yourdomain.com"
baseurl: ""
```

That is all you need to change for a first deploy. Everything else below is about personalizing the content.

---

## Step 2 — Site identity in `_config.yml`

Open `_config.yml` and update the fields under the *Site metadata* section:

```yaml
title: "Your Name or Site Title"
description: "One sentence that describes your site — used in search and social previews."
author: "Your Name"
```

These three values appear in the browser tab title, the SEO `<meta>` description tag, and the default author fallback in post metadata.

### Enabling analytics

If you want Google Analytics, paste your Measurement ID (the string that starts with `G-`) into this field:

```yaml
google_analytics: "G-XXXXXXXXXX"
```

Leave it blank (or remove it) to disable analytics entirely. No tracking request is made when the field is empty.

### Reading time

Reading time is estimated automatically from the word count of each post. Two global knobs control it:

```yaml
read_time: true           # show or hide reading time on posts
words_per_minute: 238     # reading speed used for the estimate
```

Set `read_time: false` to hide the reading-time display site-wide.

---

## Step 3 — Your profile in `_data/author.yml`

This file drives your name, role, biography, avatar, and contact information wherever they appear — the homepage hero, post metadata, and the about page.

```yaml
name: "Your Full Name"
role: "Your Title or Role"
location: "City, Region, Country"

avatar: "assets/images/avatar.webp"
avatar_alt: "A photograph of Your Name"

bio: >-
  A short paragraph about yourself. This appears in the homepage hero
  and any author block the template renders. Markdown is not supported here —
  keep it to plain text.

email: "you@example.com"
```

Replace `assets/images/avatar.webp` with your own portrait (see [Step 7](#step-7--replacing-visual-assets)). The `bio` field supports the YAML block scalar (`>-`) so you can write longer text without escaping quotes.

The file also has optional fields for a CV download link and an ORCID identifier:

```yaml
cv: "assets/files/your-cv.pdf"   # link that appears in the hero actions
orcid: "0000-0000-0000-0000"      # appears if the ORCID social link is enabled
```

---

## Step 4 — Homepage hero in `_data/hero.yml`

The hero section at the top of the homepage is driven entirely by this file. Open it and replace the placeholder text:

```yaml
eyebrow: "Portfolio"               # small label above the headline (optional)
title: "Hello — I'm Your Name"    # main headline
description: >-
  A one or two sentence introduction that appears below the headline.
  This is the first thing visitors read.

image: "assets/images/hero-placeholder.webp"
image_alt: "A photograph or illustration representing you or your work"

actions:
  primary:
    label: "View my work"
    url: "/projects/"
  secondary:
    label: "About me"
    url: "/about/"
```

The `eyebrow` is optional — delete it or leave it blank if you do not want the small label. The `actions` define the two call-to-action buttons in the hero.

---

## Step 5 — Navigation in `_data/navigation.yml`

This file controls the links in the site header and mobile menu. The default ships with four entries:

```yaml
links:
  - title: "Projects"
    url: "/projects/"
  - title: "Writing"
    url: "/projects/"
  - title: "About"
    url: "/about/"
  - title: "CV"
    url: "/assets/files/your-cv.pdf"
    external: true
```

Edit the `title` and `url` for each entry. Set `external: true` on any link that opens outside your site — it will render with `target="_blank"` and a screen-reader label. Remove any entry you do not need. The template renders the nav from this list, so no HTML editing is required.

---

## Step 6 — Social and share links

### `_data/social-links.yml`

Each entry in this file adds an icon link to the social bar in the site header and footer. The shipped demo includes GitHub, LinkedIn, and a few others. To remove a platform, comment out or delete its entry. To add one, follow the pattern:

```yaml
- platform: github
  url: "https://github.com/your-username"
  label: "GitHub profile"

- platform: linkedin
  url: "https://linkedin.com/in/your-profile"
  label: "LinkedIn profile"

- platform: email
  url: "mailto:you@example.com"
  label: "Email me"
```

The `platform` value must match an available icon in `assets/icons/`. Supported platforms out of the box: `github`, `linkedin`, `x`, `instagram`, `youtube`, `pinterest`, `medium`, `discord`, `orcid`, `google_scholar`, `email`, `rss`.

### `_data/share.yml`

Controls which platforms appear in the share bar at the bottom of posts. The structure mirrors `social-links.yml`. Remove entries for platforms you do not want to offer. Most users keep two or three.

---

## Step 7 — Replacing visual assets

All visual assets live under `assets/`. Replace them at the same paths and Eyvan's templates will automatically use your new files.

| Asset | Path | Recommended size | Used for |
|:------|:-----|:-----------------|:---------|
| Avatar | `assets/images/avatar.webp` | 300 × 300 px | Hero, post meta |
| Hero image | `assets/images/hero-placeholder.webp` | 800 × 800 px or similar | Homepage hero |
| Logo | `assets/images/logo.webp` | 512 × 512 px | Header logo mark |
| OG fallback | `assets/images/og-default.webp` | 1200 × 630 px | Social previews on posts without a cover |
| Favicon | `assets/favicon/favicon.ico` + PNG variants | Per standard sizes | Browser tab, bookmarks |
{: .c-prose-table}

Use **WebP** for photos and illustrations to keep file sizes small. For the OG image, a 1200 × 630 px WebP at quality 80 is the recommended target — it is the size Facebook, X, and LinkedIn expect.

If you already have images in JPEG or PNG, you can convert them with `cwebp` (part of the `webp` package):

```bash
cwebp -q 80 -resize 300 0 your-avatar.jpg -o assets/images/avatar.webp
```

---

## Step 8 — Replacing demo posts

The `_posts/` directory ships with demo content written to showcase the template. Replace it with your own writing before publishing.

The simplest workflow:

1. Delete the demo posts you do not want (or move them out of `_posts/`).
2. Create a new file following the naming pattern: `_posts/YYYY-MM-DD-your-post-slug.md`.
3. Add front matter at the top (see the *Front Matter Field Reference* post for all options).
4. Write your content below the closing `---`.

A minimal post looks like this:

```yaml
---
title: "My First Post"
description: "A short description for cards and search previews."
tags: [writing]
---

Your content starts here.
```

For cover images, add:

```yaml
image: "assets/images/posts/your-image.webp"
image_alt: "Describe the image for screen readers"
```

If a post has a lot of headings, enable the sidebar table of contents:

```yaml
toc: true
```

---

## Step 9 — Footer in `_data/footer.yml`

The footer text — copyright notice, tagline, or links — is driven by this file. The default is a simple copyright line:

```yaml
copyright: "© 2025 Your Name. All rights reserved."
```

You can also add secondary links here, such as a privacy policy or a terms page. See the comments in the file for the supported fields.

---

## Step 10 — Colors and typography (advanced)

If you want to adjust the visual design, all design tokens live in `_sass/0-settings/`. You do not need to touch any other SCSS file for color or type changes.

- **Colors**: `_sass/0-settings/_colors.scss` and `_sass/0-settings/_themes.scss` define the palette and the light/dark theme token maps. The shipped palette uses a Persian-inspired teal/green identity — replace the hex values there to change the brand color.
- **Typography**: `_sass/0-settings/_typography.scss` sets the font families, scale, and line-height. The template uses Literata (body), Space Grotesk (UI), and JetBrains Mono (code) by default.
- **Spacing and layout**: `_sass/0-settings/_config.scss` exposes global spacing, border-radius, and shadow values.

After any SCSS change, run `bundle exec jekyll serve` and check the live reload — changes apply immediately without a full restart.

---

## Quick checklist

Run through this before your first deploy:

- [ ] `url` and `baseurl` updated in `_config.yml`
- [ ] Site `title`, `description`, and `author` set in `_config.yml`
- [ ] Your name, role, bio, and avatar path set in `_data/author.yml`
- [ ] Hero headline and description updated in `_data/hero.yml`
- [ ] Navigation links updated in `_data/navigation.yml`
- [ ] Social links updated in `_data/social-links.yml`
- [ ] `assets/images/avatar.webp` replaced with your own portrait
- [ ] `assets/images/hero-placeholder.webp` replaced or left as-is
- [ ] Demo posts removed or replaced with your own content
- [ ] `bundle exec jekyll build` runs without errors

After deploy, verify that your canonical URL and Open Graph previews show your domain, not the demo site URL. Use [opengraph.xyz](https://www.opengraph.xyz/) or a similar tool to preview how your pages appear when shared on social platforms.
