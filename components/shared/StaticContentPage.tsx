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
    <main className="bg-muted/30 px-4 py-12 sm:px-8 sm:py-16">
      <article className="mx-auto max-w-4xl rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">{eyebrow}</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold leading-tight text-foreground sm:text-4xl">{title}</h1>
        <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_h2]:pt-2 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">
          {children}
        </div>
      </article>
    </main>
  );
}
