# Third-Party Notices

This repository's source code is released under the MIT License in
[`LICENSE`](LICENSE). Some bundled assets, demo media, icons, fonts, and
optional demo integrations are distributed under their own licenses or usage
terms. Those third-party terms remain in effect when the files are copied,
modified, or redistributed.

This file is an operational attribution and license-scope guide, not legal
advice.

## Design Inspiration and Development

Eyvan draws creative and technical inspiration from these open-source projects:

- [minimal-mistakes](https://github.com/mmistakes/minimal-mistakes)
- [analytics-link.github.io](https://github.com/analytics-link/analytics-link.github.io)
- [vonge-jekyll-bookshop-template](https://github.com/CloudCannon/vonge-jekyll-bookshop-template)

Code generation, modular templating, refactoring logic, debugging scripts, and
demo posts were developed in collaboration with Large Language Models,
including OpenAI's ChatGPT/Codex, Google Gemini, and Anthropic Claude.

## JavaScript and Optional Demo Integrations

Some JavaScript behaviors in this template are adapted from open-source
patterns or projects. Where a source file carries specific implementation or
license notes, preserve that file-level documentation when copying or adapting
the code.

The climate demo loads Chart.js 4.5.1 from jsDelivr under the
[MIT License](https://github.com/chartjs/Chart.js/blob/v4.5.1/LICENSE.md).
The integration is limited to the removable climate-analysis demo post and
`assets/js/demo-climate-charts.js`; it is not part of Eyvan's core runtime.

MathJax is an opt-in CDN integration for pages that set `math: true`. The
loader uses an exact reviewed release with Subresource Integrity and privacy
attributes. MathJax is provided by the MathJax project under its own license
terms.

## Liquid Includes

`_includes/toc.html` is a modified implementation based on
[allejo/jekyll-toc](https://github.com/allejo/jekyll-toc), copyright (c) 2017
Vladimir "allejo" Jimenez and distributed under the MIT License. The adapted
file retains its attribution and license notice in its source comments.

## Typography Licensing

Eyvan self-hosts three font families as WOFF2 subsets: Gelasio and JetBrains
Mono as variable-weight files, and Barlow Condensed as static per-weight files.
All three families are released under the
[SIL Open Font License 1.1 (OFL)](https://openfontlicense.org/), which permits
use, modification, and redistribution under the OFL terms.

- **Barlow Condensed**: Designed by Jeremy Tribby. Source:
  [Google Fonts](https://fonts.google.com/specimen/Barlow+Condensed). License:
  OFL 1.1.
- **Gelasio**: Designed by Eben Sorkin. Source:
  [Google Fonts](https://fonts.google.com/specimen/Gelasio). License: OFL 1.1.
- **JetBrains Mono**: Designed by JetBrains, Philipp Nurullin, and Konstantin
  Bulenkov. Source:
  [Google Fonts](https://fonts.google.com/specimen/JetBrains+Mono). License:
  OFL 1.1.

The exact upstream font license texts and a file-by-file asset map are bundled
in [`assets/fonts/licenses/`](assets/fonts/licenses/README.md).

## Iconography Licensing

Eyvan incorporates third-party open-source iconography. Icons have been
optimized to support dynamic light and dark mode styling with `currentColor`
fills where applicable.

- **Resume & CV Icons**: Original designs by the template author.
- **Ionicons** (`chevron-down-circle`, `chevron-up-circle`,
  `close-circle`, `discord`, `github`, `instagram`, `linkedin`, `mail`,
  `menu`, `moon`, `old-twitter`, `pinterest`, `print`, `rss`, `send`,
  `share`, `sunny`, `timer`, `youtube`): Developed by
  [Ionic](https://ionic.io/ionicons) and released under the
  [MIT License](https://opensource.org/licenses/MIT).
- **Font Awesome** (`medium`): Brand icon provided by
  [Font Awesome](https://fontawesome.com/) under the Font Awesome Free License
  / CC BY 4.0. Subject to trademark guidelines.
- **Google Scholar Icon** (`google_scholar`): Sourced via
  [SVG Repo](https://www.svgrepo.com/svg/306145/googlescholar) under the SVG
  Repo Logo License vectors agreement.
- **ORCID iD** (`orcid`): Monochromatic optimization of the official asset
  sourced via
  [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:ORCID_iD.svg),
  governed by ORCID, Inc. asset guidelines and dedicated to the public domain
  under CC0 1.0 Universal.
- **X Logo** (`x`): Rendered via `currentColor` strictly as a solid
  monochromatic asset to comply with the scaling and color constraints in the
  official [X Brand Toolkit](https://about.x.com/en/who-we-are/brand-toolkit).
  All rights and trademarks reside with X Corp.

## Demo Images, Audio, and Video

The shipped posts include demo media to exercise the template's figure,
gallery, audio, video, social-preview, and cover-image behavior. These assets
are demonstration content and may carry terms that differ from the repository's
MIT-licensed code.

| Asset or group | Source / creator | License or terms noted in content |
| --- | --- | --- |
| `assets/images/posts/token-bucket-diagram.webp` | Generated with Google's Gemini for illustrative demo use | Generated demo asset; attribution note appears in the rate-limiter post |
| `assets/images/posts/front-matter-cover.webp` | Generated with Google's Gemini for illustrative demo use | Generated demo asset; attribution note appears in the front-matter guide |
| `assets/images/posts/customizing_eyvan.webp` | Generated with OpenAI's ChatGPT for illustrative demo use | Generated demo asset; attribution note appears in the customizing guide |
| `assets/images/posts/global_temperature_rise.webp` | Easy-Peasy.AI image generator | Free-to-use with backlink attribution noted in the climate demo post |
| `assets/images/posts/khane-amerian-eyvan*.webp` | Matthias Blume via Wikimedia Commons | CC BY-SA 3.0, attribution noted in the architecture post |
| `assets/images/posts/quantum_entanglement_vs_classical_correlation_video.webp` | JozumBjada via Wikimedia Commons | CC BY-SA 4.0, attribution noted in the quantum post |
| `assets/images/posts/iceland-hero.webp` | Lyn Ong via Pexels | Pexels License, attribution noted in the Iceland post |
| `assets/images/posts/iceland-basalt.webp` | Batin Ozen via Pexels | Pexels License, attribution noted in the Iceland post |
| `assets/images/posts/iceland-vent.webp` | Francesco Ungaro via Pexels | Pexels License, attribution noted in the Iceland post |
| `assets/images/posts/iceland-glacier.webp` | Kenny Muir via Wikimedia Commons | CC BY 2.0, attribution noted in the Iceland post |
| `assets/images/posts/frozen-volcanic-ash.webp` | Simon Thivet via Imaggeo | CC BY 3.0, attribution noted in the Iceland post |
| `assets/images/posts/church-at-buoirdwarfed.webp` | Bogdan Giurca via Pexels | Pexels License, attribution noted in the Iceland post |
| `assets/images/posts/aurora-borealis.webp` | Vaidyanathan and Archana via Wikimedia Commons | CC BY-SA 4.0, attribution noted in the Iceland post |
| `assets/audios/posts/ocean-waves-on-pebbly-beach-iceland-loop.opus` | NickTayloe on Freesound | CC BY 4.0, format converted from FLAC to Opus |
| `assets/videos/posts/geysir-iceland-2023-erupting-geyser-strokkur.webm` and poster | EvaL MiKo on Vecteezy | Free video with attribution required, converted to WebM VP9 with Opus audio |

If you use Eyvan as a starting point for your own site, replace demo media with
your own assets or preserve the original attribution and license requirements.

## Legal Notice and Trademarks

Certain brand logos, including but not limited to Google Scholar, Medium,
ORCID, X, GitHub, LinkedIn, and YouTube, are protected as registered trademarks
of their respective copyright holders. Inclusion of these assets within this
template does not imply endorsement of Eyvan by the trademark holders, nor vice
versa. Users are responsible for ensuring their deployments comply with the
respective brand guidelines.
