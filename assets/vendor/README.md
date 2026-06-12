# Vendored Runtime Dependencies

Eyvan self-hosts browser runtime dependencies so deployed pages do not execute
mutable third-party code or fetch math fonts from a CDN. These files are
checked-in release artifacts, not npm build dependencies.

## Chart.js 4.5.1

- Source package: `chart.js@4.5.1`
- Upstream: <https://github.com/chartjs/Chart.js/releases/tag/v4.5.1>
- npm tarball SHA-1:
  `19dd1a9a386a3f6397691672231cb5fc9c052c35`
- npm integrity:
  `sha512-GIjfiT9dbmHRiYi6Nl2yFCq7kkwdkp1W/lp2J99rX0yo9tgJGn3lKQATztIjb5tVtevcBtIdICNWqlq5+E8/Pw==`
- Included runtime: `dist/chart.umd.min.js`
- License: MIT, bundled beside the runtime

## MathJax 4.1.2

- Source package: `mathjax@4.1.2`
- Upstream: <https://github.com/mathjax/MathJax/releases/tag/4.1.2>
- npm tarball SHA-1:
  `1a0295bca1b7d4ea54f1ecbb66a7334bf1f4d176`
- npm integrity:
  `sha512-EQDS8xBpVg179BXoLeZ9JlwUFftOC5qylw20UlAMDhrTuooENigOocY79aNkkFSyvj/AST/89ZAo12+r5bPI4w==`
- Included runtime:
  - `tex-chtml.js`
  - TeX extension components, including `braket`
  - accessibility and speech components
  - MathJax menu components
- License: Apache-2.0, bundled beside the runtime

The default CommonHTML font comes from
`@mathjax/mathjax-newcm-font@4.1.2`:

- npm tarball SHA-1:
  `3f915b78515be9fdeb5abae2d642cedb79e661a2`
- npm integrity:
  `sha512-lZHMjNP2XbABHA3kVn40rbse5ERUeMEmrGH03qLkCwxq4/5Z/eNLr0akw1MmQcqTwCbvkx1BFcmJ7RCfbRlw3Q==`
- Included runtime: the complete CommonHTML dynamic-data and WOFF2 directories
- License metadata: Apache-2.0; the Apache license text is bundled in the font
  directory

## Updating

1. Review the upstream release notes and licenses.
2. Download exact package tarballs with `npm pack <package>@<version>`.
3. Verify the tarball SHA-1 and npm integrity values.
4. Replace only the documented browser artifacts and package metadata.
5. Update the versioned paths in Liquid includes or content.
6. Build both `/eyvan` and root-baseurl variants.
7. Run the release, site-integrity, accessibility, and browser checks.
8. Confirm chart and math pages make no cross-origin runtime requests.

Do not add these packages to `package.json`; Node remains QA-only and is not
part of the Jekyll site build.
