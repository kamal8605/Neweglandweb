import { type ReactNode } from "react";
import { Breadcrumb, type BreadcrumbItem } from "./Breadcrumb";

interface PageHeaderProps {
  crumbs?: BreadcrumbItem[];
  title: string;
  accent?: string;
  meta?: string;
  actions?: ReactNode;
}

export function PageHeader({ crumbs, title, accent, meta, actions }: PageHeaderProps) {
  return (
    <div className="px-8 py-5 pb-4 border-b border-brand-line bg-brand-white">
      <div className="flex items-baseline justify-between gap-4 flex-wrap max-w-7xl mx-auto">
        <div className="flex items-baseline gap-4 flex-wrap">
          {crumbs && crumbs.length > 0 && <Breadcrumb items={crumbs} />}
          <h1 className="font-serif text-[36px] leading-none text-brand-ink font-normal tracking-tight m-0">
            {title}
            {accent && (
              <em className="text-brand-blue not-italic"> {accent}</em>
            )}
          </h1>
          {meta && (
            <span className="font-mono text-[11px] text-brand-muted tracking-[0.04em]">
              {meta}
            </span>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
