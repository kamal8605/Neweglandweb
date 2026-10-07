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
    <div className="inline-flex h-8 items-stretch overflow-hidden rounded-md border border-border bg-background shadow-xs md:h-[26px]">
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || value <= min}
        aria-label="Decrease quantity"
        className="flex w-8 items-center justify-center border-r border-border text-[13px] text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 md:w-[22px]"
      >
        −
      </button>
      <span className="flex w-8 select-none items-center justify-center font-mono text-[12px] text-foreground md:w-9">
        {value}
      </span>
      <button
        type="button"
        onClick={increment}
        disabled={disabled || (max !== undefined && value >= max)}
        aria-label="Increase quantity"
        className="flex w-8 items-center justify-center border-l border-border bg-muted text-[13px] text-foreground transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 md:w-[22px]"
      >
        +
      </button>
    </div>
  );
}
