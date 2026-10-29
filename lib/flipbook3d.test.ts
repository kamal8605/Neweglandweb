import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";
import { FLIPBOOK_BASE, buildClientLocale, firstPageRenders, initSkin, paintedRatio, pdfJsFiles, shouldUseStablePdfJs } from "./flipbook3d";

const locale = buildClientLocale("https://shop.example", { html: "<div class=\"main\"></div>", styles: ["/*fa*/", "/*skin*/"] });

describe("3D FlipBook configuration", () => {
  it("hands the engine functions, never code strings, where it would eval (CSP without 'unsafe-eval')", () => {
    const skin = locale.templates["short-white-book-view"];
    expect(locale.jsData.urls[skin.script]).toBe(initSkin);
    expect(typeof locale.jsData.bookCtrlProps.readyFunction.code).toBe("function");
    expect(locale.jsData.bookTemplates.auto.ready_function).toBe("");
  });

  it("supplies the skin's html and styles under the paths the engine looks up", () => {
    const skin = locale.templates["short-white-book-view"];
    expect(locale.jsData.urls[skin.html]).toBe("<div class=\"main\"></div>");
    expect(skin.styles.map((path) => locale.jsData.urls[path])).toEqual(["/*fa*/", "/*skin*/"]);
    expect(`${locale.pluginsurl}${skin.html}`).toBe(`https://shop.example${FLIPBOOK_BASE}templates/default-book-view.html`);
  });

  it("uses the 3D volume book and turns off commands that leave the page or duplicate the site's controls", () => {
    expect(locale.jsData.bookTemplates.auto.book_style).toBe("volume");
    for (const name of ["cmdSave", "cmdPrint", "cmdShare", "cmdFullScreen"] as const) {
      expect(locale.jsData.bookCtrlProps.actions[name]).toEqual({ enabled: false, enabledInNarrow: false });
    }
    expect(locale.ajaxurl).toBe("");
    // Its listeners outlive the controller and made dispose throw.
    expect(locale.jsData.bookCtrlProps.loadingAnimation).toEqual({ skin: false, book: false });
  });

  it("picks the PDF.js build the plugin would", () => {
    const chrome = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36";
    const safari = "Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
    expect(shouldUseStablePdfJs(chrome, true)).toBe(false);
    expect(shouldUseStablePdfJs(chrome, false)).toBe(true);
    expect(shouldUseStablePdfJs(safari, true)).toBe(true);
    expect(pdfJsFiles(true).worker).toBe(`${FLIPBOOK_BASE}js/stable/pdf.worker.js`);
  });

  it("every engine file the loader requests is present in public/", () => {
    const files = [
      "js/client.min.js", "js/three.min.js", "js/html2canvas.min.js", "css/client.css",
      pdfJsFiles(false).lib, pdfJsFiles(false).worker, pdfJsFiles(true).lib, pdfJsFiles(true).worker,
      ...Object.values(locale.templates["short-white-book-view"].sounds),
      locale.templates["short-white-book-view"].html, ...locale.templates["short-white-book-view"].styles,
    ].map((path) => path.replace(/^\/?(vendor\/)?(3d-flipbook\/)?/, ""));
    for (const path of files) expect(existsSync(join(process.cwd(), "public", FLIPBOOK_BASE, path)), path).toBe(true);
  });
});

describe("first-page check (PDFs the engine's pdf.js cannot draw)", () => {
  const white = [255, 255, 255, 255];
  const dark = [10, 20, 30, 255];

  it("measures the share of non-white pixels", () => {
    expect(paintedRatio([...white, ...white, ...white, ...white])).toBe(0);
    expect(paintedRatio([...white, ...dark, ...white, ...white])).toBe(0.25);
    expect(paintedRatio([...dark, ...dark])).toBe(1);
    expect(paintedRatio([])).toBe(0);
    // Near-white (scanned paper, anti-aliasing) does not count as content.
    expect(paintedRatio([250, 250, 250, 255, 246, 246, 246, 255])).toBe(0);
  });

  it("lets the engine decide when the check cannot run", async () => {
    // No pdf.js global / worker on the page (or a failing load): never block the 3D viewer.
    vi.stubGlobal("window", { PDFJS_LOCALE: undefined });
    await expect(firstPageRenders("https://api.example/catalog.pdf")).resolves.toBe(true);
    vi.stubGlobal("window", {
      PDFJS_LOCALE: { pdfJsWorker: "/w.js", pdfJsCMapUrl: "/c/" },
      pdfjsLib: { GlobalWorkerOptions: { workerSrc: "" }, getDocument: () => ({ promise: Promise.reject(new Error("network")), destroy: () => undefined }) },
      setTimeout, clearTimeout,
    });
    await expect(firstPageRenders("https://api.example/catalog.pdf")).resolves.toBe(true);
    vi.unstubAllGlobals();
  });
});
