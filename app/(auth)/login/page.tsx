"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Logo } from "@/components/layout/Logo";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setIsPending(false);
    setLoading(true);

    try {
      await login(email, password);
      router.push("/");
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
    <div className="w-full max-w-[900px] min-h-[540px] bg-brand-white flex rounded-[var(--brand-radius)] overflow-hidden shadow-lg border border-brand-line">
      {/* Left panel — navy brand */}
      <div className="hidden md:flex flex-col w-[280px] shrink-0 bg-brand-navy p-8 relative overflow-hidden">
        {/* Decorative orange circle */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-brand-orange opacity-90" />
        <div className="absolute right-14 bottom-8 w-20 h-20 rounded-full bg-[#0E2466] opacity-50" />

        <div className="relative z-10">
          <div className="font-mono text-[10px] tracking-[0.12em] text-brand-orange/80 uppercase mb-4">
            WHOLESALE OS
          </div>
          <h2 className="text-white text-[22px] font-semibold leading-tight tracking-tight mb-3">
            Built for buyers, suppliers, and everyone in&nbsp;between.
          </h2>
          <p className="text-[#9DAAC2] text-[13px] leading-relaxed">
            Net terms, custom catalogs, and approval flows — without the spreadsheets.
          </p>
        </div>

        <div className="mt-auto relative z-10 font-mono text-[10px] text-[#6B7A95] uppercase tracking-[0.06em]">
          Trusted by 4,200+ wholesale teams
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col justify-center px-10 py-10">
        <div className="mb-8">
          <Logo />
        </div>

        <div className="font-mono text-[10px] tracking-[0.1em] text-brand-orange uppercase mb-2">
          SIGN IN
        </div>
        <h1 className="text-[22px] font-semibold tracking-tight text-brand-ink mb-1">
          Welcome back
        </h1>
        <p className="text-[13px] text-brand-muted mb-6">
          Sign in to access your wholesale account.
        </p>

        {/* Pending approval notice */}
        {isPending && (
          <div className="mb-4 p-3 bg-brand-orange-soft border border-brand-orange/30 rounded-[var(--brand-radius)]">
            <p className="text-[13px] text-brand-ink font-medium">Account pending approval</p>
            <p className="text-[12px] text-brand-muted mt-0.5">
              Your account is under review. You'll receive an email once approved.
            </p>
          </div>
        )}

        {/* General error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[var(--brand-radius)]">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[12px] font-semibold text-brand-ink mb-1.5">
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              required
              autoComplete="email"
              className="w-full h-10 px-3 border border-brand-line rounded-[var(--brand-radius)] text-[14px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 bg-brand-white"
            />
          </div>

          <div>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="block text-[12px] font-semibold text-brand-ink">
                Password
              </label>
              <a href="#" className="text-[11px] text-brand-blue hover:text-brand-blue-deep transition-colors">
                Forgot password?
              </a>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="w-full h-10 px-3 border border-brand-line rounded-[var(--brand-radius)] text-[14px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 bg-brand-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 bg-brand-ink text-brand-white font-semibold text-[13px] rounded-[var(--brand-radius)] hover:bg-brand-navy transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Sign in
          </button>
        </form>

        <p className="mt-6 text-[12px] text-brand-muted text-center">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand-blue font-semibold hover:text-brand-blue-deep transition-colors">
            Apply for access
          </Link>
        </p>
      </div>
    </div>
  );
}
