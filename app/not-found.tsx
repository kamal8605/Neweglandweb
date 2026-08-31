import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center gap-6 px-8">
      <div className="font-mono text-[11px] tracking-[0.12em] uppercase text-brand-orange">
        Error 404
      </div>
      <h1 className="font-serif text-[64px] font-normal text-brand-ink leading-none tracking-tight">
        Page not found
      </h1>
      <p className="font-mono text-[13px] text-brand-muted max-w-md text-center leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <div className="flex items-center gap-6 mt-2">
        <Link
          href="/"
          className="font-mono text-[11px] tracking-[0.08em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
        >
          ← Back to home
        </Link>
        <Link
          href="/shop"
          className="bg-brand-navy text-white font-mono text-[11px] tracking-[0.08em] uppercase px-5 py-2.5 hover:bg-brand-navy/90 transition-colors"
        >
          Browse shop →
        </Link>
      </div>
    </div>
  );
}
