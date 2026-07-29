import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Expense } from "@/lib/excaval/types";
import { EXPENSE_CAT_META } from "@/lib/excaval/types";
import { Plate, type PlateVariant } from "@/components/shared/plate";
import { Money } from "@/components/shared/money";

const CAT_PLATE_VARIANT: Record<Expense["cat"], PlateVariant> = {
  GASOLINA: "accent",
  REPUESTO: "surface",
  REPARACION: "tint",
  PUNTO: "paper",
  SUELDO: "dark",
};

interface ExpenseCardProps {
  expense: Expense;
  size?: "sm" | "lg";
  className?: string;
}

/** Fila de gasto: placa coloreada por categoría + descripción + metadato + monto. */
export function ExpenseCard({ expense, size = "sm", className }: ExpenseCardProps) {
  const meta = EXPENSE_CAT_META[expense.cat];
  const plateSize = size === "lg" ? "h-[46px] w-[46px] text-xs" : "h-[42px] w-[42px] text-[11px]";
  const descSize = size === "lg" ? "text-[16.5px]" : "text-[15.5px]";
  const amountSize = size === "lg" ? "text-[19px]" : "text-[17px]";

  return (
    <div className={cn("flex items-center gap-3 border border-divider p-2.5", className)}>
      <Plate variant={CAT_PLATE_VARIANT[expense.cat]} className={cn("shrink-0", plateSize)}>
        {meta.code}
      </Plate>
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate font-heading font-semibold text-ink", descSize)}>
          {expense.desc}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-text-3">
          <span className="truncate">
            {expense.date} · {meta.label}
            {expense.machine !== "—" ? ` · ${expense.machine}` : ""}
          </span>
          {expense.photo ? (
            <span className="flex shrink-0 items-center gap-0.5 text-accent-700">
              <Camera className="h-3 w-3" strokeWidth={1.6} />
              recibo
            </span>
          ) : null}
        </span>
      </span>
      <span className={cn("tabular font-heading shrink-0 font-semibold text-ink", amountSize)}>
        <Money value={expense.amount} sign="negative" />
      </span>
    </div>
  );
}
