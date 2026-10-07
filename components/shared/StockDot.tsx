interface StockDotProps {
  inStock: boolean;
  stockQuantity: number | null;
}

export function StockDot({ inStock, stockQuantity }: StockDotProps) {
  if (!inStock) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
        Out of stock
      </span>
    );
  }

  if (stockQuantity === null) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
        In stock
      </span>
    );
  }

  const dotColor =
    stockQuantity < 100
      ? "#FF6B1A"   // orange — low stock
      : stockQuantity < 400
      ? "#C8951A"   // amber — medium stock
      : "#1F8A3A";  // green — healthy stock

  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-foreground">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ background: dotColor }}
      />
      {stockQuantity.toLocaleString()}
    </span>
  );
}
