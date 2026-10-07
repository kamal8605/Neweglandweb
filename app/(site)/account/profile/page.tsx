"use client";

import { useState } from "react";
import { useRequireAuth } from "@/components/auth/withAuth";
import { useAuth, type User } from "@/context/AuthContext";
import { PageHeader } from "@/components/shared/PageHeader";
import api from "@/lib/axios";

export default function EditProfilePage() {
  const { isLoading } = useRequireAuth();
  const { user } = useAuth();

  // On a direct load / refresh the account is fetched after the first render. The form is only mounted once
  // the user is known, so its fields start from the real values; keying by id remounts it only for a different
  // account, never on updateUser() after a save, so unsaved edits are not overwritten.
  if (isLoading || !user) {
    return (
      <div className="flex h-60 items-center justify-center text-[11px] uppercase tracking-widest text-muted-foreground">
        Loading…
      </div>
    );
  }
  return <ProfileForm key={user.id} user={user} />;
}

function ProfileForm({ user }: { user: User }) {
  const { updateUser } = useAuth();

  const [name, setName] = useState(user.name ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [phone, setPhone] = useState(user.phone ?? "");
  const [address, setAddress] = useState(user.address ?? "");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await api.patch<{ user: { name: string; email: string; phone?: string; address?: string } }>(
        `/users/${user.id}`,
        { name, email, phone: phone || undefined, address: address || undefined }
      );
      updateUser({ name: res.data.user.name, email: res.data.user.email, phone: res.data.user.phone, address: res.data.user.address });
      setSuccess(true);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message ?? "Failed to update profile. Please try again.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  }

  const INPUT =
    "w-full min-h-10 rounded-md border border-input bg-background px-3 py-2 text-[14px] text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20 transition-colors";
  const LABEL = "block text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-1";

  return (
    <div className="bg-background min-h-screen pb-28 md:pb-20">
      <PageHeader crumbs={[{ label: "Account", href: "/account/profile" }, { label: "Edit Profile" }]} title="Edit Profile" />
      <div className="px-4 md:px-8 py-8 max-w-lg mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="profile-full-name" className={LABEL}>Full Name</label>
            <input id="profile-full-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
              required
              maxLength={255}
            />
          </div>

          <div>
            <label htmlFor="profile-email-address" className={LABEL}>Email Address</label>
            <input id="profile-email-address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={INPUT}
              required
            />
          </div>

          <div>
            <label htmlFor="profile-phone-number" className={LABEL}>Phone Number</label>
            <input id="profile-phone-number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={INPUT}
              maxLength={20}
              placeholder="Optional"
            />
          </div>

          <div>
            <label htmlFor="profile-address" className={LABEL}>Address</label>
            <textarea id="profile-address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`${INPUT} resize-none`}
              rows={3}
              maxLength={500}
              placeholder="Optional"
            />
          </div>

          {error && (
            <p className="text-[12px] text-destructive">{error}</p>
          )}
          {success && (
            <p className="text-[12px] text-emerald-700">Profile updated successfully.</p>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-md bg-primary px-4 py-2.5 text-[12px] font-medium tracking-[0.04em] uppercase text-primary-foreground shadow-xs transition-colors hover:bg-primary/90 disabled:opacity-60 cursor-pointer"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
