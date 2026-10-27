/**
 * Static checks on the storefront source: the API origin comes only from NEXT_PUBLIC_API_URL, every homepage request
 * goes through lib/homepage.ts, and the homepage renders no hard-coded catalogue data.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(__dirname, "..");
const SOURCE_DIRS = ["app", "components", "context", "hooks", "lib"];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx)$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

const files = SOURCE_DIRS.flatMap((dir) => sourceFiles(join(root, dir))).map((path) => ({ path: relative(root, path).replace(/\\/g, "/"), text: readFileSync(path, "utf8") }));

describe("API data sources", () => {
  it("never hard-codes an API origin in application code", () => {
    const offenders = files.filter(({ text }) => /hostingersite\.com|https?:\/\/(?:127\.0\.0\.1|localhost):8000\/(?:api|storage)/.test(text)).map(({ path }) => path);
    expect(offenders).toEqual([]);
  });

  it("requests /api/homepage only through lib/homepage.ts", () => {
    const offenders = files.filter(({ path, text }) => path !== "lib/homepage.ts" && /["'`]\/(?:api\/)?homepage\?/.test(text)).map(({ path }) => path);
    expect(offenders).toEqual([]);
  });

  it("homepage renders no hard-coded products, prices or product ids", () => {
    const page = files.find(({ path }) => path === "app/(site)/page.tsx")!.text;
    expect(page).not.toMatch(/\$\s?\d+\.\d{2}/);
    expect(page).not.toMatch(/product_ids\s*[:=]\s*\[\s*\d/);
    expect(page).not.toMatch(/\b(?:const|let)\s+\w*(?:products|banners|slides|brands|categories)\w*\s*(?::[^=]+)?=\s*\[\s*\{/i);
    expect(page).not.toMatch(/"Wholesale"\s*\)?\s*}/);
  });
});

describe("transitional storefront content", () => {
  it("keeps the old hard-coded warning, store links and badge rule only in lib/legacyContent.ts", () => {
    const offenders = files
      .filter(({ path }) => path !== "lib/legacyContent.ts")
      .filter(({ text }) => /apps\.apple\.com\/in\/app|com\.brainbean\.newengland|Nicotine is an addictive chemical|new arrivals\?/i.test(text))
      .map(({ path }) => path);
    expect(offenders).toEqual([]);
  });
});
