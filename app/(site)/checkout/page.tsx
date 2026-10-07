"use client";

import { useId, useState } from "react";
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
            <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2.5">
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-medium shrink-0 ${
                  active
                    ? "bg-primary text-primary-foreground"
                    : done
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground border border-border"
                }`}
              >
                {done ? "✓" : n}
              </span>
              <span
                className={`text-[10.5px] font-medium tracking-[0.06em] uppercase ${
                  active ? "text-foreground" : "sr-only text-muted-foreground sm:not-sr-only"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <span className="text-border text-[12px] select-none">→</span>
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
      className={`w-full rounded-lg border p-4 text-left shadow-xs transition-colors cursor-pointer ${
        selected
          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
          : "border-border hover:border-primary/50 bg-card"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {address.label && (
            <div className="text-[10px] font-medium tracking-[0.08em] uppercase text-muted-foreground mb-1">
              {address.label}
            </div>
          )}
          <div className="text-[13px] font-medium text-foreground">
            {address.first_name} {address.last_name}
          </div>
          {address.company && (
            <div className="text-[12px] text-muted-foreground">{address.company}</div>
          )}
          <div className="text-[12px] text-muted-foreground mt-1 leading-relaxed">
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
            aria-label="Edit address"
            className="-m-2 w-9 h-9 lg:m-0 lg:w-5 lg:h-5 flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <Pencil size={11} />
          </button>
          {selected && (
            <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Check size={11} className="text-primary-foreground" />
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
      <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-foreground border-b border-border pb-2 mb-3">
        {title}
      </div>

      {addresses.length === 0 && (
        <p className="text-[12px] text-muted-foreground mb-3">No saved addresses.</p>
      )}

      <div className="mb-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
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
        className="flex min-h-10 lg:min-h-0 items-center gap-1.5 text-[10.5px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
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
  const id = useId();
  return (
    <div className={half ? "flex-1" : "w-full"}>
      <label htmlFor={id} className="block text-[10px] font-medium tracking-[0.06em] uppercase text-muted-foreground mb-1">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <input
        id={id}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full h-9 rounded-md border border-input bg-background px-3 text-[12.5px] text-foreground shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
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
      <div className="absolute inset-0 bg-black/50" />

      {/* Panel */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-border bg-card text-card-foreground shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border">
          <span className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-foreground">
            {initial ? "Edit address" : "New address"}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-4 sm:px-6 py-5">
          <div className="space-y-3">
            <div className="flex flex-col gap-3 sm:flex-row">
              <AddressField label="First name" value={form.first_name} onChange={(v) => set("first_name", v)} required half />
              <AddressField label="Last name" value={form.last_name} onChange={(v) => set("last_name", v)} required half />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AddressField label="Label (e.g. Home)" value={form.label ?? ""} onChange={(v) => set("label", v)} half />
              <AddressField label="Company" value={form.company ?? ""} onChange={(v) => set("company", v)} half />
            </div>
            <AddressField label="Address line 1" value={form.address_1} onChange={(v) => set("address_1", v)} required />
            <AddressField label="Address line 2" value={form.address_2 ?? ""} onChange={(v) => set("address_2", v)} />
            <div className="flex flex-col gap-3 sm:flex-row">
              <AddressField label="City" value={form.city} onChange={(v) => set("city", v)} required half />
              <AddressField label="State / Province" value={form.state ?? ""} onChange={(v) => set("state", v)} half />
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <AddressField label="Postcode" value={form.postcode} onChange={(v) => set("postcode", v)} required half />
              <AddressField label="Country" value={form.country} onChange={(v) => set("country", v)} required half />
            </div>
            <AddressField label="Phone" value={form.phone ?? ""} onChange={(v) => set("phone", v)} required />
          </div>

          {error && (
            <p className="mt-3 text-[11px] text-destructive">{error}</p>
          )}

          <div className="mt-5 flex items-center gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="rounded-md bg-primary px-5 py-2 text-[11px] font-medium tracking-[0.08em] uppercase text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? "Saving…" : initial ? "Update address" : "Save address"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-2 text-[11px] font-medium tracking-[0.06em] uppercase text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
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
  const { items, subtotal, refreshCart, isLoaded: cartLoaded } = useCart();
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

  if (isLoading || !cartLoaded) {
    return (
      <div className="flex items-center justify-center h-60 text-[11px] font-medium text-muted-foreground tracking-widest uppercase">
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
    if (items.some((item) => item.in_stock === false)) {
      setError("Some items in your cart are out of stock. Please remove them from your cart first.");
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
      // The server removes the ordered products from the account cart; re-read it so every device agrees.
      void refreshCart();
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

  const TH = "px-3 py-2 text-[10px] font-medium tracking-[0.08em] uppercase text-muted-foreground border-b border-border text-left bg-muted/60";
  const TD = "px-3 py-2.5 text-[12.5px] text-foreground border-b border-border align-middle";

  return (
    <div className="min-h-screen bg-muted/30 pb-28 md:pb-20">
      {/* Page header */}
      <div className="border-b border-border bg-card px-4 py-5 sm:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <h1 className="text-[26px] sm:text-[32px] lg:text-[36px] font-semibold text-foreground tracking-tight leading-tight">
            Checkout
          </h1>
          <div className="max-w-full overflow-x-auto"><StepIndicator step={2} /></div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1400px] flex-col items-stretch gap-6 px-4 py-6 sm:px-8 lg:flex-row lg:items-start">
        {/* Left — form sections */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Billing address */}
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
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
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
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
                className="mt-3 text-[10.5px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
              >
                Use same as billing
              </button>
            )}
          </section>

          {/* Order note */}
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-foreground border-b border-border pb-2 mb-3">
              Order note
            </div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Customer note / P.O. reference (optional)"
              rows={3}
              className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-[12.5px] text-foreground shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/20"
            />
          </section>

          {/* Order review */}
          <section className="rounded-lg border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-3">
              <span className="text-[10.5px] font-semibold tracking-[0.1em] uppercase text-foreground">
                Order review · {items.length} line{items.length !== 1 ? "s" : ""}
              </span>
              <Link
                href="/cart"
                className="inline-flex min-h-6 items-center text-[10px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
              >
                ← Edit in cart
              </Link>
            </div>
            <div className="overflow-x-auto">
            <table className="w-full sm:min-w-[560px]">
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
                      <div className="text-foreground">{item.name}</div>
                      <div className="text-[10.5px] text-muted-foreground">{item.sku}</div>
                    </td>
                    <td className={`${TD} text-right`}>{item.quantity}</td>
                    <td className={`${TD} text-right`}>${item.price.toFixed(2)}</td>
                    <td className={`${TD} text-right font-semibold`}>
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </section>
        </div>

        {/* Right — summary */}
        <div className="w-full shrink-0 rounded-lg border border-border bg-card shadow-sm lg:w-[300px]">
          <div className="px-5 py-4 border-b border-border">
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase text-foreground">
              Order summary
            </span>
          </div>

          <div className="px-5 py-4 space-y-3">
            <div className="flex justify-between text-[12.5px]">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground font-semibold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[12.5px]">
              <span className="text-muted-foreground">Shipping</span>
              <span className="text-muted-foreground">TBD</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-[13.5px]">
              <span className="text-foreground font-semibold">Total</span>
              <span className="text-foreground font-semibold">${subtotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="px-5 pb-5">
            {error && (
              <p className="mb-3 text-[11px] text-destructive leading-snug">{error}</p>
            )}

            <button
              onClick={handlePlaceOrder}
              disabled={submitting || !billingAddr || !shippingAddr || items.length === 0}
              className="w-full rounded-md bg-primary px-5 py-3 text-[11px] font-medium tracking-[0.08em] uppercase text-primary-foreground shadow-xs hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? "Placing order…" : "Place order →"}
            </button>

            <Link
              href="/cart"
              className="block mt-3 py-2 lg:py-0 text-center text-[10.5px] font-medium tracking-[0.06em] uppercase text-primary hover:text-primary/80 transition-colors"
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
