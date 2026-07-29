import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: ReactNode;
  value: ReactNode;
  sub?: ReactNode;
  icon?: ReactNode;
  /** Color del label + icono (ej. text-[#1c7a4b] para ingresos, text-[#b3341f] para egresos). */
  labelClassName?: string;
  className?: string;
}

/** Tarjeta de KPI hairline: label con icono, cifra grande tabular, submeta. */
export function StatCard({
  label,
  value,
  sub,
  icon,
  labelClassName,
  className,
}: StatCardProps) {
  return (
    <div className={cn("border border-divider bg-paper p-3", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5 font-heading text-[10px] font-semibold tracking-[.14em] uppercase",
          labelClassName
        )}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div className="tabular font-heading mt-1.5 text-2xl font-semibold text-ink lg:text-[30px]">
        {value}
      </div>
      {sub ? <div className="mt-1 text-[11px] text-text-3">{sub}</div> : null}
    </div>
  );
}
