"use client";

import { useState } from "react";
import { useRequireAuth } from "@/components/auth/withAuth";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  type Address,
  type NewAddress,
} from "@/hooks/useAddresses";
import { PageHeader } from "@/components/shared/PageHeader";

const EMPTY_FORM: NewAddress = {
  label: "",
  first_name: "",
  last_name: "",
  company: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "AU",
  phone: "",
  is_default: false,
};

function AddressForm({
  initial,
  onSave,
  onCancel,
  saving,
}: {
  initial: NewAddress;
  onSave: (data: NewAddress) => void;
  onCancel: () => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<NewAddress>(initial);
  const set = (field: keyof NewAddress) => (e: { target: { value: string } }) =>
    setForm((f: NewAddress) => ({ ...f, [field]: e.target.value }));

  const INPUT =
    "w-full bg-brand-white border border-brand-line rounded-[var(--brand-radius)] px-3 py-2 font-mono text-[13px] text-brand-ink placeholder:text-brand-muted focus:outline-none focus:border-brand-blue transition-colors";
  const LABEL = "block font-mono text-[11px] tracking-[0.06em] uppercase text-brand-muted mb-1";

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); onSave(form); }}
      className="space-y-4 bg-brand-bg-alt border border-brand-line rounded-[var(--brand-radius)] p-5"
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>First Name *</label>
          <input type="text" value={form.first_name} onChange={set("first_name")} className={INPUT} required maxLength={100} />
        </div>
        <div>
          <label className={LABEL}>Last Name *</label>
          <input type="text" value={form.last_name} onChange={set("last_name")} className={INPUT} required maxLength={100} />
        </div>
      </div>

      <div>
        <label className={LABEL}>Label (e.g. Home, Office)</label>
        <input type="text" value={form.label ?? ""} onChange={set("label")} className={INPUT} maxLength={50} placeholder="Optional" />
      </div>

      <div>
        <label className={LABEL}>Company</label>
        <input type="text" value={form.company ?? ""} onChange={set("company")} className={INPUT} maxLength={255} placeholder="Optional" />
      </div>

      <div>
        <label className={LABEL}>Address Line 1 *</label>
        <input type="text" value={form.address_1} onChange={set("address_1")} className={INPUT} required maxLength={255} />
      </div>

      <div>
        <label className={LABEL}>Address Line 2</label>
        <input type="text" value={form.address_2 ?? ""} onChange={set("address_2")} className={INPUT} maxLength={255} placeholder="Optional" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>City *</label>
          <input type="text" value={form.city} onChange={set("city")} className={INPUT} required maxLength={100} />
        </div>
        <div>
          <label className={LABEL}>State / Region</label>
          <input type="text" value={form.state ?? ""} onChange={set("state")} className={INPUT} maxLength={100} placeholder="Optional" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={LABEL}>Postcode *</label>
          <input type="text" value={form.postcode} onChange={set("postcode")} className={INPUT} required maxLength={20} />
        </div>
        <div>
          <label className={LABEL}>Country *</label>
          <input type="text" value={form.country} onChange={set("country")} className={INPUT} required maxLength={2} placeholder="AU" />
        </div>
      </div>

      <div>
        <label className={LABEL}>Phone</label>
        <input type="tel" value={form.phone ?? ""} onChange={set("phone")} className={INPUT} maxLength={20} placeholder="Optional" />
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={!!form.is_default}
          onChange={(e) => setForm((f) => ({ ...f, is_default: e.target.checked }))}
          className="accent-brand-blue"
        />
        <span className="font-mono text-[11px] tracking-[0.04em] text-brand-ink">Set as default address</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-brand-navy text-white font-mono text-[11px] tracking-[0.08em] uppercase py-2 px-5 hover:bg-brand-blue transition-colors disabled:opacity-60 cursor-pointer rounded-[var(--brand-radius)]"
        >
          {saving ? "Saving…" : "Save Address"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="font-mono text-[11px] tracking-[0.08em] uppercase py-2 px-5 border border-brand-line text-brand-muted hover:text-brand-ink hover:border-brand-ink transition-colors cursor-pointer rounded-[var(--brand-radius)] bg-transparent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function AddressCard({
  address,
  onEdit,
  onDelete,
  onSetDefault,
  deleting,
}: {
  address: Address;
  onEdit: () => void;
  onDelete: () => void;
  onSetDefault: () => void;
  deleting: boolean;
}) {
  return (
    <div className={`border rounded-[var(--brand-radius)] p-4 bg-brand-white relative ${address.is_default ? "border-brand-blue" : "border-brand-line"}`}>
      {address.is_default && (
        <span className="absolute top-3 right-3 font-mono text-[9px] tracking-[0.08em] uppercase bg-brand-blue text-white px-2 py-0.5 rounded-[var(--brand-radius)]">
          Default
        </span>
      )}
      {address.label && (
        <p className="font-mono text-[10px] tracking-[0.06em] uppercase text-brand-muted mb-1">{address.label}</p>
      )}
      <p className="font-mono text-[13px] text-brand-ink font-medium">
        {address.first_name} {address.last_name}
      </p>
      {address.company && (
        <p className="font-mono text-[12px] text-brand-muted">{address.company}</p>
      )}
      <p className="font-mono text-[12px] text-brand-muted mt-1">
        {address.address_1}
        {address.address_2 ? `, ${address.address_2}` : ""}
      </p>
      <p className="font-mono text-[12px] text-brand-muted">
        {address.city}{address.state ? `, ${address.state}` : ""} {address.postcode} {address.country}
      </p>
      {address.phone && (
        <p className="font-mono text-[12px] text-brand-muted mt-0.5">{address.phone}</p>
      )}

      <div className="flex items-center gap-4 mt-3">
        <button
          onClick={onEdit}
          className="font-mono text-[11px] tracking-[0.04em] text-brand-blue hover:text-brand-blue-deep transition-colors cursor-pointer bg-transparent border-none p-0"
        >
          Edit
        </button>
        {!address.is_default && (
          <button
            onClick={onSetDefault}
            className="font-mono text-[11px] tracking-[0.04em] text-brand-muted hover:text-brand-ink transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Set as default
          </button>
        )}
        <button
          onClick={onDelete}
          disabled={deleting}
          className="font-mono text-[11px] tracking-[0.04em] text-[#B83434] hover:text-[#8B2020] transition-colors cursor-pointer bg-transparent border-none p-0 disabled:opacity-60"
        >
          {deleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </div>
  );
}

export default function AddressesPage() {
  const { isLoading: authLoading } = useRequireAuth();
  const { data: addresses, isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  if (authLoading || isLoading) {
    return (
      <div className="bg-brand-bg min-h-screen pb-20">
        <PageHeader crumbs={[{ label: "Account", href: "/account/profile" }, { label: "Addresses" }]} title="Manage Addresses" />
        <div className="px-8 py-8 max-w-2xl mx-auto space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-36 bg-brand-bg-alt rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  function handleCreate(data: NewAddress) {
    createAddress.mutate(data, { onSuccess: () => setShowForm(false) });
  }

  function handleUpdate(id: number, data: NewAddress) {
    updateAddress.mutate({ id, data }, { onSuccess: () => setEditingId(null) });
  }

  function handleDelete(id: number) {
    setDeletingId(id);
    deleteAddress.mutate(id, { onSettled: () => setDeletingId(null) });
  }

  function handleSetDefault(id: number) {
    updateAddress.mutate({ id, data: { is_default: true } });
  }

  const list = addresses ?? [];

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      <PageHeader crumbs={[{ label: "Account", href: "/account/profile" }, { label: "Addresses" }]} title="Manage Addresses" />
      <div className="px-8 py-8 max-w-2xl mx-auto">
        {list.length === 0 && !showForm && (
          <p className="font-mono text-[12px] text-brand-muted mb-6">No addresses saved yet.</p>
        )}

        <div className="space-y-4 mb-6">
          {list.map((addr) =>
            editingId === addr.id ? (
              <AddressForm
                key={addr.id}
                initial={{
                  label: addr.label ?? "",
                  first_name: addr.first_name,
                  last_name: addr.last_name,
                  company: addr.company ?? "",
                  address_1: addr.address_1,
                  address_2: addr.address_2 ?? "",
                  city: addr.city,
                  state: addr.state ?? "",
                  postcode: addr.postcode,
                  country: addr.country,
                  phone: addr.phone ?? "",
                  is_default: addr.is_default,
                }}
                onSave={(data) => handleUpdate(addr.id, data)}
                onCancel={() => setEditingId(null)}
                saving={updateAddress.isPending}
              />
            ) : (
              <AddressCard
                key={addr.id}
                address={addr}
                onEdit={() => setEditingId(addr.id)}
                onDelete={() => handleDelete(addr.id)}
                onSetDefault={() => handleSetDefault(addr.id)}
                deleting={deletingId === addr.id}
              />
            )
          )}
        </div>

        {showForm ? (
          <AddressForm
            initial={EMPTY_FORM}
            onSave={handleCreate}
            onCancel={() => setShowForm(false)}
            saving={createAddress.isPending}
          />
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="font-mono text-[11px] tracking-[0.08em] uppercase py-2 px-5 border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white transition-colors cursor-pointer rounded-[var(--brand-radius)] bg-transparent"
          >
            + Add Address
          </button>
        )}
      </div>
    </div>
  );
}
