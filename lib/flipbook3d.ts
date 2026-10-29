/**
 * Browser loader for the 3D FlipBook engine ("3D FlipBook – Lite Edition" 1.16.22 by iberezansky, GPLv2), whose
 * unmodified runtime files are served from public/vendor/3d-flipbook (see the NOTICE there). The engine is a
 * WordPress plugin: its PHP normally writes `FB3D_CLIENT_LOCALE` and a generated `skins.js` into the page, and its
 * loader fetches and `eval`s the scripts. Here the same configuration is built in the browser, the scripts are loaded
 * with ordinary <script> tags, and every place the engine would `eval` a code string is given a function instead
 * (`eval` returns non-strings unchanged), so it runs under the site's CSP without 'unsafe-eval'.
 *
 * Only the engine's "PDF URL" mode is used: no WordPress posts, no admin-ajax calls.
 */

export const FLIPBOOK_BASE = "/vendor/3d-flipbook/";
const KEY = "3d-flip-book";
const SKIN = "short-white-book-view";
const VERSION = "1.16.22";

/** The skin, as the plugin's PHP describes it (paths are relative to `pluginsurl`). */
const SKIN_FILES = {
  html: "3d-flipbook/templates/default-book-view.html",
  // The skin's script is supplied as a function (initSkin below); this path is only a label.
  script: "3d-flipbook/templates/default-book-view.js",
  styles: ["3d-flipbook/css/font-awesome.min.css", "3d-flipbook/css/short-white-book-view.css"],
  links: [],
  sounds: { startFlip: "3d-flipbook/sounds/start-flip.mp3", endFlip: "3d-flipbook/sounds/end-flip.mp3" },
};

const OFF = { enabled: false, enabledInNarrow: false };
/**
 * Toolbar commands the site provides itself (download, fullscreen) or that would leave the page: print opens a
 * popup window, share links to Facebook/Twitter.
 */
const DISABLED_ACTIONS = { cmdSave: OFF, cmdPrint: OFF, cmdShare: OFF, cmdFullScreen: OFF };
/**
 * The per-page loading spinner is off: its listeners stay on the book after the controller is disposed, so a book
 * closed mid-render threw inside the engine's dispose and left the scene half torn down. The overall loading
 * progress is unaffected.
 */
const LOADING_ANIMATION = { skin: false, book: false };

/** Reduced motion: pages turn faster and without the paper wave. */
const REDUCED_MOTION_PROPS = { sheet: { startVelocity: 3, wave: 0 } };

export interface FlipbookScene {
  dispose: () => void;
  instance?: { node?: ArrayLike<HTMLElement> };
}

interface BookTemplate {
  book_style: "volume" | "flat";
  ready_function: string;
  controlProps: Record<string, unknown>;
  props: Record<string, unknown>;
}

export interface ClientLocale {
  key: string;
  ajaxurl: string;
  dictionary: Record<string, string>;
  images: string;
  pluginsurl: string;
  pluginurl: string;
  cacheurl: string;
  version: string;
  thumbnailSize: { width: number; height: number };
  templates: Record<string, typeof SKIN_FILES>;
  jsData: {
    urls: Record<string, unknown>;
    posts: Record<string, never>;
    pages: Record<string, never>;
    firstPages: Record<string, never>;
    bookCtrlProps: { actions: typeof DISABLED_ACTIONS; loadingAnimation: typeof LOADING_ANIMATION; readyFunction: { code: (scene: FlipbookScene) => void } };
    bookTemplates: { auto: BookTemplate };
  };
  render?: () => void;
}

declare global {
  interface Window {
    jQuery?: JQueryStatic;
    FB3D_CLIENT_LOCALE?: ClientLocale;
    FB3D_LOCALE?: { dictionary: Record<string, string> };
    PDFJS_LOCALE?: { pdfJsWorker: string; pdfJsCMapUrl: string };
  }
}

/** pdf.js 4.3 needs Promise.withResolvers, and the plugin keeps Safari on its 2.5 build (client-locale-loader.js). */
export function shouldUseStablePdfJs(userAgent: string, hasWithResolvers: boolean): boolean {
  return !hasWithResolvers || /^((?!chrome|android).)*safari/i.test(userAgent);
}

export function pdfJsFiles(stable: boolean) {
  const dir = `${FLIPBOOK_BASE}js/${stable ? "stable/" : ""}`;
  return { lib: `${dir}pdf.min.js`, worker: `${dir}pdf.worker.js` };
}

/** One page-ready callback for every book; it routes the scene back to the book that owns it. */
const readyHandlers = new Map<HTMLElement, (scene: FlipbookScene) => void>();
function onSceneReady(scene: FlipbookScene) {
  const node = scene.instance?.node?.[0];
  const handler = node && readyHandlers.get(node);
  if (handler) handler(scene);
  else scene.dispose();
}

/**
 * The skin's behaviour (drop-down menus and draggable panels), equivalent to the plugin's default-book-view.js. The
 * engine calls it with the skin container inside its iframe.
 */
export function initSkin(container: JQuery) {
  const $ = window.jQuery as JQueryStatic;
  const doc = $(container[0].ownerDocument);
  let drag: { panel: JQuery; x: number; y: number } | null = null;

  const hideMenus = () => {
    container.find(".v-menu").addClass("hidden");
    container.find(".menu-toggle").removeClass("active");
  };
  const toggleMenu = (event: JQuery.ClickEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const toggle = $(event.target).closest(".menu-toggle");
    const menu = toggle.parent().find(".v-menu");
    const opening = menu.hasClass("hidden");
    menu.toggleClass("hidden", !opening);
    toggle.toggleClass("active", opening);
  };
  const pickPanel = (event: JQuery.MouseDownEvent<HTMLElement>) => {
    drag = drag ? null : { panel: $(event.target).closest(".float-wnd"), x: event.pageX, y: event.pageY };
  };
  const movePanel = (event: JQuery.MouseMoveEvent<Document>) => {
    if (!drag) return;
    event.preventDefault();
    const left = parseInt(drag.panel.css("left"), 10) + event.pageX - drag.x;
    const top = parseInt(drag.panel.css("top"), 10) + event.pageY - drag.y;
    drag.panel.css({ left: `${left}px`, top: `${top}px` });
    drag = { ...drag, x: event.pageX, y: event.pageY };
  };
  const dropPanel = () => {
    drag = null;
  };

  container.find(".menu-toggle").on("click", toggleMenu);
  container.find(".float-wnd .head").on("mousedown", pickPanel);
  doc.on("click", hideMenus).on("mousemove", movePanel).on("mouseup", dropPanel);

  return {
    dispose() {
      container.find(".menu-toggle").off("click", toggleMenu);
      container.find(".float-wnd .head").off("mousedown", pickPanel);
      doc.off("click", hideMenus).off("mousemove", movePanel).off("mouseup", dropPanel);
    },
    appLoaded() {},
    linkLoaded() {},
  };
}

/** What the plugin's PHP would print for one page, for an engine served from `origin`. */
export function buildClientLocale(origin: string, skin: { html: string; styles: string[] }): ClientLocale {
  const pluginurl = `${origin}${FLIPBOOK_BASE}`;
  return {
    key: KEY,
    ajaxurl: "",
    dictionary: {},
    images: `${pluginurl}images/`,
    pluginsurl: `${origin}/vendor/`,
    pluginurl,
    cacheurl: "",
    version: VERSION,
    thumbnailSize: { width: 150, height: 150 },
    templates: { [SKIN]: SKIN_FILES },
    jsData: {
      urls: {
        [SKIN_FILES.html]: skin.html,
        [SKIN_FILES.script]: initSkin,
        ...Object.fromEntries(SKIN_FILES.styles.map((path, index) => [path, skin.styles[index]])),
      },
      posts: {},
      pages: {},
      firstPages: {},
      bookCtrlProps: { actions: DISABLED_ACTIONS, loadingAnimation: LOADING_ANIMATION, readyFunction: { code: onSceneReady } },
      // "volume" is the engine's 3D book with page depth (without a book template it falls back to "flat").
      bookTemplates: { auto: { book_style: "volume", ready_function: "", controlProps: {}, props: {} } },
    },
  };
}

async function fetchText(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: HTTP ${response.status}`);
  return response.text();
}

/** Adds scripts that download in parallel but run in order. */
function loadScripts(sources: string[]) {
  return Promise.all(sources.map((src) => new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = false;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`${src} could not be loaded`));
    document.head.appendChild(script);
  })));
}

let engine: Promise<void> | null = null;

/** Loads the engine once per page view. A failed load can be retried. */
export function loadFlipbookEngine(): Promise<void> {
  engine ??= (async () => {
    const [{ default: jQuery }, html, ...styles] = await Promise.all([
      import("jquery"),
      fetchText(`${FLIPBOOK_BASE}templates/default-book-view.html`),
      ...SKIN_FILES.styles.map((path) => fetchText(`/vendor/${path}`)),
    ]);
    window.jQuery ??= jQuery;
    const pdfJs = pdfJsFiles(shouldUseStablePdfJs(navigator.userAgent, typeof (Promise as { withResolvers?: unknown }).withResolvers === "function"));
    window.FB3D_LOCALE = { dictionary: {} };
    // No pdfJsLib entry: the engine then uses the window.pdfjsLib loaded below instead of fetching and eval-ing it.
    window.PDFJS_LOCALE = { pdfJsWorker: pdfJs.worker, pdfJsCMapUrl: `${FLIPBOOK_BASE}cmaps/` };
    window.FB3D_CLIENT_LOCALE = buildClientLocale(window.location.origin, { html, styles });

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = `${FLIPBOOK_BASE}css/client.css`;
    document.head.appendChild(css);

    await loadScripts([`${FLIPBOOK_BASE}js/three.min.js`, `${FLIPBOOK_BASE}js/html2canvas.min.js`, pdfJs.lib, `${FLIPBOOK_BASE}js/client.min.js`]);
    if (typeof window.FB3D_CLIENT_LOCALE?.render !== "function") throw new Error("3D FlipBook engine did not start");
  })().catch((error) => {
    engine = null;
    throw error;
  });
  return engine;
}

export function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")));
  } catch {
    return false;
  }
}

/**
 * Renders `pdfUrl` as a 3D book filling `host` (the engine's "fullscreen" embed mode, sized by its container).
 * Returns a cleanup that disposes the WebGL scene; a book closed before it finished loading is disposed when ready.
 */
export function mountFlipbook(host: HTMLElement, pdfUrl: string, options: { reducedMotion: boolean; onReady?: () => void; onError?: (message: string) => void }): () => void {
  // client.min.js replaces window.FB3D_CLIENT_LOCALE with a copy, so read it again here.
  const locale = window.FB3D_CLIENT_LOCALE;
  if (!locale?.render) throw new Error("3D FlipBook engine is not loaded");
  locale.jsData.bookTemplates.auto.props = options.reducedMotion ? REDUCED_MOTION_PROPS : {};

  const node = document.createElement("div");
  node.className = `_${KEY} fb3d-fullscreen-mode full-size`;
  node.style.cssText = "width:100%;height:100%";
  const attributes = { id: "0", mode: "fullscreen", title: "false", template: SKIN, "book-template": "default", lightbox: "dark-shadow", urlparam: "fb3d-page", "page-n": "0", pdf: pdfUrl, thumbnail: "", trigger: "" };
  for (const [name, value] of Object.entries(attributes)) node.setAttribute(`data-${name}`, value);
  host.appendChild(node);

  let scene: FlipbookScene | null = null;
  let readyAt = 0;
  let closed = false;
  // The engine reports a PDF that fails to load as a message inside its own view; watch for it until the book is ready.
  const errorWatch = window.setInterval(() => {
    const message = node.querySelector("iframe")?.contentDocument?.querySelector(".user-message:not(.hidden) .error");
    if (!message) return;
    window.clearInterval(errorWatch);
    options.onError?.(message.textContent?.trim() || "The catalog could not be loaded.");
  }, 1000);
  readyHandlers.set(node, (ready) => {
    window.clearInterval(errorWatch);
    if (closed) {
      readyHandlers.delete(node);
      // The engine still has work queued for this scene after the ready callback; dispose once it has run.
      window.setTimeout(() => disposeScene(ready), SCENE_SETTLE_MS);
      return;
    }
    scene = ready;
    readyAt = Date.now();
    options.onReady?.();
  });
  locale.render();

  return () => {
    closed = true;
    window.clearInterval(errorWatch);
    if (scene) {
      const settled = scene;
      readyHandlers.delete(node);
      window.setTimeout(() => disposeScene(settled), Math.max(0, readyAt + SCENE_SETTLE_MS - Date.now()));
    }
    node.remove();
  };
}

/**
 * A new book schedules its own first animation 100 ms after it is created (client.min.js Book init:
 * setTimeout(notifyBeforeAnimation, 100)), which reads the book's materials. Disposing before that timer runs made it
 * throw "undefined is not iterable" in Book.setVisualMode, so a scene is never disposed sooner than this after ready.
 */
const SCENE_SETTLE_MS = 250;

function disposeScene(scene: FlipbookScene) {
  try {
    scene.dispose();
  } catch (error) {
    console.error("3D FlipBook dispose failed", error);
  }
}
