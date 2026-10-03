/**
 * Builds a browser-compatible copy of the pdf.js worker into public/pdfjs/.
 *
 * Why: the worker ships as a pre-minified ES2022 file (it contains `class { static { … } }`). Next/Turbopack
 * emits it untouched, so on Safari/iPadOS < 16.4 (also Chrome on iPad, which uses WebKit) the worker — and the
 * main-thread fallback that imports the same file — fails with a SyntaxError and every catalog shows
 * "Catalog could not be loaded". Down-levelling it to ES2019 makes it run on every browser the site supports.
 *
 * Output name carries the pdfjs-dist version (the API and worker versions must match, and the name busts caches).
 * Runs on `postinstall` and `prebuild`; the generated file is committed so a build without it still works.
 */
import { createRequire } from "node:module";
import { mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import path from "node:path";

const require = createRequire(import.meta.url);
const root = path.resolve(import.meta.dirname, "..");

let ts;
try {
  ts = require("typescript");
} catch {
  console.warn("[pdf-worker] typescript not installed - keeping the existing public/pdfjs worker.");
  process.exit(0);
}

const { version } = require("pdfjs-dist/package.json");
const source = path.join(root, "node_modules/pdfjs-dist/legacy/build/pdf.worker.min.mjs");
const outDir = path.join(root, "public/pdfjs");
const outFile = path.join(outDir, `pdf.worker.${version}.legacy.min.mjs`);

const { outputText } = ts.transpileModule(readFileSync(source, "utf8"), {
  fileName: "pdf.worker.min.mjs",
  compilerOptions: {
    target: ts.ScriptTarget.ES2019,
    module: ts.ModuleKind.ESNext,
    allowJs: true,
    sourceMap: false,
    removeComments: false,
  },
});

mkdirSync(outDir, { recursive: true });
// Drop workers generated for other pdfjs-dist versions.
for (const name of readdirSync(outDir)) {
  if (/^pdf\.worker\..+\.legacy\.min\.mjs$/.test(name) && name !== path.basename(outFile)) {
    rmSync(path.join(outDir, name));
  }
}
writeFileSync(outFile, outputText.replace(/\/\/# sourceMappingURL=.*$/m, ""));
console.log(`[pdf-worker] wrote ${path.relative(root, outFile)} (pdfjs-dist ${version}, ES2019)`);
