"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, lastPage, onPageChange }: PaginationProps) {
  if (lastPage <= 1) return null;

  // Build page number array with ellipsis markers
  function buildPages(): (number | "...")[] {
    if (lastPage <= 7) {
      return Array.from({ length: lastPage }, (_, i) => i + 1);
    }
    const pages: (number | "...")[] = [1];
    if (currentPage > 3) pages.push("...");
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(lastPage - 1, currentPage + 1); p++) {
      pages.push(p);
    }
    if (currentPage < lastPage - 2) pages.push("...");
    pages.push(lastPage);
    return pages;
  }

  const pages = buildPages();

  return (
    <div className="flex items-center gap-1 font-mono text-[12px]">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center border border-brand-line rounded-[var(--brand-radius)] text-brand-muted hover:border-brand-ink hover:text-brand-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={14} />
      </button>

      {pages.map((p, i) =>
        p === "..." ? (
          <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-brand-muted">
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={cn(
              "w-8 h-8 flex items-center justify-center border rounded-[var(--brand-radius)] transition-colors",
              p === currentPage
                ? "bg-brand-ink text-brand-white border-brand-ink"
                : "border-brand-line text-brand-muted hover:border-brand-ink hover:text-brand-ink"
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="w-8 h-8 flex items-center justify-center border border-brand-line rounded-[var(--brand-radius)] text-brand-muted hover:border-brand-ink hover:text-brand-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
