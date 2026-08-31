"use client";

interface QtyStepperProps {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QtyStepper({ value, onChange, min = 0, max, disabled = false }: QtyStepperProps) {
  const decrement = () => onChange(Math.max(min, value - 1));
  const increment = () => {
    if (max !== undefined && value >= max) return;
    onChange(value + 1);
  };

  return (
    <div className="inline-flex border border-brand-line h-[26px] items-stretch rounded-[var(--brand-radius)] overflow-hidden">
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="w-[22px] flex items-center justify-center border-r border-brand-line text-brand-muted text-[13px] hover:bg-brand-bg-alt disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        −
      </button>
      <span className="w-9 flex items-center justify-center font-mono text-[12px] text-brand-ink select-none">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label="Increase quantity"
        className="w-[22px] flex items-center justify-center border-l border-brand-line text-brand-ink text-[13px] bg-brand-bg-alt hover:bg-brand-line disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        +
      </button>
    </div>
  );
}
