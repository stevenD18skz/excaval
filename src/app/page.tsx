"use client";

import Link from "next/link";
import {
  AlertTriangle,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blueprint } from "@/components/excavla/blueprint";
import { Plate } from "@/components/excavla/plate";
import { Money } from "@/components/excavla/money";
import { SectionLabel } from "@/components/excavla/section-label";
import { StatCard } from "@/components/excavla/stat-card";
import { TrafficLight } from "@/components/excavla/traffic-light";
import { BalanceChart } from "@/components/excavla/balance-chart";
import { ExpenseBreakdown } from "@/components/excavla/expense-breakdown";
import { MobileHeader } from "@/components/excavla/mobile-header";
import { DesktopTopbar } from "@/components/excavla/desktop-topbar";
import { showActionToast } from "@/components/excavla/action-toast";
import {
  StatusBadge,
  machineStatusLabel,
  machineStatusTone,
} from "@/components/excavla/status-badge";
import { useExcavlaStore } from "@/lib/excavla/store";
import {
  computeAggregates,
  expenseBreakdown,
  fleetCounts,
} from "@/lib/excavla/aggregates";
import { EXPENSE_CAT_META } from "@/lib/excavla/types";
import type { MachineStatus } from "@/lib/excavla/types";
import { formatMoney } from "@/lib/excavla/money";
import { cn } from "@/lib/utils";

const STATUS_BORDER_VAR: Record<MachineStatus, string> = {
  WORKING: "var(--status-working)",
  AVAILABLE: "var(--status-available)",
  MAINTENANCE: "var(--status-maintenance)",
};

const STATUS_TINT_VAR: Record<MachineStatus, string> = {
  WORKING: "var(--status-working-bg)",
  AVAILABLE: "var(--status-available-bg)",
  MAINTENANCE: "var(--status-maintenance-bg)",
};

const FLEET_STATUS_ORDER: MachineStatus[] = ["WORKING", "AVAILABLE", "MAINTENANCE"];

function dayOf(dateStr: string): number {
  return parseInt(dateStr, 10) || 0;
}

export default function DashboardPage() {
  const invoices = useExcavlaStore((s) => s.invoices);
  const expenses = useExcavlaStore((s) => s.expenses);
  const machines = useExcavlaStore((s) => s.machines);
  const clients = useExcavlaStore((s) => s.clients);
  const markInvoicePaid = useExcavlaStore((s) => s.markInvoicePaid);
  const undoInvoicePaid = useExcavlaStore((s) => s.undoInvoicePaid);

  function clientName(clientId: string): string {
    return clients.find((c) => c.id === clientId)?.name ?? clientId;
  }

  function handleMarkPaid(id: string) {
    markInvoicePaid(id);
    showActionToast(
      `Factura ${id} marcada como cobrada. Ingreso confirmado en el libro.`,
      () => undoInvoicePaid(id)
    );
  }

  const agg = computeAggregates(invoices, expenses);
  const breakdown = expenseBreakdown(expenses);
  const fleet = fleetCounts(machines);

  const pendingInvoices = invoices.filter((i) => i.status === "PENDING");
  const pendingCount = pendingInvoices.length;

  const currentMonth = agg.chart[agg.chart.length - 1];
  const prevMonth = agg.chart[agg.chart.length - 2];
  const currentNetaM = currentMonth.ingresos - currentMonth.egresos;
  const prevNetaM = prevMonth.ingresos - prevMonth.egresos;
  const deltaPct = prevNetaM !== 0 ? ((currentNetaM - prevNetaM) / Math.abs(prevNetaM)) * 100 : 0;
  const deltaLabel = `${deltaPct >= 0 ? "+" : "−"}${Math.abs(deltaPct)
    .toFixed(1)
    .replace(".", ",")}% vs junio`;

  const movements = [
    ...invoices.map((inv) => ({
      kind: "income" as const,
      id: inv.id,
      title: clientName(inv.clientId),
      sub: `Ingreso · ${inv.date.replace(" 2026", "")}`,
      amount: inv.amount,
      day: dayOf(inv.date),
      href: `/cuentas?factura=${inv.id}`,
    })),
    ...expenses.map((exp) => ({
      kind: "expense" as const,
      id: exp.id,
      title: exp.desc,
      sub: `${EXPENSE_CAT_META[exp.cat].label} · ${exp.date}`,
      amount: exp.amount,
      day: dayOf(exp.date),
      cat: exp.cat,
      href: `/salidas?cat=${exp.cat}`,
    })),
  ]
    .sort((a, b) => b.day - a.day)
    .slice(0, 4);

  return (
    <>
      {/* ---------- MÓVIL ---------- */}
      <div className="lg:hidden">
        <MobileHeader title="Resumen" meta="JULIO 2026" />

        <main className="flex flex-col gap-4 px-3.5 pt-4 pb-[110px]">
          {/* Hero: Ganancia neta */}
          <Blueprint tone="dark" className="bg-ink p-4 pb-3.5 text-paper">
            <div className="flex items-center gap-2">
              <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-500 uppercase">
                Ganancia neta · Libre
              </span>
              <span className="h-px flex-1 bg-ink-line" />
            </div>
            <div className="tabular font-heading mt-1 text-[46px] leading-[1.02] font-semibold">
              <Money value={agg.neta} className="text-paper" />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="bg-accent-500 px-[7px] py-[2px] font-heading text-xs font-semibold text-ink">
                {deltaLabel}
              </span>
              <span className="text-xs text-text-on-dark">
                margen {agg.margen}% · vs junio
              </span>
            </div>
          </Blueprint>

          {/* KPIs ingresos / egresos */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="border border-divider p-[11px_12px]">
              <div className="flex items-center gap-1.5 font-heading text-[10px] font-semibold tracking-[.14em] text-status-working uppercase">
                <TrendingUp className="h-[13px] w-[13px]" strokeWidth={1.6} />
                Ingresos
              </div>
              <div className="tabular font-heading mt-1.5 text-2xl font-semibold text-ink">
                <Money value={agg.ingresos} />
              </div>
              <div className="mt-1 text-[11px] text-text-3">
                {invoices.length} facturas emitidas
              </div>
            </div>
            <div className="border border-divider p-[11px_12px]">
              <div className="flex items-center gap-1.5 font-heading text-[10px] font-semibold tracking-[.14em] text-status-maintenance uppercase">
                <TrendingDown className="h-[13px] w-[13px]" strokeWidth={1.6} />
                Egresos
              </div>
              <div className="tabular font-heading mt-1.5 text-2xl font-semibold text-ink">
                <Money value={agg.egresos} />
              </div>
              <div className="mt-1 text-[11px] text-text-3">
                {expenses.length} salidas registradas
              </div>
            </div>
          </div>

          {/* Alerta de cobro */}
          {pendingCount > 0 ? (
            <Link
              href="/cuentas?filter=pendientes"
              className="flex items-center gap-3 border border-ink border-l-[6px] border-l-accent-500 bg-accent-100 p-3"
            >
              <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center bg-ink">
                <AlertTriangle className="h-[19px] w-[19px] text-accent-500" strokeWidth={1.6} />
              </span>
              <span className="flex-1">
                <span className="block font-heading text-[17px] font-semibold text-ink">
                  {pendingCount} facturas por cobrar
                </span>
                <span className="tabular mt-0.5 block text-xs text-accent-ink">
                  {formatMoney(agg.porCobrar)} · {agg.vencidas} vencida
                  {agg.vencidas === 1 ? "" : "s"}
                </span>
              </span>
              <ChevronRight className="h-[18px] w-[18px] shrink-0 text-ink" strokeWidth={1.6} />
            </Link>
          ) : null}

          {/* Gráfico de balance */}
          <Blueprint className="border border-divider p-[14px_12px_12px]">
            <BalanceChart months={agg.chart} height={126} gap={9} />
          </Blueprint>

          {/* Desglose de egresos */}
          <div className="border border-divider p-[13px_12px]">
            <SectionLabel>A dónde se fue el dinero</SectionLabel>
            <ExpenseBreakdown items={breakdown} barHeight={9} className="mt-3" />
          </div>

          {/* Semáforo de la flota */}
          <section>
            <SectionLabel
              trailing={
                <Link
                  href="/maquinas"
                  className="font-heading text-xs font-semibold tracking-[.08em] text-accent-700 uppercase"
                >
                  Ver flota
                </Link>
              }
            >
              Semáforo de la flota
            </SectionLabel>
            <div className="mt-3 grid grid-cols-3 gap-2.5">
              {FLEET_STATUS_ORDER.map((status) => (
                <Link
                  key={status}
                  href={`/maquinas?mfilter=${status}`}
                  className="border-t-4 p-[10px_9px_9px]"
                  style={{ borderTopColor: STATUS_BORDER_VAR[status] }}
                >
                  <span
                    className="inline-block h-[9px] w-[9px] rounded-full"
                    style={{
                      backgroundColor: STATUS_BORDER_VAR[status],
                      boxShadow: `0 0 0 2px ${STATUS_TINT_VAR[status]}`,
                    }}
                  />
                  <div className="tabular font-heading mt-1.5 text-[22px] font-semibold text-ink">
                    {fleet[status]}
                  </div>
                  <div className="font-heading text-[10.5px] font-semibold text-text-3 uppercase">
                    {machineStatusLabel(status)}
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* Últimos movimientos */}
          <section>
            <SectionLabel>Últimos movimientos</SectionLabel>
            <div className="mt-3 flex flex-col gap-2">
              {movements.map((m) => (
                <Link
                  key={m.id}
                  href={m.href}
                  className="flex items-center gap-3 border border-divider p-2.5"
                >
                  <Plate variant={m.kind === "income" ? "accent" : "dark"} className="h-8 w-[38px]">
                    {m.kind === "income" ? "FAC" : EXPENSE_CAT_META[m.cat].code}
                  </Plate>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-heading text-[15.5px] font-semibold text-ink">
                      {m.title}
                    </span>
                    <span className="block truncate text-[11px] text-text-3">{m.sub}</span>
                  </span>
                  <span
                    className={cn(
                      "tabular font-heading shrink-0 text-[15px] font-semibold",
                      m.kind === "income" ? "text-status-working-text" : "text-ink"
                    )}
                  >
                    <Money value={m.amount} sign={m.kind === "expense" ? "negative" : "none"} />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* ---------- ESCRITORIO ---------- */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <DesktopTopbar title="Dashboard · julio 2026" />

        <main className="flex-1 overflow-y-auto px-[22px] py-[18px] pb-[26px]">
          <div className="flex flex-col gap-4">
            {/* Fila de KPIs */}
            <div className="grid grid-cols-[1.25fr_1fr_1fr] gap-3.5">
              <Blueprint tone="dark" className="bg-ink p-4 text-paper">
                <div className="flex items-center gap-2">
                  <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-500 uppercase">
                    Ganancia neta · Libre
                  </span>
                  <span className="h-px flex-1 bg-ink-line" />
                </div>
                <div className="tabular font-heading mt-1 text-[44px] leading-[1.05] font-semibold">
                  <Money value={agg.neta} className="text-paper" />
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="bg-accent-500 px-[7px] py-[2px] font-heading text-xs font-semibold text-ink">
                    {deltaLabel}
                  </span>
                  <span className="text-xs text-text-on-dark">
                    margen {agg.margen}% · vs junio
                  </span>
                </div>
              </Blueprint>

              <StatCard
                label="Ingresos del mes"
                labelClassName="text-status-working"
                value={<Money value={agg.ingresos} />}
                sub={`${invoices.length} facturas · ${pendingCount} por cobrar`}
              />
              <StatCard
                label="Egresos del mes"
                labelClassName="text-status-maintenance"
                value={<Money value={agg.egresos} />}
                sub={`Nómina ${formatMoney(agg.nomina)} · ${expenses.length} salidas`}
              />
            </div>

            {/* Fila de gráficos */}
            <div className="grid grid-cols-[1.6fr_1fr] gap-3.5">
              <Blueprint className="border border-divider p-4">
                <BalanceChart months={agg.chart} height={186} gap={16} showNetDelta />
              </Blueprint>
              <div className="border border-divider p-4">
                <SectionLabel>A dónde se fue el dinero</SectionLabel>
                <ExpenseBreakdown items={breakdown} barHeight={10} className="mt-3" />
              </div>
            </div>

            {/* Semáforo de la flota */}
            <section>
              <SectionLabel
                trailing={
                  <span className="text-[11px] text-text-3">
                    {fleet.WORKING} trabajando · {fleet.AVAILABLE} disponibles · {fleet.MAINTENANCE} en mantenimiento
                  </span>
                }
              >
                Semáforo de la flota
              </SectionLabel>
              <div className="mt-3 grid grid-cols-4 gap-3">
                {machines.map((m) => (
                  <Link
                    key={m.code}
                    href={`/maquinas?mfilter=${m.status}`}
                    className="flex gap-2.5 border-t-4 p-3"
                    style={{ borderTopColor: STATUS_BORDER_VAR[m.status] }}
                  >
                    <TrafficLight status={m.status} dotSize={10} variant="light" />
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <Plate variant="dark" className="h-[18px] px-1 text-[10px]">
                          {m.code}
                        </Plate>
                        <StatusBadge tone={machineStatusTone(m.status)} className="text-[10px]">
                          {machineStatusLabel(m.status)}
                        </StatusBadge>
                      </span>
                      <span className="mt-1 block truncate font-heading text-[13.5px] font-semibold text-ink">
                        {m.name}
                      </span>
                      <span className="block truncate text-[11px] text-text-3">
                        {m.location}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            {/* Facturas por cobrar */}
            <section className="border border-divider">
              <div className="flex items-center justify-between border-b border-divider p-3.5">
                <SectionLabel className="flex-1">Facturas por cobrar</SectionLabel>
                <span className="tabular ml-3 shrink-0 font-heading text-sm font-semibold text-ink">
                  {formatMoney(agg.porCobrar)} en la calle
                </span>
              </div>
              {pendingInvoices.length > 0 ? (
                <div className="flex flex-col">
                  {pendingInvoices.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center gap-4 border-b border-divider p-[13px_15px] last:border-b-0"
                      style={{
                        borderLeft: `5px solid ${
                          inv.overdue
                            ? "var(--status-maintenance)"
                            : "var(--status-available)"
                        }`,
                      }}
                    >
                      <Plate variant="dark" className="h-8 shrink-0 px-1.5">
                        {inv.id}
                      </Plate>
                      <span className="min-w-0 flex-1">
                        <span className="block font-heading text-[17px] font-semibold text-ink">
                          {clientName(inv.clientId)}
                        </span>
                        <span className="block truncate text-[12.5px] text-text-2">
                          {inv.concept}
                        </span>
                      </span>
                      <span
                        className={cn(
                          "w-[120px] shrink-0 text-right text-[12.5px]",
                          inv.overdue ? "text-status-maintenance" : "text-text-3"
                        )}
                      >
                        {inv.due}
                      </span>
                      <span className="tabular font-heading w-[140px] shrink-0 text-right text-xl font-semibold text-ink">
                        <Money value={inv.amount} />
                      </span>
                      <Button
                        type="button"
                        className="min-h-10 shrink-0"
                        onClick={() => handleMarkPaid(inv.id)}
                      >
                        Marcar cobrada
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="m-3.5 border border-dashed border-[rgba(20,20,20,.3)] p-6 text-center">
                  <p className="font-heading text-sm font-semibold text-ink">Todo cobrado</p>
                  <p className="mt-1 text-[12.5px] text-text-3">
                    No hay facturas pendientes este mes.
                  </p>
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </>
  );
}
