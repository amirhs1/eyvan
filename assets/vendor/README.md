# Vendored Runtime Dependencies

Eyvan self-hosts the MathJax files required by its opt-in `math: true`
feature. These are reviewed release artifacts, not Node build dependencies.

## MathJax 4.1.2

- Source package: `mathjax@4.1.2`
- Upstream release:
  <https://github.com/mathjax/MathJax-src/releases/tag/4.1.2>
- npm tarball SHA-1:
  `1a0295bca1b7d4ea54f1ecbb66a7334bf1f4d176`
- npm integrity:
  `sha512-EQDS8xBpVg179BXoLeZ9JlwUFftOC5qylw20UlAMDhrTuooENigOocY79aNkkFSyvj/AST/89ZAo12+r5bPI4w==`
- License: Apache-2.0, bundled beside the runtime

The default CommonHTML font files come from
`@mathjax/mathjax-newcm-font@4.1.2`:

- npm tarball SHA-1:
  `3f915b78515be9fdeb5abae2d642cedb79e661a2`
- npm integrity:
  `sha512-lZHMjNP2XbABHA3kVn40rbse5ERUeMEmrGH03qLkCwxq4/5Z/eNLr0akw1MmQcqTwCbvkx1BFcmJ7RCfbRlw3Q==`
- License: Apache-2.0, bundled in the font directory

### Curated Runtime Boundary

The checked-in subset contains the combined `tex-chtml.js` component, the
Braket extension, English accessibility speech data, and the dynamic font
data requested by Eyvan's shipped math examples. Browser coverage verifies
that every current math page renders without missing or cross-origin runtime
requests.

MathJax can load additional TeX extensions and font ranges dynamically. If
new content uses notation outside this curated boundary, copy the exact
required files from the same reviewed release, update this note, and extend
the browser coverage. Do not silently fall back to a CDN.

## Updating

1. Review the upstream release notes and licenses.
2. Download exact tarballs with `npm pack <package>@<version>`.
3. Verify the tarball SHA-1 and npm integrity values.
4. Replace the combined component and only the resources requested by all
   shipped math pages.
5. Update the versioned path in `_includes/math.html`.
6. Build both `/eyvan` and root-baseurl variants.
7. Run the site-integrity and accessibility suites.
8. Confirm all math pages render without failed or cross-origin requests.

Do not add MathJax to `package.json`; Node remains QA-only and is not part of
the Jekyll site build.
