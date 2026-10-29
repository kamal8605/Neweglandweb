"use client";

import dynamic from "next/dynamic";
import { useEffect, useEffectEvent, useRef, useState, useSyncExternalStore } from "react";
import { BookOpen, Download, LoaderCircle, Maximize2, Minimize2, RotateCcw, X } from "lucide-react";
import { loadFlipbookEngine, mountFlipbook, supportsWebGL } from "@/lib/flipbook3d";

// Without WebGL the 3D engine cannot run; those devices keep the 2D page-curl viewer.
const CatalogFlipbook = dynamic(() => import("./CatalogFlipbook"), { ssr: false });

interface Props {
  file: string;
  title: string;
  onClose: () => void;
}

type Status = "loading" | "opening" | "ready" | "error";

const HEADER_BUTTON = "inline-flex h-9 items-center justify-center gap-2 rounded-md text-xs font-semibold uppercase tracking-wider text-background/85 transition-colors hover:bg-background/10 hover:text-background focus-visible:outline-2 focus-visible:outline-primary";

function subscribeFullscreen(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange);
  return () => document.removeEventListener("fullscreenchange", onChange);
}

export default function Catalog3DFlipbook({ file, title, onClose }: Props) {
  const [webgl] = useState(supportsWebGL);
  if (!webgl) return <CatalogFlipbook file={file} title={title} onClose={onClose} />;
  return <Viewer file={file} title={title} onClose={onClose} />;
}

function Viewer({ file, title, onClose }: Props) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const hostRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);
  const isFullscreen = useSyncExternalStore(subscribeFullscreen, () => !!document.fullscreenElement, () => false);
  const canFullscreen = useSyncExternalStore(subscribeFullscreen, () => !!document.fullscreenEnabled, () => false);
  // The parent passes a new onClose on every render; the effects below must not restart because of it.
  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") onClose();
  });

  // Lock page scroll, close on Escape and return focus to the catalog cover afterwards.
  useEffect(() => {
    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const closeOnEscape = (event: KeyboardEvent) => onKeyDown(event);
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
      previousFocus?.focus();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    let unmount: (() => void) | undefined;
    let frameWindow: Window | null = null;
    // Keys pressed while the book has focus go to the engine's iframe, so Escape is watched there as well.
    const closeOnEscape = (event: KeyboardEvent) => onKeyDown(event);
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    loadFlipbookEngine()
      .then(() => {
        if (cancelled || !hostRef.current) return;
        unmount = mountFlipbook(hostRef.current, file, {
          reducedMotion,
          onReady: () => {
            if (cancelled) return;
            frameWindow = hostRef.current?.querySelector("iframe")?.contentWindow ?? null;
            frameWindow?.addEventListener("keydown", closeOnEscape);
            setStatus("ready");
          },
          onError: (message) => {
            if (cancelled) return;
            console.error("Catalog PDF failed to load", message);
            setStatus("error");
          },
        });
        setStatus("opening");
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        console.error("Catalog viewer failed to load", error);
        setStatus("error");
      });

    return () => {
      cancelled = true;
      frameWindow?.removeEventListener("keydown", closeOnEscape);
      unmount?.();
    };
  }, [file, attempt]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
    else dialogRef.current?.requestFullscreen().catch(() => {});
  };

  return (
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={title} aria-busy={status !== "ready" && status !== "error"} className="fixed inset-0 z-[100] flex flex-col bg-foreground">
      <header className="flex h-12 shrink-0 items-center gap-1 border-b border-background/15 bg-foreground pl-4 pr-2 text-background sm:h-14 sm:gap-2 sm:pl-6 sm:pr-4">
        <BookOpen size={18} aria-hidden="true" className="shrink-0 text-primary" />
        <h2 className="min-w-0 flex-1 truncate pl-1 text-xs font-semibold uppercase tracking-wider sm:text-sm">{title}</h2>
        <a href={file} target="_blank" rel="noopener noreferrer" download className={`${HEADER_BUTTON} px-2.5 no-underline sm:px-3`} title="Download PDF">
          <Download size={17} aria-hidden="true" />
          <span className="sr-only sm:not-sr-only">Download PDF</span>
        </a>
        {canFullscreen && (
          <button type="button" onClick={toggleFullscreen} className={`${HEADER_BUTTON} w-9`} aria-label={isFullscreen ? "Exit full screen" : "Full screen"} title={isFullscreen ? "Exit full screen" : "Full screen"}>
            {isFullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
          </button>
        )}
        <button ref={closeRef} type="button" onClick={onClose} className={`${HEADER_BUTTON} w-9`} aria-label="Close catalog" title="Close">
          <X size={20} />
        </button>
      </header>

      <div className="relative min-h-0 flex-1 bg-[#e9ecef]">
        <div ref={hostRef} className="absolute inset-0" />
        {status === "loading" && (
          <div className="absolute inset-0 grid place-items-center">
            <p className="flex items-center gap-3 text-sm font-semibold text-foreground/70">
              <LoaderCircle size={22} aria-hidden="true" className="animate-spin text-primary motion-reduce:animate-none" /> Loading catalog…
            </p>
          </div>
        )}
        {status === "error" && (
          <div role="alert" className="absolute inset-0 grid place-items-center bg-[#e9ecef] px-6">
            <div className="max-w-sm text-center">
              <p className="text-sm font-semibold text-foreground">The catalog viewer could not be opened.</p>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Check your connection and try again, or open the PDF directly.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button type="button" onClick={() => { setStatus("loading"); setAttempt((value) => value + 1); }} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-colors hover:bg-primary/90">
                  <RotateCcw size={15} aria-hidden="true" /> Try again
                </button>
                <a href={file} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center gap-2 rounded-md border border-border bg-background px-4 text-xs font-semibold uppercase tracking-wider text-foreground no-underline transition-colors hover:bg-muted">
                  <Download size={15} aria-hidden="true" /> Open PDF
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
