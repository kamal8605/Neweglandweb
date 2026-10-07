"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/layout/Logo";

/**
 * Only same-site paths are allowed after login. Resolving against the current origin also rejects
 * "//evil.com" and "/\evil.com" (browsers treat the backslash as a slash), preventing an open redirect.
 */
const noopSubscribe = () => () => {};

/**
 * false in the server HTML, true once React has hydrated. Until then the submit button stays disabled:
 * a native submit at that point would just reload /login (losing what was typed) instead of signing in.
 * A disabled default button also blocks implicit (Enter-key) submission, so nothing is sent early.
 */
function useHydrated() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

function safeReturnPath(requested: string | null): string {
  if (!requested || !requested.startsWith("/")) return "/";
  try {
    const url = new URL(requested, window.location.origin);
    return url.origin === window.location.origin ? `${url.pathname}${url.search}${url.hash}` : "/";
  } catch {
    return "/";
  }
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const hydrated = useHydrated();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(false);
    setLoading(true);

    try {
      await login(email, password);
      router.replace(safeReturnPath(new URLSearchParams(window.location.search).get("returnTo")));
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number; data?: { message?: string } } })?.response?.status;
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "";

      if (status === 403 || message.toLowerCase().includes("pending")) {
        setIsPending(true);
      } else if (status === 401 || status === 422) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[900px] min-h-[540px] bg-card text-card-foreground flex overflow-hidden rounded-xl border border-border shadow-sm">
      {/* Left panel — navy brand */}
      <div className="hidden md:flex flex-col w-[280px] shrink-0 bg-neutral-950 p-8 relative overflow-hidden">
        {/* Decorative orange circle */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-primary opacity-90" />
        <div className="absolute right-14 bottom-8 w-20 h-20 rounded-full bg-primary/30" />

        <div className="relative z-10">
          <div className="text-[10px] font-medium tracking-[0.12em] text-primary uppercase mb-4">
            WHOLESALE OS
          </div>
          <h2 className="text-white text-[22px] font-semibold leading-tight tracking-tight mb-3">
            Built for buyers, suppliers, and everyone in&nbsp;between.
          </h2>
          <p className="text-neutral-400 text-[13px] leading-relaxed">
            Net terms, custom catalogs, and approval flows — without the spreadsheets.
          </p>
        </div>

        <div className="mt-auto relative z-10 text-[10px] font-medium text-neutral-500 uppercase tracking-[0.06em]">
          Trusted by 4,200+ wholesale teams
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10">
        <div className="mb-8">
          <Logo loading="eager" />
        </div>

        <div className="text-[10px] font-medium tracking-[0.1em] text-primary uppercase mb-2">
          SIGN IN
        </div>
        <h1 className="text-[22px] font-semibold tracking-tight text-foreground mb-1">
          Welcome back
        </h1>
        <p className="text-[13px] text-muted-foreground mb-6">
          Sign in to access your wholesale account.
        </p>

        {/* Pending approval notice */}
        {isPending && (
          <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <p className="text-[13px] text-foreground font-medium">Account pending approval</p>
            <p className="text-[12px] text-muted-foreground mt-0.5">
              Your account is under review. You&apos;ll receive an email once approved.
            </p>
          </div>
        )}

        {/* General error */}
        {error && (
          <div className="mb-4 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
            <p className="text-[13px] text-destructive">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="login-email-address" className="block text-[12px] font-medium text-foreground mb-1.5">
              Email address
            </label>
            <input id="login-email-address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-[14px] text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label htmlFor="login-password" className="block text-[12px] font-medium text-foreground">
                Password
              </label>
              <a href="mailto:sales@newenglanddistro.com?subject=Password%20reset%20request" className="inline-flex min-h-6 items-center text-[11px] font-medium text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </a>
            </div>
            <input id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full h-10 rounded-md border border-input bg-background px-3 text-[14px] text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !hydrated}
            aria-busy={loading || undefined}
            className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium text-[13px] shadow-xs hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-[12px] text-muted-foreground text-center">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary font-semibold hover:text-primary/80 transition-colors">
            Apply for access
          </Link>
        </p>
      </div>
    </div>
  );
}
