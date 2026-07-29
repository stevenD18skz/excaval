import { cn } from "@/lib/utils";
import type { BreakdownItem } from "@/lib/excavla/aggregates";
import { formatMoneyShort } from "@/lib/excavla/money";

interface ExpenseBreakdownProps {
  items: BreakdownItem[];
  barHeight?: number;
  className?: string;
}

/** "A dónde se fue el dinero": barra por categoría de egreso, orden fijo. */
export function ExpenseBreakdown({
  items,
  barHeight = 9,
  className,
}: ExpenseBreakdownProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {items.map((item) => (
        <div key={item.cat}>
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-text-2">{item.label}</span>
            <span className="tabular text-text-2">
              {formatMoneyShort(item.amount)} · {item.pct}%
            </span>
          </div>
          <div
            className="mt-1 border border-[rgba(20,20,20,.3)]"
            style={{ height: barHeight }}
          >
            <div
              className="h-full"
              style={{ width: `${item.barPct}%`, backgroundColor: item.fill }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
