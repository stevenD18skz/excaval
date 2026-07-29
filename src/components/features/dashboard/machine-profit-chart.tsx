import Link from "next/link";
import { cn } from "@/lib/utils";
import type { MachineFinancials } from "@/lib/excaval/aggregates";
import { formatMoneyShort } from "@/lib/excaval/money";
import { SectionLabel } from "@/components/shared/section-label";
import { Plate } from "@/components/shared/plate";

interface MachineProfitChartProps {
  data: MachineFinancials[];
  barHeight?: number;
  className?: string;
}

/** Rendimiento por máquina: ranking de ganancia neta, ordenado de mejor a peor. */
export function MachineProfitChart({ data, barHeight = 9, className }: MachineProfitChartProps) {
  const ranked = [...data]
    .filter((m) => m.ingresos > 0 || m.egresos > 0)
    .sort((a, b) => b.neta - a.neta);
  const maxAbs = Math.max(...ranked.map((m) => Math.abs(m.neta)), 1);

  return (
    <div className={cn("flex flex-col", className)}>
      <SectionLabel>Rendimiento por máquina</SectionLabel>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-text-3">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-status-working" aria-hidden />
          Rinde en positivo
        </span>
        <span className="flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-full bg-status-maintenance"
            aria-hidden
          />
          Aún no cubre gastos
        </span>
      </div>

      {ranked.length === 0 ? (
        <p className="mt-3 text-[12.5px] text-text-3">
          Todavía no hay facturas ni salidas asignadas a una máquina.
        </p>
      ) : (
        <div className="mt-3 flex flex-col gap-3">
          {ranked.map((m) => {
            const positive = m.neta >= 0;
            const barPct = Math.round((Math.abs(m.neta) / maxAbs) * 100);
            return (
              <Link
                key={m.code}
                href={`/maquinas?maquina=${m.code}`}
                className="flex flex-col gap-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-1.5">
                    <Plate variant="dark" className="h-5 shrink-0 px-1 text-[10px]">
                      {m.code}
                    </Plate>
                    <span className="truncate text-[12px] text-text-2">{m.name}</span>
                  </span>
                  <span
                    className={cn(
                      "tabular shrink-0 text-[12.5px] font-semibold",
                      positive ? "text-status-working-text" : "text-status-maintenance"
                    )}
                  >
                    {positive ? "+" : "−"}
                    {formatMoneyShort(Math.abs(m.neta))}
                  </span>
                </div>
                <div
                  className="border border-[rgba(20,20,20,.3)]"
                  style={{ height: barHeight }}
                >
                  <div
                    className={cn("h-full", positive ? "bg-status-working" : "bg-status-maintenance")}
                    style={{ width: `${barPct}%` }}
                  />
                </div>
                <div className="text-[10.5px] text-text-4">
                  Generado {formatMoneyShort(m.ingresos)} · Gastado {formatMoneyShort(m.egresos)}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
