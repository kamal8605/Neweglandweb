"use client";

import { useState } from "react";
import { useRequireAuth } from "@/components/auth/withAuth";
import { useAuth } from "@/context/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import api from "@/lib/axios";

export default function EditProfilePage() {
  const { isLoading } = useRequireAuth();
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState(user?.address ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (isLoading) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.patch<{ user: { name: string; email: string; phone?: string; address?: string } }>(
        `/users/${user!.id}`,
        { name, email, phone: phone || undefined, address: address || undefined }
      );
      updateUser({ name: res.data.user.name, email: res.data.user.email, phone: res.data.user.phone, address: res.data.user.address });
      setSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to update profile. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  const INPUT =
    "w-full bg-brand-white border border-brand-line rounded-[var(--brand-radius)] px-3 py-2 font-mono text-[13px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue transition-colors";
  const LABEL = "block font-mono text-[11px] tracking-[0.06em] uppercase text-brand-muted mb-1";

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      <PageHeader crumbs={[{ label: "Account", href: "/account/profile" }, { label: "Edit Profile" }]} title="Edit Profile" />
      <div className="px-8 py-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className={LABEL}>Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
              required
              maxLength={255}
            />
          </div>

          <div>
            <label className={LABEL}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT}
              required
            />
          </div>

          <div>
            <label className={LABEL}>Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={INPUT}
              maxLength={20}
              placeholder="Optional"
            />
          </div>

          <div>
            <label className={LABEL}>Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${INPUT} resize-none`}
              rows={3}
              maxLength={500}
              placeholder="Optional"
            />
          </div>

          {error && (
            <p className="font-mono text-[12px] text-[#B83434]">{error}</p>
          )}
          {success && (
            <p className="font-mono text-[12px] text-[#065F46]">Profile updated successfully.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-brand-navy text-white font-mono text-[11px] tracking-[0.08em] uppercase py-2.5 px-4 hover:bg-brand-blue transition-colors disabled:opacity-60 cursor-pointer rounded-[var(--brand-radius)]"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
