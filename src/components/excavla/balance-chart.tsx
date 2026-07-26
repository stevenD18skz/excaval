import { cn } from "@/lib/utils";
import type { MonthSummary } from "@/lib/excavla/aggregates";
import { SectionLabel } from "./section-label";

interface BalanceChartProps {
  months: MonthSummary[];
  height?: number;
  gap?: number;
  showNetDelta?: boolean;
  className?: string;
}

/** Gráfico de balance de 6 meses: barras de ingresos (amarillo) vs egresos (trama). */
export function BalanceChart({
  months,
  height = 126,
  gap = 9,
  showNetDelta = false,
  className,
}: BalanceChartProps) {
  const scale = Math.max(...months.flatMap((m) => [m.ingresos, m.egresos])) * 1.06;
  const currentMonth = months[months.length - 1]?.month;

  return (
    <div className={className}>
      <SectionLabel trailing={<span className="text-[10px] text-text-3">millones COP</span>}>
        Balance · 6 meses
      </SectionLabel>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-text-3">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-3 border border-ink bg-accent-500" aria-hidden />
          Ingresos
        </span>
        <span className="flex items-center gap-1.5">
          <span className="egreso-hatch inline-block h-2.5 w-3 border border-ink" aria-hidden />
          Egresos
        </span>
      </div>

      <div className="mt-3 flex items-end" style={{ height, gap }}>
        {months.map((m) => {
          const ingresosH = scale > 0 ? (m.ingresos / scale) * 100 : 0;
          const egresosH = scale > 0 ? (m.egresos / scale) * 100 : 0;
          const isCurrent = m.month === currentMonth;
          const neta = m.ingresos - m.egresos;

          return (
            <div key={m.month} className="flex h-full flex-1 flex-col items-center">
              <div className="flex w-full flex-1 items-end justify-center gap-[3px]">
                <div
                  className="w-full border border-b-0 border-ink bg-accent-500"
                  style={{ height: `${ingresosH}%` }}
                  aria-hidden
                />
                <div
                  className="egreso-hatch w-full border border-ink"
                  style={{ height: `${egresosH}%` }}
                  aria-hidden
                />
              </div>
              <div className="h-px w-full bg-ink" aria-hidden />
              <div
                className={cn(
                  "mt-1.5 font-heading text-[10.5px] font-semibold tracking-[.1em] uppercase",
                  isCurrent ? "text-ink" : "text-text-4"
                )}
              >
                {m.month}
              </div>
              {showNetDelta ? (
                <div className="text-[10.5px] text-text-3">
                  {neta >= 0 ? "+" : "−"}
                  {Math.abs(neta)}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
