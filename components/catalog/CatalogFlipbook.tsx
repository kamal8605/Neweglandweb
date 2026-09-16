"use client";

import { forwardRef, useCallback, useEffect, useRef, useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Download,
  FileText,
  LayoutGrid,
  LoaderCircle,
  Maximize2,
  Minimize2,
  MinusCircle,
  MoreHorizontal,
  PlusCircle,
  Share2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PDF_OPTIONS = { wasmUrl: "/pdfjs/wasm/" };
const ZOOM_LEVELS = [1, 1.25, 1.5, 1.8, 2.2];

interface FlipbookProps {
  file: string;
  title: string;
  onClose: () => void;
}

interface FlipbookHandle {
  pageFlip: () => {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
    flip: (page: number, corner?: "top" | "bottom") => void;
    turnToPage: (page: number) => void;
    getCurrentPageIndex: () => number;
    getPageCount: () => number;
  };
}

const PdfPage = forwardRef<HTMLDivElement, { pageNumber: number; width: number; shouldRender: boolean }>(
  ({ pageNumber, width, shouldRender }, ref) => (
    <div ref={ref} className="catalog-pdf-page bg-white" data-density={pageNumber === 1 ? "hard" : "soft"}>
      {shouldRender ? (
        <Page
          pageNumber={pageNumber}
          width={width}
          devicePixelRatio={1.5}
          renderMode="canvas"
          renderTextLayer={false}
          renderAnnotationLayer={false}
          loading={<div className="grid h-full place-items-center bg-white text-xs font-semibold text-brand-muted">Loading page {pageNumber}…</div>}
        />
      ) : (
        <div className="h-full w-full bg-white" aria-hidden="true" />
      )}
    </div>
  ),
);
PdfPage.displayName = "PdfPage";

function playPageFlipSound() {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    if (ctx.state === "suspended") {
      ctx.resume();
    }
    const bufferSize = Math.floor(ctx.sampleRate * 0.14);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.28));
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(1200, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.14);
    filter.Q.setValueAtTime(2.0, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.25, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.14);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  } catch {
    // Audio policy may require user gesture
  }
}

export default function CatalogFlipbook({ file, title, onClose }: FlipbookProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const bookRef = useRef<FlipbookHandle | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const pageInputRef = useRef<HTMLInputElement | null>(null);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeThumbnailRef = useRef<HTMLButtonElement | null>(null);

  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pdfDocument, setPdfDocument] = useState<PDFDocumentProxy | null>(null);
  const [pageRatio, setPageRatio] = useState(255 / 330);
  const [bookSize, setBookSize] = useState({ width: 460, height: 598 });

  // Interactive controls state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSinglePage, setIsSinglePage] = useState(false);
  const [showThumbnails, setShowThumbnails] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isEditingPage, setIsEditingPage] = useState(false);
  const [inputPageValue, setInputPageValue] = useState("1");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const downloadUrl = file || "https://newenglanddistro.com/wp-content/uploads/2026/03/New-England-Catalog.pdf";

  // Fit book dimensions to viewport
  const fitBookToViewport = useCallback(() => {
    const isMobile = window.innerWidth < 768;
    const effectiveSingle = isSinglePage || isMobile;
    const availableHeight = Math.max(260, window.innerHeight - 150);
    const availablePageWidth = effectiveSingle
      ? Math.max(200, Math.min(560, (window.innerWidth - 120) / 2.6))
      : Math.max(200, (window.innerWidth - 140) / 2);
    const height = Math.floor(Math.min(780, availableHeight, availablePageWidth / pageRatio));
    const width = Math.floor(height * pageRatio);
    setBookSize({ width, height });
  }, [isSinglePage, pageRatio]);

  useEffect(() => {
    const timer = window.setTimeout(fitBookToViewport, 0);
    window.addEventListener("resize", fitBookToViewport);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", fitBookToViewport);
    };
  }, [fitBookToViewport]);

  // Handle escape key and body overflow lock
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  // Listen to fullscreen changes
  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  // Click outside more menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showMoreMenu]);

  // Scroll active thumbnail into view when thumbnails open or current page changes
  useEffect(() => {
    if (showThumbnails && activeThumbnailRef.current) {
      activeThumbnailRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [showThumbnails, currentPage]);

  // Navigate directly to a specific 1-based page
  const handleJumpToPage = useCallback(
    (targetPage1Based: number) => {
      if (!pageCount || targetPage1Based < 1 || targetPage1Based > pageCount) return;
      const targetIndex = targetPage1Based - 1;
      try {
        bookRef.current?.pageFlip().turnToPage(targetIndex);
      } catch {
        try {
          bookRef.current?.pageFlip().flip(targetIndex, "bottom");
        } catch {
          // ignore
        }
      }
      setCurrentPage(targetIndex);
      if (soundEnabled) {
        playPageFlipSound();
      }
    },
    [pageCount, soundEnabled],
  );

  // Zoom controls
  const handleZoomIn = () => {
    const nextZoom = ZOOM_LEVELS.find((z) => z > zoom) ?? ZOOM_LEVELS[ZOOM_LEVELS.length - 1];
    setZoom(nextZoom);
  };

  const handleZoomOut = () => {
    const prevZoom = [...ZOOM_LEVELS].reverse().find((z) => z < zoom) ?? 1;
    setZoom(prevZoom);
    if (prevZoom === 1) {
      setPan({ x: 0, y: 0 });
    }
  };

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch {
      // Fullscreen not allowed or failed
    }
  };

  // Share link
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: `Check out ${title} on New England Distro`,
          url: window.location.href,
        });
        return;
      } catch {
        // Fall back to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      setToastMessage("Link copied to clipboard!");
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      setToastMessage("Could not copy link.");
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  // Mouse pan handling when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoom <= 1) return;
    setPan({
      x: e.clientX - dragStartRef.current.x,
      y: e.clientY - dragStartRef.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/85 backdrop-blur-md select-none"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      {/* Top right close button */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close catalog"
        title="Close Catalog"
        className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-brand-orange hover:text-white"
      >
        <X size={22} />
      </button>

      {/* Main flipbook viewport */}
      <div
        className="relative flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden px-8 py-4 sm:px-16"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <Document
          file={file}
          options={PDF_OPTIONS}
          onLoadSuccess={async (document) => {
            setPdfDocument(document);
            setPageCount(document.numPages);
            const firstPage = await document.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1 });
            setPageRatio(viewport.width / viewport.height);
          }}
          loading={
            <div className="flex flex-col items-center gap-3 text-white">
              <LoaderCircle className="animate-spin text-brand-orange" size={44} />
              <span className="text-sm font-semibold tracking-wide">Loading catalog…</span>
            </div>
          }
          error={<p className="text-white text-sm font-semibold">Catalog could not be loaded.</p>}
        >
          {pageCount > 0 && (
            <div
              className={`transition-transform duration-200 ease-out flex items-center justify-center overflow-visible ${
                zoom > 1 ? (isDragging ? "cursor-grabbing" : "cursor-grab") : ""
              }`}
              style={{
                width: isSinglePage ? `${bookSize.width}px` : `${bookSize.width * 2}px`,
                maxWidth: isSinglePage ? `${bookSize.width}px` : `${bookSize.width * 2}px`,
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: "center center",
              }}
            >
              <HTMLFlipBook
                key={`${bookSize.width}-${bookSize.height}-${isSinglePage ? "single" : "double"}`}
                ref={bookRef}
                className="catalog-pdf-book shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                style={{}}
                width={bookSize.width}
                height={bookSize.height}
                size="fixed"
                minWidth={bookSize.width}
                maxWidth={bookSize.width}
                minHeight={bookSize.height}
                maxHeight={bookSize.height}
                startPage={currentPage}
                drawShadow
                flippingTime={800}
                usePortrait={isSinglePage}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.65}
                showCover={!isSinglePage}
                mobileScrollSupport
                clickEventForward
                useMouseEvents
                swipeDistance={30}
                showPageCorners
                disableFlipByClick={false}
                onFlip={(event) => {
                  const newPage = Number(event.data);
                  setCurrentPage(newPage);
                  if (soundEnabled) {
                    playPageFlipSound();
                  }
                }}
              >
                {Array.from({ length: pageCount }, (_, index) => (
                  <PdfPage
                    key={index + 1}
                    pageNumber={index + 1}
                    width={bookSize.width}
                    shouldRender={Math.abs(index - currentPage) <= 6}
                  />
                ))}
              </HTMLFlipBook>
            </div>
          )}
        </Document>

        {/* Side flip navigation buttons */}
        <button
          type="button"
          onClick={() => {
            bookRef.current?.pageFlip().flipPrev("bottom");
            if (soundEnabled) playPageFlipSound();
          }}
          disabled={currentPage === 0}
          aria-label="Previous page"
          title="Previous Page"
          className={`absolute ${showThumbnails ? "left-68 sm:left-76" : "left-2 sm:left-6"} top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white/80 backdrop-blur-xs transition-all hover:bg-black/70 hover:text-white disabled:pointer-events-none disabled:opacity-0`}
        >
          <ChevronLeft size={32} />
        </button>

        <button
          type="button"
          onClick={() => {
            bookRef.current?.pageFlip().flipNext("bottom");
            if (soundEnabled) playPageFlipSound();
          }}
          disabled={currentPage >= pageCount - 1}
          aria-label="Next page"
          title="Next Page"
          className="absolute right-2 sm:right-6 top-1/2 z-30 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/35 text-white/80 backdrop-blur-xs transition hover:bg-black/70 hover:text-white disabled:pointer-events-none disabled:opacity-0"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* Vertical Thumbnails Sidebar touching the left border */}
      {showThumbnails && (
        <aside
          className="fixed left-0 top-0 bottom-0 z-40 flex h-full w-64 sm:w-72 flex-col bg-slate-950/95 backdrop-blur-xl border-r border-white/15 shadow-2xl animate-slide-in-left select-none"
          aria-label="Page Thumbnails"
        >
          <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4 text-white">
            <div className="flex items-center gap-2">
              <LayoutGrid size={16} className="text-brand-orange" />
              <span className="text-xs font-bold uppercase tracking-wider">Page Thumbnails</span>
              <span className="text-[11px] text-white/50">({pageCount} pages)</span>
            </div>
            <button
              type="button"
              onClick={() => setShowThumbnails(false)}
              className="grid h-8 w-8 place-items-center rounded-full text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Close thumbnails"
              title="Close Thumbnails"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin scrollbar-thumb-white/20">
            <div className="grid grid-cols-2 gap-2.5">
              {Array.from({ length: pageCount }, (_, i) => {
                const pageNum = i + 1;
                const isActive = currentPage === i;
                return (
                  <button
                    key={pageNum}
                    ref={isActive ? activeThumbnailRef : undefined}
                    type="button"
                    onClick={() => handleJumpToPage(pageNum)}
                    className={`group relative flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition-all text-left ${
                      isActive
                        ? "ring-2 ring-brand-orange bg-brand-orange/20 shadow-lg scale-[1.02]"
                        : "hover:bg-white/10 opacity-75 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full aspect-[210/297] bg-white rounded overflow-hidden shadow flex items-center justify-center text-slate-400">
                      {pdfDocument ? (
                        <Page
                          pdf={pdfDocument}
                          pageNumber={pageNum}
                          width={110}
                          devicePixelRatio={1}
                          renderMode="canvas"
                          renderTextLayer={false}
                          renderAnnotationLayer={false}
                          loading={<div className="text-[10px] text-slate-400 font-bold">{pageNum}</div>}
                        />
                      ) : (
                        <div className="text-[10px] text-slate-400 font-bold">{pageNum}</div>
                      )}
                    </div>
                    <span
                      className={`text-center text-[11px] font-semibold ${
                        isActive ? "text-brand-orange font-bold" : "text-white/80 group-hover:text-white"
                      }`}
                    >
                      {pageNum}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      )}

      {/* Floating Pill Toolbar matching DearFlip df-ui specification */}
      <div className="df-ui fixed bottom-5 left-1/2 -translate-x-1/2 z-50 select-none">
        <div className="df-ui-center relative flex items-center bg-white rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.22)] border border-slate-200/90 px-2 py-1 gap-1 text-slate-600">
          {/* Page indicator & direct jump input (df-ui-page) */}
          <div className="df-ui-btn df-ui-page relative flex items-center justify-center min-w-[52px] px-2 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 transition">
            {isEditingPage ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const p = parseInt(inputPageValue, 10);
                  if (!isNaN(p) && p >= 1 && p <= pageCount) {
                    handleJumpToPage(p);
                  }
                  setIsEditingPage(false);
                }}
                className="flex items-center"
              >
                <input
                  ref={pageInputRef}
                  id="df_book_page_number_987"
                  type="number"
                  min={1}
                  max={pageCount}
                  value={inputPageValue}
                  onChange={(e) => setInputPageValue(e.target.value)}
                  onBlur={() => {
                    const p = parseInt(inputPageValue, 10);
                    if (!isNaN(p) && p >= 1 && p <= pageCount) {
                      handleJumpToPage(p);
                    }
                    setIsEditingPage(false);
                  }}
                  className="w-10 text-center font-mono text-xs bg-slate-100 rounded border border-slate-300 py-0.5 outline-none focus:border-brand-orange"
                  autoFocus
                />
              </form>
            ) : (
              <label
                htmlFor="df_book_page_number_987"
                onClick={() => {
                  setInputPageValue(String(currentPage + 1));
                  setIsEditingPage(true);
                }}
                className="cursor-pointer tracking-tight whitespace-nowrap hover:text-brand-orange"
                title="Click to jump to page"
              >
                {pageCount ? `${currentPage + 1}/${pageCount}` : "--/--"}
              </label>
            )}
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Toggle Thumbnails (df-ui-thumbnail) */}
          <button
            type="button"
            onClick={() => setShowThumbnails((prev) => !prev)}
            className={`df-ui-btn df-ui-thumbnail df-icon-grid-view df-sidemenu-trigger p-2 rounded-lg transition hover:bg-slate-100 ${
              showThumbnails ? "text-brand-orange bg-slate-100" : "text-slate-600 hover:text-slate-900"
            }`}
            title="Toggle Thumbnails"
          >
            <LayoutGrid size={18} strokeWidth={2} />
            <span className="sr-only">Toggle Thumbnails</span>
          </button>

          {/* Zoom In (df-ui-zoomin) */}
          <button
            type="button"
            onClick={handleZoomIn}
            disabled={zoom >= ZOOM_LEVELS[ZOOM_LEVELS.length - 1]}
            className="df-ui-btn df-ui-zoomin df-icon-add-circle p-2 rounded-lg text-slate-600 hover:text-slate-900 transition hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Zoom In"
          >
            <PlusCircle size={19} strokeWidth={1.8} />
            <span className="sr-only">Zoom In</span>
          </button>

          {/* Zoom Out (df-ui-zoomout) */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={zoom <= 1}
            className={`df-ui-btn df-ui-zoomout df-icon-minus-circle p-2 rounded-lg transition ${
              zoom <= 1
                ? "disabled opacity-30 text-slate-400 cursor-not-allowed"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
            title="Zoom Out"
          >
            <MinusCircle size={19} strokeWidth={1.8} />
            <span className="sr-only">Zoom Out</span>
          </button>

          {/* Toggle Fullscreen (df-ui-fullscreen) */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="df-ui-btn df-ui-fullscreen df-icon-fullscreen p-2 rounded-lg text-slate-600 hover:text-slate-900 transition hover:bg-slate-100"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 size={18} strokeWidth={2} /> : <Maximize2 size={18} strokeWidth={2} />}
            <span className="sr-only">Toggle Fullscreen</span>
          </button>

          {/* Share (df-ui-share) */}
          <button
            type="button"
            onClick={handleShare}
            className="df-ui-btn df-ui-share df-icon-share p-2 rounded-lg text-slate-600 hover:text-slate-900 transition hover:bg-slate-100"
            title="Share"
          >
            <Share2 size={18} strokeWidth={2} />
            <span className="sr-only">Share</span>
          </button>

          {/* More Options (df-ui-more) */}
          <div className="relative" ref={moreMenuRef}>
            <button
              type="button"
              onClick={() => setShowMoreMenu((prev) => !prev)}
              className={`df-ui-btn df-ui-more df-icon-more p-2 rounded-lg transition hover:bg-slate-100 ${
                showMoreMenu ? "text-brand-orange bg-slate-100" : "text-slate-600 hover:text-slate-900"
              }`}
              title="More Options"
            >
              <MoreHorizontal size={19} strokeWidth={2} />
              <span className="sr-only">More Options</span>
            </button>

            {/* Popover Menu (df-more-container) */}
            {showMoreMenu && (
              <div className="df-more-container absolute bottom-full mb-3 right-0 w-56 rounded-xl bg-white p-1.5 shadow-2xl border border-slate-200/90 text-slate-700 animate-fade-in z-50">
                <a
                  download=""
                  target="_blank"
                  rel="noopener noreferrer"
                  href={downloadUrl}
                  onClick={() => setShowMoreMenu(false)}
                  className="df-ui-btn df-ui-download df-icon-download flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 hover:text-brand-orange transition"
                  title="Download PDF File"
                >
                  <Download size={16} strokeWidth={2} className="text-slate-500" />
                  <span>Download PDF File</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setIsSinglePage((prev) => !prev);
                    setShowMoreMenu(false);
                  }}
                  className="df-ui-btn df-ui-pagemode df-icon-file flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 hover:text-brand-orange transition text-left"
                  title={isSinglePage ? "Double Page Mode" : "Single Page Mode"}
                >
                  {isSinglePage ? (
                    <>
                      <BookOpen size={16} strokeWidth={2} className="text-slate-500" />
                      <span>Double Page Mode</span>
                    </>
                  ) : (
                    <>
                      <FileText size={16} strokeWidth={2} className="text-slate-500" />
                      <span>Single Page Mode</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleJumpToPage(1);
                    setShowMoreMenu(false);
                  }}
                  className="df-ui-btn df-ui-start df-icon-first-page flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 hover:text-brand-orange transition text-left"
                  title="Goto First Page"
                >
                  <ChevronsLeft size={16} strokeWidth={2} className="text-slate-500" />
                  <span>Goto First Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleJumpToPage(pageCount);
                    setShowMoreMenu(false);
                  }}
                  className="df-ui-btn df-ui-end df-icon-last-page flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 hover:text-brand-orange transition text-left"
                  title="Goto Last Page"
                >
                  <ChevronsRight size={16} strokeWidth={2} className="text-slate-500" />
                  <span>Goto Last Page</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSoundEnabled((prev) => !prev);
                    setShowMoreMenu(false);
                  }}
                  className="df-ui-btn df-ui-sound df-icon-volume flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold rounded-lg hover:bg-slate-100 hover:text-brand-orange transition text-left"
                  title="Turn on/off Sound"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 size={16} strokeWidth={2} className="text-brand-orange" />
                      <span>Sound: On</span>
                    </>
                  ) : (
                    <>
                      <VolumeX size={16} strokeWidth={2} className="text-slate-400" />
                      <span>Sound: Off</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating toast notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 text-white px-4 py-2 rounded-full text-xs font-semibold shadow-2xl border border-white/20 backdrop-blur-sm pointer-events-none">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
