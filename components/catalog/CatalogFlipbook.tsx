"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, LoaderCircle, X } from "lucide-react";
import HTMLFlipBook from "react-pageflip";
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const PDF_OPTIONS = { wasmUrl: "/pdfjs/wasm/" };

interface FlipbookProps {
  file: string;
  title: string;
  onClose: () => void;
}

interface FlipbookHandle {
  pageFlip: () => {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
  };
}

const PdfPage = forwardRef<HTMLDivElement, { pageNumber: number; width: number; shouldRender: boolean }>(({ pageNumber, width, shouldRender }, ref) => (
  <div ref={ref} className="catalog-pdf-page bg-white" data-density={pageNumber === 1 ? "hard" : "soft"}>
    {shouldRender ? (
      <Page pageNumber={pageNumber} width={width} devicePixelRatio={1} renderMode="canvas" renderTextLayer={false} renderAnnotationLayer={false} loading={<div className="grid h-full place-items-center bg-white text-brand-muted">Loading page…</div>} />
    ) : (
      <div className="h-full w-full bg-white" aria-hidden="true" />
    )}
  </div>
));
PdfPage.displayName = "PdfPage";

export default function CatalogFlipbook({ file, title, onClose }: FlipbookProps) {
  const bookRef = useRef<FlipbookHandle | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageRatio, setPageRatio] = useState(255 / 330);
  const [bookSize, setBookSize] = useState({ width: 460, height: 598 });

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

  useEffect(() => {
    const fitBookToViewport = () => {
      const availableHeight = Math.max(260, window.innerHeight - 190);
      const availablePageWidth = Math.max(200, (window.innerWidth - 190) / 2);
      const height = Math.floor(Math.min(780, availableHeight, availablePageWidth / pageRatio));
      setBookSize({ width: Math.floor(height * pageRatio), height });
    };
    fitBookToViewport();
    window.addEventListener("resize", fitBookToViewport);
    return () => window.removeEventListener("resize", fitBookToViewport);
  }, [pageRatio]);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={title}>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/15 px-4 text-white md:px-7">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-brand-orange">Digital Catalog</p><h2 className="font-bold">{title}</h2></div>
        <button type="button" onClick={onClose} aria-label="Close catalog" className="grid h-11 w-11 place-items-center rounded-full bg-white/10 transition hover:bg-brand-orange"><X size={25} /></button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-12 py-5 md:px-20">
        <Document
          file={file}
          options={PDF_OPTIONS}
          onLoadSuccess={async (document) => {
            setPageCount(document.numPages);
            const firstPage = await document.getPage(1);
            const viewport = firstPage.getViewport({ scale: 1 });
            setPageRatio(viewport.width / viewport.height);
          }}
          loading={<LoaderCircle className="animate-spin text-white" size={42} />}
          error={<p className="text-white">Catalog could not be loaded.</p>}
        >
          {pageCount > 0 && (
            <HTMLFlipBook
              key={`${bookSize.width}-${bookSize.height}`}
              ref={bookRef}
              className="catalog-pdf-book"
              style={{}}
              width={bookSize.width}
              height={bookSize.height}
              size="fixed"
              minWidth={bookSize.width}
              maxWidth={bookSize.width}
              minHeight={bookSize.height}
              maxHeight={bookSize.height}
              startPage={0}
              drawShadow
              flippingTime={900}
              usePortrait={false}
              startZIndex={0}
              autoSize
              maxShadowOpacity={0.65}
              showCover
              mobileScrollSupport
              clickEventForward
              useMouseEvents
              swipeDistance={30}
              showPageCorners
              disableFlipByClick={false}
              onFlip={(event) => setCurrentPage(Number(event.data))}
            >
              {Array.from({ length: pageCount }, (_, index) => (
                <PdfPage
                  key={index + 1}
                  pageNumber={index + 1}
                  width={bookSize.width}
                  shouldRender={index >= currentPage - 4 && index <= currentPage + 6}
                />
              ))}
            </HTMLFlipBook>
          )}
        </Document>

        <button type="button" onClick={() => bookRef.current?.pageFlip().flipPrev("bottom")} disabled={currentPage === 0} aria-label="Previous catalog page" className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-navy shadow-lg transition hover:bg-brand-orange hover:text-white disabled:pointer-events-none disabled:opacity-25 md:left-6"><ChevronLeft size={30} /></button>
        <button type="button" onClick={() => bookRef.current?.pageFlip().flipNext("bottom")} disabled={currentPage >= pageCount - 1} aria-label="Next catalog page" className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-brand-navy shadow-lg transition hover:bg-brand-orange hover:text-white disabled:pointer-events-none disabled:opacity-25 md:right-6"><ChevronRight size={30} /></button>
      </div>

      <div className="flex h-12 shrink-0 items-center justify-center bg-brand-navy text-sm font-bold text-white">
        {pageCount ? `${currentPage + 1} / ${pageCount}` : "Loading catalog…"}
      </div>
    </div>
  );
}
