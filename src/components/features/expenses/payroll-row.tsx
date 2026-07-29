import { cn } from "@/lib/utils";
import type { PayrollEntry } from "@/lib/excaval/types";
import { initials } from "@/lib/excaval/format";
import { Money } from "@/components/shared/money";
import { StatusBadge } from "@/components/shared/status-badge";

interface PayrollRowProps {
  entry: PayrollEntry;
  size?: "sm" | "lg";
  className?: string;
}

/** Fila de operario: avatar con iniciales + nombre/rol + monto + estado de pago. */
export function PayrollRow({ entry, size = "sm", className }: PayrollRowProps) {
  const avatarSize = size === "lg" ? "h-[46px] w-[46px] text-sm" : "h-10 w-10 text-[14px]";
  const amountSize = size === "lg" ? "text-lg" : "text-base";

  return (
    <div className={cn("flex items-center gap-3 border border-divider p-2.5", className)}>
      <span
        className={cn(
          "flex shrink-0 items-center justify-center border border-ink bg-surface font-heading font-semibold text-ink",
          avatarSize
        )}
      >
        {initials(entry.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-[15.5px] font-semibold text-ink">
          {entry.name}
        </span>
        <span className="block truncate text-[11px] text-text-3">{entry.role}</span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className={cn("tabular font-heading font-semibold text-ink", amountSize)}>
          <Money value={entry.amount} />
        </span>
        <StatusBadge tone={entry.paid ? "working" : "available"} className="text-[10px]">
          {entry.paid ? "Pagado" : "Pendiente"}
        </StatusBadge>
      </span>
    </div>
  );
}
