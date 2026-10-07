import type { ReactNode } from "react";

export function StaticContentPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <main className="bg-brand-bg px-4 py-12 sm:px-8 sm:py-16">
      <article className="mx-auto max-w-4xl border border-brand-line bg-white p-6 shadow-sm sm:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-brand-orange">{eyebrow}</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight text-brand-navy sm:text-4xl">{title}</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-brand-muted [&_a]:text-brand-blue [&_a]:underline [&_h2]:pt-2 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-brand-navy [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-brand-ink">
          {children}
        </div>
      </article>
    </main>
  );
}
