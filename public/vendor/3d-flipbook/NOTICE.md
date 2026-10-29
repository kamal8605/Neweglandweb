# 3D FlipBook engine (vendored)

Runtime files of **3D FlipBook – Lite Edition 1.16.22** by iberezansky (https://3dflipbook.net/), taken unmodified
from the WordPress plugin archive `interactive-3d-flipbook-powered-physics-engine.zip`, `assets/` folder.

- License: GPLv2 or later (see `readme.txt`). The bundled libraries keep their own licenses: three.js r125 (MIT),
  PDF.js 4.3.136 and 2.5.207 (Apache-2.0, `cmaps/LICENSE`), html2canvas 0.5 (MIT), Font Awesome 4.7 (SIL OFL / MIT).
- Unminified engine sources are published by the author at
  https://3dflipbook.net/sources/interactive-3d-flipbook-powered-physics-engine-sources.zip
- Only what the PDF viewer needs is included: the WordPress PHP, admin/editor scripts, React 17 copies, color picker
  and unused images/fonts were left out. Font Awesome's woff2 font is embedded in its CSS.
- jQuery, which WordPress normally provides, comes from the `jquery` npm package.

Loaded only when a catalog is opened, by `lib/flipbook3d.ts`, which replaces the configuration the plugin's PHP would
print. Do not edit these files; replace them as a set when upgrading and re-test the catalog viewer.
