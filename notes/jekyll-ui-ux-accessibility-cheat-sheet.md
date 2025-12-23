# UI/UX Accessibility Cheat Sheet  
## Fonts & Colors for Jekyll Portfolio Sites

This checklist is **practical**, **accessibility-first**, and optimized for **Jekyll + GitHub Pages** projects.

---

## 🎯 Core Goal
Your site should be:
- Easy to read without effort
- Understandable without color
- Usable by keyboard and screen readers
- Calm, consistent, and content-focused

Accessibility improves UX for *everyone*.

---

## 1. Typography (Fonts)

### 1.1 Limit Font Choices
- Use **max 2 fonts**
  - 1 body font
  - 1 heading font (optional)

Too many fonts = visual noise + maintenance pain.

---

### 1.2 Body Font Rules
Choose neutral, highly legible fonts.

**Good choices**
- Inter  
- Source Sans 3  
- Roboto  
- System UI stack  

**Avoid**
- Script / decorative fonts
- Ultra-light weights
- Condensed fonts

> If the body font is boring, the content shines.

---

### 1.3 Font Size & Spacing (Critical)
Minimums:
- Body size: **16px**
- Line-height: **1.5–1.7**
- Line length: **60–75ch**

Example (`assets/css/main.scss`):

```scss
body {
  font-size: 16px;
  line-height: 1.6;
  max-width: 70ch;
}
```

Why this matters:
- Helps dyslexia
- Helps low vision
- Improves reading speed

---

### 1.4 Don’t Encode Meaning with Weight Alone
Avoid meaning based only on:
- Light vs bold
- Thin vs thick

Always combine:
- Size
- Spacing
- Color
- Proper HTML headings

---

## 2. Color & Contrast

### 2.1 Contrast Is Non‑Negotiable (WCAG)
- Normal text: **4.5:1**
- Large text (≥18px bold): **3:1**

Rules of thumb:
- Dark text on light background is safest
- Avoid light gray text on white
- Avoid colored text on colored backgrounds

Safe defaults:
- Text: `#111` or `#1a1a1a`
- Background: `#fafafa` or `#ffffff`

---

### 2.2 Never Rely on Color Alone
Bad:
- Red = error, green = success (only)
- Active nav item only marked by color

Good:
- Color + underline
- Color + icon
- Color + label

Example:
```css
a {
  text-decoration: underline;
}
```

---

### 2.3 Keep the Palette Small
For a portfolio site:
- 1 background color
- 1 primary text color
- 1 accent color (links, buttons)
- 1 muted/border color

Example:
- Background: `#ffffff`
- Text: `#1a1a1a`
- Accent: `#005fcc`
- Muted: `#e5e7eb`

---

### 2.4 Avoid Pure Black & White
Use:
- `#111` instead of `#000`
- `#fafafa` instead of `#fff`

Reduces eye strain on long reads.

---

## 3. Interaction States

### 3.1 Focus States (Keyboard Users)
Never remove focus outlines.

❌ Bad:
```css
outline: none;
```

✅ Good:
```css
:focus-visible {
  outline: 2px solid #005fcc;
  outline-offset: 2px;
}
```

---

### 3.2 Hover ≠ Focus ≠ Active
Ensure visible styles for:
- `:hover` (mouse)
- `:focus-visible` (keyboard)
- `:active` (click)

Do not rely on color alone.

---

## 4. HTML Structure First
Accessibility is mostly **HTML**, not CSS.

Always:
- Use proper heading order (`h1 → h2 → h3`)
- Use semantic elements (`nav`, `main`, `footer`)
- Use `<a>` for navigation, `<button>` for actions

CSS cannot fix bad structure.

---

## 5. Quick Accessibility Sanity Check
Before shipping, ask:
- Can I read this in sunlight?
- Can I zoom to 200%?
- Can I navigate using only Tab?
- Are links obvious without color?
- Does it still work in grayscale?

If “no” → adjust fonts or colors.

---

## 6. Recommended Jekyll Workflow

1. Pick body font + text color first
2. Set base typography in `_sass/_base.scss`
3. Define color variables in `_sass/_variables.scss`
4. Apply accents later (links, buttons)

Do not start with fancy components.

---

## ✅ Summary
Accessibility = better UX, cleaner design, fewer bugs.

Start simple. Test often. Let content lead.
