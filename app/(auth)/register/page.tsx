"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Loader2, CheckCircle } from "lucide-react";
import api from "@/lib/axios";
import { Logo } from "@/components/layout/Logo";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: "" }));
    };
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    if (form.password.length < 8) next.password = "Password must be at least 8 characters.";
    if (form.password !== form.password_confirmation)
      next.password_confirmation = "Passwords do not match.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setServerError(null);
    setLoading(true);

    try {
      await api.post("/auth/register", form);
      setSuccess(true);
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
        ?.response?.data;
      if (data?.errors) {
        // Map validation errors from API (field → first message)
        const mapped: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(data.errors)) {
          mapped[key] = msgs[0];
        }
        setErrors(mapped);
      } else {
        setServerError(data?.message ?? "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-[900px] min-h-[540px] bg-brand-white flex rounded-[var(--brand-radius)] overflow-hidden shadow-lg border border-brand-line">
      {/* Left panel — navy brand */}
      <div className="hidden md:flex flex-col w-[280px] shrink-0 bg-brand-navy p-8 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-brand-orange opacity-90" />
        <div className="absolute right-14 bottom-8 w-20 h-20 rounded-full bg-[#0E2466] opacity-50" />

        <div className="relative z-10 space-y-4">
          <div className="font-mono text-[10px] tracking-[0.12em] text-brand-orange/80 uppercase">
            JOIN THE PLATFORM
          </div>
          <h2 className="text-white text-[22px] font-semibold leading-tight tracking-tight">
            Stock your shelves without stocking your spreadsheet.
          </h2>
          <ul className="space-y-2.5">
            {[
              "600+ vetted wholesale brands",
              "Net-60 payment terms",
              "Free returns on opening orders",
              "No exclusivity requirements",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-[12px] text-[#9DAAC2]">
                <span className="text-brand-orange mt-0.5 shrink-0">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-auto relative z-10 font-mono text-[10px] text-[#6B7A95] uppercase tracking-[0.06em]">
          Trusted by 4,200+ wholesale teams
        </div>
      </div>

      {/* Right panel — form or success */}
      <div className="flex-1 flex flex-col justify-center px-10 py-10">
        <div className="mb-8">
          <Logo />
        </div>

        {success ? (
          /* Success state */
          <div className="flex flex-col items-start gap-4">
            <CheckCircle size={40} className="text-green-500" />
            <div>
              <h2 className="text-[20px] font-semibold tracking-tight text-brand-ink mb-2">
                Application submitted!
              </h2>
              <p className="text-[14px] text-brand-muted leading-relaxed max-w-sm">
                Registration successful. Your account is pending approval before you can log in.
                We'll email you at <strong className="text-brand-ink">{form.email}</strong> once
                your account has been reviewed.
              </p>
            </div>
            <Link
              href="/login"
              className="mt-2 inline-flex items-center gap-2 bg-brand-ink text-brand-white font-semibold text-[13px] px-5 py-2.5 rounded-[var(--brand-radius)] hover:bg-brand-navy transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          /* Registration form */
          <>
            <div className="font-mono text-[10px] tracking-[0.1em] text-brand-orange uppercase mb-2">
              CREATE ACCOUNT
            </div>
            <h1 className="text-[22px] font-semibold tracking-tight text-brand-ink mb-1">
              Apply for buyer access
            </h1>
            <p className="text-[13px] text-brand-muted mb-6">
              Use your business email. We'll review your application within 1–2 business days.
            </p>

            {serverError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-[var(--brand-radius)]">
                <p className="text-[13px] text-red-700">{serverError}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Name */}
              <div>
                <label className="block text-[12px] font-semibold text-brand-ink mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Maya Okafor"
                  required
                  autoComplete="name"
                  className={`w-full h-10 px-3 border rounded-[var(--brand-radius)] text-[14px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 bg-brand-white ${errors.name ? "border-red-400" : "border-brand-line"}`}
                />
                {errors.name && <p className="text-[11px] text-red-600 mt-1">{errors.name}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[12px] font-semibold text-brand-ink mb-1.5">
                  Work email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className={`w-full h-10 px-3 border rounded-[var(--brand-radius)] text-[14px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 bg-brand-white ${errors.email ? "border-red-400" : "border-brand-line"}`}
                />
                {errors.email && <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>}
              </div>

              {/* Password */}
              <div>
                <label className="block text-[12px] font-semibold text-brand-ink mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={update("password")}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={`w-full h-10 px-3 border rounded-[var(--brand-radius)] text-[14px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 bg-brand-white ${errors.password ? "border-red-400" : "border-brand-line"}`}
                />
                {errors.password ? (
                  <p className="text-[11px] text-red-600 mt-1">{errors.password}</p>
                ) : (
                  <p className="text-[11px] text-brand-muted mt-1">Minimum 8 characters.</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-[12px] font-semibold text-brand-ink mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={update("password_confirmation")}
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                  className={`w-full h-10 px-3 border rounded-[var(--brand-radius)] text-[14px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/10 bg-brand-white ${errors.password_confirmation ? "border-red-400" : "border-brand-line"}`}
                />
                {errors.password_confirmation && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.password_confirmation}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-10 bg-brand-ink text-brand-white font-semibold text-[13px] rounded-[var(--brand-radius)] hover:bg-brand-navy transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                Submit application
              </button>
            </form>

            <p className="mt-5 text-[12px] text-brand-muted text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-brand-blue font-semibold hover:text-brand-blue-deep transition-colors">
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
