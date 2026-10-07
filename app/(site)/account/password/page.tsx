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
      const res = await api.patch<{ access_token?: string }>("/users/me/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      if (res.data.access_token) localStorage.setItem("auth_token", res.data.access_token);
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const data = (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
        ?.response?.data;
      if (data?.errors) {
        setFieldErrors(data.errors);
      }
      setError(data?.message ?? "Failed to change password. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const INPUT =
    "w-full min-h-10 rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 transition-colors";
  const LABEL = "block text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-1";

  return (
    <div className="bg-background min-h-screen pb-28 md:pb-20">
      <PageHeader
        crumbs={[{ label: "Account", href: "/account/profile" }, { label: "Change Password" }]}
        title="Change Password"
      />
      <div className="px-4 md:px-8 py-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="password-current-password" className={LABEL}>Current Password</label>
            <input id="password-current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={INPUT}
              required
              autoComplete="current-password"
            />
            {fieldErrors.current_password && (
              <p className="mt-1 text-[11px] text-destructive">{fieldErrors.current_password[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password-new-password" className={LABEL}>New Password</label>
            <input id="password-new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className={INPUT}
              required
              minLength={8}
              autoComplete="new-password"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-[11px] text-destructive">{fieldErrors.password[0]}</p>
            )}
          </div>

          <div>
            <label htmlFor="password-confirm-new-password" className={LABEL}>Confirm New Password</label>
            <input id="password-confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={INPUT}
              required
              minLength={8}
              autoComplete="new-password"
            />
            {fieldErrors.password_confirmation && (
              <p className="mt-1 text-[11px] text-destructive">{fieldErrors.password_confirmation[0]}</p>
            )}
          </div>

          {error && !Object.keys(fieldErrors).length && (
            <p className="text-[12px] text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-[12px] text-emerald-700">Password changed successfully.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-[12px] font-medium tracking-[0.04em] uppercase text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Saving…" : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
