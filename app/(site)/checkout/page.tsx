"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Plus, Pencil, X } from "lucide-react";
import { useRequireApproved } from "@/components/auth/withAuth";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useAddresses, useCreateAddress, useUpdateAddress, type Address, type NewAddress } from "@/hooks/useAddresses";
import api from "@/lib/axios";

// ─── Step Indicator ──────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: 1 | 2 | 3 }) {
  const steps = ["Cart", "Checkout", "Confirmation"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2 px-4 py-2.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 ${
                  active
                    ? "bg-brand-orange text-white"
                    : done
                    ? "bg-brand-navy text-white"
                    : "bg-brand-bg-alt text-brand-muted border border-brand-line"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={`font-mono text-[10.5px] tracking-[0.06em] uppercase ${
                  active ? "text-brand-ink" : "text-brand-muted"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-brand-line font-mono text-[12px] select-none">→</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Address Card ─────────────────────────────────────────────────────────────

function AddressCard({
  address,
  selected,
  onSelect,
  onEdit,
}: {
  address: Address;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onSelect()}
      className={`w-full text-left p-4 border-2 transition-colors cursor-pointer ${
        selected
          ? "border-brand-orange bg-brand-orange/5"
          : "border-brand-line hover:border-brand-blue bg-brand-white"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {address.label && (
            <div className="font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted mb-1">
              {address.label}
            </div>
          )}
          <div className="text-[13px] font-medium text-brand-ink">
            {address.first_name} {address.last_name}
          </div>
          {address.company && (
            <div className="text-[12px] text-brand-muted">{address.company}</div>
          )}
          <div className="text-[12px] text-brand-muted mt-1 leading-relaxed">
            {address.address_1}
            {address.address_2 && <>, {address.address_2}</>}
            <br />
            {address.city}, {address.state} {address.postcode}
            <br />
            {address.country}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            title="Edit address"
            className="w-5 h-5 flex items-center justify-center text-brand-muted hover:text-brand-ink transition-colors"
          >
            <Pencil size={11} />
          </button>
          {selected && (
            <span className="w-5 h-5 bg-brand-orange rounded-full flex items-center justify-center">
              <Check size={11} className="text-white" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Address Selector ─────────────────────────────────────────────────────────

function AddressSelector({
  title,
  addresses,
  selected,
  onSelect,
  onAdd,
  onEdit,
}: {
  title: string;
  addresses: Address[];
  selected: Address | null;
  onSelect: (addr: Address) => void;
  onAdd: () => void;
  onEdit: (addr: Address) => void;
}) {
  return (
    <div>
      <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-brand-ink border-b border-brand-ink pb-2 mb-3">
        {title}
      </div>

      {addresses.length === 0 && (
        <p className="font-mono text-[12px] text-brand-muted mb-3">No saved addresses.</p>
      )}

      <div className="grid grid-cols-2 gap-3 mb-3">
        {addresses.map((addr) => (
          <AddressCard
            key={addr.id}
            address={addr}
            selected={selected?.id === addr.id}
            onSelect={() => onSelect(addr)}
            onEdit={() => onEdit(addr)}
          />
        ))}
      </div>

      <button
        onClick={onAdd}
        className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
      >
        <Plus size={12} />
        Add new address
      </button>
    </div>
  );
}

// ─── Address Modal ────────────────────────────────────────────────────────────

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
  country: "US",
  phone: "",
};

function AddressField({
  label,
  value,
  onChange,
  required,
  half,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  half?: boolean;
}) {
  return (
    <div className={half ? "flex-1" : "w-full"}>
      <label className="block font-mono text-[10px] tracking-[0.06em] uppercase text-brand-muted mb-1">
        {label} {required && <span className="text-[#B83434]">*</span>}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-9 px-3 border border-brand-line text-[12.5px] bg-brand-white focus:outline-none focus:border-brand-blue rounded-[var(--brand-radius)]"
      />
    </div>
  );
}

function AddressModal({
  initial,
  onSave,
  onClose,
}: {
  initial?: Address;
  onSave: (addr: Address) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState<NewAddress>(
    initial
      ? {
          label: initial.label ?? "",
          first_name: initial.first_name,
          last_name: initial.last_name,
          company: initial.company ?? "",
          address_1: initial.address_1,
          address_2: initial.address_2 ?? "",
          city: initial.city,
          state: initial.state ?? "",
          postcode: initial.postcode,
          country: initial.country,
          phone: initial.phone ?? "",
        }
      : EMPTY_FORM
  );
  const [error, setError] = useState<string | null>(null);
  const { mutateAsync: createAsync, isPending: isCreating } = useCreateAddress();
  const { mutateAsync: updateAsync, isPending: isUpdating } = useUpdateAddress();
  const isPending = isCreating || isUpdating;

  const set = (k: keyof NewAddress, v: string) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const addr = initial
        ? await updateAsync({ id: initial.id, data: form })
        : await createAsync(form);
      onSave(addr);
    } catch {
      setError("Failed to save address. Please check your details and try again.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-brand-white max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-brand-ink">
          <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-brand-ink">
            {initial ? "Edit address" : "New address"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-brand-muted hover:text-brand-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5">
          <div className="space-y-3">
            <div className="flex gap-3">
              <AddressField label="First name" value={form.first_name} onChange={(v) => set("first_name", v)} required half />
              <AddressField label="Last name" value={form.last_name} onChange={(v) => set("last_name", v)} required half />
            </div>
            <div className="flex gap-3">
              <AddressField label="Label (e.g. Home)" value={form.label ?? ""} onChange={(v) => set("label", v)} half />
              <AddressField label="Company" value={form.company ?? ""} onChange={(v) => set("company", v)} half />
            </div>
            <AddressField label="Address line 1" value={form.address_1} onChange={(v) => set("address_1", v)} required />
            <AddressField label="Address line 2" value={form.address_2 ?? ""} onChange={(v) => set("address_2", v)} />
            <div className="flex gap-3">
              <AddressField label="City" value={form.city} onChange={(v) => set("city", v)} required half />
              <AddressField label="State / Province" value={form.state ?? ""} onChange={(v) => set("state", v)} half />
            </div>
            <div className="flex gap-3">
              <AddressField label="Postcode" value={form.postcode} onChange={(v) => set("postcode", v)} required half />
              <AddressField label="Country" value={form.country} onChange={(v) => set("country", v)} required half />
            </div>
            <AddressField label="Phone" value={form.phone ?? ""} onChange={(v) => set("phone", v)} required />
          </div>

          {error && (
            <p className="mt-3 font-mono text-[11px] text-[#B83434]">{error}</p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="bg-brand-navy text-white font-mono text-[11px] tracking-[0.08em] uppercase px-5 py-2 hover:bg-brand-navy/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving…" : initial ? "Update address" : "Save address"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="font-mono text-[11px] tracking-[0.06em] uppercase text-brand-muted hover:text-brand-ink transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Checkout Page ────────────────────────────────────────────────────────────

interface ModalState {
  initial?: Address;
  onSave: (addr: Address) => void;
}

export default function CheckoutPage() {
  const { isLoading } = useRequireApproved();
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const { data: addresses = [] } = useAddresses();
  const router = useRouter();

  const [billingAddr, setBillingAddr] = useState<Address | null>(null);
  const [shippingAddr, setShippingAddr] = useState<Address | null>(null);
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  function openAddModal(onSave: (addr: Address) => void) {
    setModal({ onSave });
  }

  function openEditModal(addr: Address) {
    setModal({
      initial: addr,
      onSave: (updated) => {
        // Keep selections in sync if this address is currently selected
        if (billingAddr?.id === updated.id) setBillingAddr(updated);
        if (shippingAddr?.id === updated.id) setShippingAddr(updated);
      },
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-60 font-mono text-[11px] text-brand-muted tracking-widest uppercase">
        Loading…
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    if (!billingAddr || !shippingAddr) {
      setError("Please select a billing and shipping address.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const payload = {
      billing_first_name: billingAddr.first_name,
      billing_last_name: billingAddr.last_name,
      billing_company: billingAddr.company,
      billing_address_1: billingAddr.address_1,
      billing_address_2: billingAddr.address_2,
      billing_city: billingAddr.city,
      billing_state: billingAddr.state,
      billing_postcode: billingAddr.postcode,
      billing_country: billingAddr.country,
      billing_email: user?.email ?? "",
      billing_phone: billingAddr.phone ?? "",
      shipping_first_name: shippingAddr.first_name,
      shipping_last_name: shippingAddr.last_name,
      shipping_company: shippingAddr.company,
      shipping_address_1: shippingAddr.address_1,
      shipping_address_2: shippingAddr.address_2,
      shipping_city: shippingAddr.city,
      shipping_state: shippingAddr.state,
      shipping_postcode: shippingAddr.postcode,
      shipping_country: shippingAddr.country,
      customer_note: note || undefined,
      items: items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    try {
      const res = await api.post<{ data: { id: number } }>("/orders", payload);
      clearCart();
      router.push(`/orders/${res.data.data.id}`);
    } catch (err: unknown) {
      const axiosErr = err as { response?: { status?: number; data?: { message?: string } } };
      const status = axiosErr?.response?.status;
      if (status === 422) {
        setError("One or more products are no longer available. Please review your cart.");
      } else if (status === 403) {
        setError("Your account is not approved for ordering yet.");
      } else {
        setError("Failed to place order. Please try again.");
      }
      setSubmitting(false);
    }
  };

  const TH = "px-3 py-2 font-mono text-[10px] tracking-[0.08em] uppercase text-brand-muted border-b border-brand-ink text-left bg-brand-bg-alt";
  const TD = "px-3 py-2.5 text-[12.5px] text-brand-ink border-b border-brand-line align-middle";

  return (
    <div className="bg-brand-bg min-h-screen pb-20">
      {/* Page header */}
      <div className="px-8 py-5 border-b border-brand-line bg-brand-white">
        <div className="flex items-start justify-between">
          <h1 className="font-serif text-[36px] font-normal text-brand-ink leading-none">
            Checkout
          </h1>
          <StepIndicator step={2} />
        </div>
      </div>

      <div className="px-8 py-6 flex gap-6 max-w-[1400px] mx-auto items-start">
        {/* Left — form sections */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Billing address */}
          <section className="bg-brand-white border border-brand-line p-6">
            <AddressSelector
              title="Billing address"
              addresses={addresses}
              selected={billingAddr}
              onSelect={setBillingAddr}
              onAdd={() => openAddModal(setBillingAddr)}
              onEdit={openEditModal}
            />
          </section>

          {/* Shipping address */}
          <section className="bg-brand-white border border-brand-line p-6">
            <AddressSelector
              title="Shipping address"
              addresses={addresses}
              selected={shippingAddr}
              onSelect={setShippingAddr}
              onAdd={() => openAddModal(setShippingAddr)}
              onEdit={openEditModal}
            />
            {billingAddr && shippingAddr?.id !== billingAddr?.id && (
              <button
                onClick={() => setShippingAddr(billingAddr)}
                className="mt-3 font-mono text-[10.5px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
              >
                Use same as billing
              </button>
            )}
          </section>

          {/* Order note */}
          <section className="bg-brand-white border border-brand-line p-6">
            <div className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-brand-ink border-b border-brand-ink pb-2 mb-3">
              Order note
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Customer note / P.O. reference (optional)"
              rows={3}
              className="w-full px-3 py-2 border border-brand-line text-[12.5px] bg-brand-white focus:outline-none focus:border-brand-blue resize-none rounded-[var(--brand-radius)] placeholder:text-brand-muted"
            />
          </section>

          {/* Order review */}
          <section className="bg-brand-white border border-brand-line p-6">
            <div className="flex items-center justify-between border-b border-brand-ink pb-2 mb-3">
              <span className="font-mono text-[10.5px] tracking-[0.1em] uppercase text-brand-ink">
                Order review · {items.length} line{items.length !== 1 ? "s" : ""}
              </span>
              <Link
                href="/cart"
                className="font-mono text-[10px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
              >
                ← Edit in cart
              </Link>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className={TH}>Product</th>
                  <th className={`${TH} text-right w-16`}>Qty</th>
                  <th className={`${TH} text-right w-24`}>Unit price</th>
                  <th className={`${TH} text-right w-24`}>Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.product_id}>
                    <td className={TD}>
                      <div className="text-brand-ink">{item.name}</div>
                      <div className="font-mono text-[10.5px] text-brand-muted">{item.sku}</div>
                    </td>
                    <td className={`${TD} text-right font-mono`}>{item.quantity}</td>
                    <td className={`${TD} text-right font-mono`}>${item.price.toFixed(2)}</td>
                    <td className={`${TD} text-right font-mono font-semibold`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        </div>

        {/* Right — summary */}
        <div className="w-[300px] shrink-0 bg-brand-white border border-brand-line">
          <div className="px-5 py-4 border-b border-brand-ink">
            <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-brand-muted">
              Order summary
            </span>
          </div>

          <div className="px-5 py-4 space-y-3">
            <div className="flex justify-between font-mono text-[12.5px]">
              <span className="text-brand-muted">Subtotal</span>
              <span className="text-brand-ink font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-mono text-[12.5px]">
              <span className="text-brand-muted">Shipping</span>
              <span className="text-brand-muted">TBD</span>
            </div>
            <div className="border-t border-brand-line pt-3 flex justify-between font-mono text-[13.5px]">
              <span className="text-brand-ink font-semibold">Total</span>
              <span className="text-brand-ink font-semibold">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-5 pb-5">
            {error && (
              <p className="mb-3 font-mono text-[11px] text-[#B83434] leading-snug">{error}</p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={submitting || !billingAddr || !shippingAddr || items.length === 0}
              className="w-full bg-brand-orange text-white font-mono text-[11px] tracking-[0.08em] uppercase px-5 py-3 hover:bg-brand-orange/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing order…" : "Place order →"}
            </button>

            <Link
              href="/cart"
              className="block mt-3 text-center font-mono text-[10.5px] tracking-[0.06em] uppercase text-brand-blue hover:text-brand-blue-deep transition-colors"
            >
              ← Back to cart
            </Link>
          </div>
        </div>
      </div>

      {/* Address modal — single instance, prevents simultaneous edits */}
      {modal && (
        <AddressModal
          key={modal.initial?.id ?? "new"}
          initial={modal.initial}
          onSave={(addr) => {
            modal.onSave(addr);
            setModal(null);
          }}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
