
# Manual: Self-Hosting WOFF2 Fonts in Jekyll (ITCSS)

This guide covers extracting specific font files from Google and integrating them into your existing SASS structure using the tokens defined in your `_typography.scss`.

## Phase 1: Procurement (The "CSS URL" Hack)

Because the standard "Download All" button on Google Fonts often provides `.ttf` files, use this method to grab the optimized `.woff2` files directly.

1. **Generate the URL:** Go to [Google Fonts](https://fonts.google.com/), select your fonts (Space Grotesk, Literata, JetBrains Mono) and the specific weights you need ().
2. **Copy the Link:** In the "Selected Families" sidebar, copy the URL inside the `href` attribute (e.g., `https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300..700&display=swap`).
3. **Fetch the CSS:** Paste that URL into your browser address bar.
4. **Download the Files:** * Find the `@font-face` block for the **latin** subset and the weight you need.
* Copy the URL in the `src: url(...)` property.
* Paste that URL into a new tab to trigger the download of the `.woff2` file.


5. **Rename & Move:** Rename the downloaded files to something clean (e.g., `space-grotesk-bold.woff2`) and move them to `assets/fonts/`.

---

## Phase 2: Architecture Integration

In ITCSS, `@font-face` declarations generate CSS and belong in the **Generic/Base** layer, not the Settings layer.

### 1. Create the Font Sheet

Create a new file at `_sass/1-base/_fonts.scss`.

### 2. Write the `@font-face` Rules

Map the physical files to the tokens in your `_typography.scss`. Use the `#{$variable}` syntax to ensure SASS correctly compiles your weight tokens.

```scss
/* -----------------------------------------------------------------------------
   Font Face Declarations
   ITCSS layer: 1-base
   ----------------------------------------------------------------------------- */

// Space Grotesk (Display)
@font-face {
  font-family: 'Space Grotesk';
  src: url('/assets/fonts/space-grotesk-bold.woff2') format('woff2');
  font-weight: #{$font-weight-bold}; 
  font-style: normal;
  font-display: swap;
}

// Literata (Body)
@font-face {
  font-family: 'Literata';
  src: url('/assets/fonts/literata-regular.woff2') format('woff2');
  font-weight: #{$font-weight-regular};
  font-style: normal;
  font-display: swap;
}

// JetBrains Mono (Technical)
@font-face {
  font-family: 'JetBrains Mono';
  src: url('/assets/fonts/jetbrains-mono-regular.woff2') format('woff2');
  font-weight: #{$font-weight-regular};
  font-style: normal;
  font-display: swap;
}

```

---

## Phase 3: The Manifest

Update your main SASS entry point (usually `assets/css/main.scss` or `_sass/main.scss`) to include the new layer. **Order is critical.**

```scss
// 0. Settings (Variables)
@import "0-settings/typography";

// 1. Base / Generic (Actual CSS)
@import "1-base/fonts"; // Add this here!
@import "1-base/reset";

// ... other layers

```

---

## Phase 4: Optimization (Preloading)

To prevent "Flash of Unstyled Text" (FOUT), tell the browser to download your primary fonts immediately. Add this to your Jekyll `_includes/head.html`:

```html
<link rel="preload" href="{{ '/assets/fonts/space-grotesk-bold.woff2' | relative_url }}" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="{{ '/assets/fonts/literata-regular.woff2' | relative_url }}" as="font" type="font/woff2" crossorigin>

```

---

### Pro-Tip: The "Subset" Warning

When using Method 2 (The Hack), Google detects your browser. If you download them on a Mac/Windows machine, you get the optimized files. However, ensure you are copying the URLs from the `/* latin */` sections of the CSS file to avoid downloading character sets you don't need (like Cyrillic or Greek), which keeps your file sizes under **20KB**.

