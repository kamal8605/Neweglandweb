"use client";

import { useState } from "react";
import { useRequireAuth } from "@/components/auth/withAuth";
import { PageHeader } from "@/components/shared/PageHeader";
import api from "@/lib/axios";

export default function ChangePasswordPage() {
  const { isLoading } = useRequireAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  if (isLoading) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setFieldErrors({ password_confirmation: ["Passwords do not match."] });
      return;
    }

    setSaving(true);
    try {
      const res = await api.patch<{ access_token: string }>("/users/me/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      localStorage.setItem("auth_token", res.data.access_token);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      const data = err?.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      }
      setError(data?.message ?? "Failed to change password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const INPUT =
    "w-full bg-brand-white border border-brand-line rounded-[var(--brand-radius)] px-3 py-2 font-mono text-[13px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue transition-colors";
  const LABEL = "block font-mono text-[11px] tracking-[0.06em] uppercase text-brand-muted mb-1";

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      <PageHeader
        crumbs={[{ label: "Account", href: "/account/profile" }, { label: "Change Password" }]}
        title="Change Password"
      />
      <div className="px-8 py-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={LABEL}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={INPUT}
              required
              autoComplete="current-password"
            />
            {fieldErrors.current_password && (
              <p className="mt-1 font-mono text-[11px] text-[#B83434]">{fieldErrors.current_password[0]}</p>
            )}
          </div>

          <div>
            <label className={LABEL}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={INPUT}
              required
              minLength={8}
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <p className="mt-1 font-mono text-[11px] text-[#B83434]">{fieldErrors.password[0]}</p>
            )}
          </div>

          <div>
            <label className={LABEL}>Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={INPUT}
              required
              minLength={8}
              autoComplete="new-password"
            />
            {fieldErrors.password_confirmation && (
              <p className="mt-1 font-mono text-[11px] text-[#B83434]">{fieldErrors.password_confirmation[0]}</p>
            )}
          </div>

          {error && !Object.keys(fieldErrors).length && (
            <p className="font-mono text-[12px] text-[#B83434]">{error}</p>
          )}
          {success && (
            <p className="font-mono text-[12px] text-[#065F46]">Password changed successfully.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-navy text-white font-mono text-[11px] tracking-[0.08em] uppercase py-2.5 px-4 hover:bg-brand-blue transition-colors disabled:opacity-60 cursor-pointer rounded-[var(--brand-radius)]"
          >
            {saving ? "Saving…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
