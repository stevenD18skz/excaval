"use client";

import Link from "next/link";
import { Calculator } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileHeader } from "@/components/layout/mobile-header";
import { DesktopTopbar } from "@/components/layout/desktop-topbar";
import { Button } from "@/components/ui/button";
import { MachineCard } from "@/components/features/machines/machine-card";
import { MachineCardDesktop } from "@/components/features/machines/machine-card-desktop";
import { MachineDetailOverlay } from "@/components/features/machines/machine-detail-overlay";
import { MaintenanceFormOverlay } from "@/components/features/machines/maintenance-form";
import { showActionToast } from "@/components/layout/action-toast";
import { useExcavalStore, type NewMaintenanceInput } from "@/lib/excaval/store";
import { fleetCounts } from "@/lib/excaval/aggregates";
import { machineStatusLabel } from "@/components/shared/status-badge";
import type { MachineStatus } from "@/lib/excaval/types";
import { formatMoney } from "@/lib/excaval/money";
import { cn } from "@/lib/utils";

type MachineFilter = "todas" | MachineStatus;

const FILTER_DOT_VAR: Record<MachineFilter, string> = {
  todas: "var(--text-4)",
  WORKING: "var(--status-working)",
  AVAILABLE: "var(--status-available)",
  MAINTENANCE: "var(--status-maintenance)",
};

const FILTER_LABEL: Record<MachineFilter, string> = {
  todas: "Toda la flota",
  WORKING: "Trabajando",
  AVAILABLE: "Disponible",
  MAINTENANCE: "Mantenimiento",
};

const FILTER_ORDER: MachineFilter[] = ["todas", "WORKING", "AVAILABLE", "MAINTENANCE"];

function buildHref(base: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function MaquinasView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const mfilter = ((searchParams.get("mfilter") as MachineFilter) || "todas") as MachineFilter;
  const selectedCode = searchParams.get("maquina");
  const maintenanceCode = searchParams.get("mantenimiento");

  const machines = useExcavalStore((s) => s.machines);
  const invoices = useExcavalStore((s) => s.invoices);
  const expenses = useExcavalStore((s) => s.expenses);
  const maintenanceRecords = useExcavalStore((s) => s.maintenanceRecords);
  const setMachineStatus = useExcavalStore((s) => s.setMachineStatus);
  const setMachinePhoto = useExcavalStore((s) => s.setMachinePhoto);
  const addMaintenanceRecord = useExcavalStore((s) => s.addMaintenanceRecord);

  function setParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildHref("/maquinas", params));
  }

  function setFilter(next: string) {
    setParams((params) => {
      if (next === "todas") params.delete("mfilter");
      else params.set("mfilter", next);
    });
  }

  function machineHref(code: string): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maquina", code);
    return buildHref("/maquinas", params);
  }

  function closeDetail() {
    setParams((params) => params.delete("maquina"));
  }

  function closeMaintenanceForm() {
    setParams((params) => params.delete("mantenimiento"));
  }

  function handleChangeStatus(code: string, status: MachineStatus) {
    const current = machines.find((m) => m.code === code);
    if (status === "MAINTENANCE" && current?.status !== "MAINTENANCE") {
      // Enviar a mantenimiento pide motivo/días/costo antes de cambiar el semáforo.
      setParams((params) => {
        params.delete("maquina");
        params.set("mantenimiento", code);
      });
      return;
    }
    setMachineStatus(code, status);
    showActionToast(`${code} → ${machineStatusLabel(status)}. Semáforo actualizado.`);
  }

  function handleUploadPhoto(code: string, photo: string) {
    setMachinePhoto(code, photo);
    showActionToast(`${code} → foto actualizada.`);
  }

  function handleStartMaintenance(input: NewMaintenanceInput) {
    addMaintenanceRecord(input);
    closeMaintenanceForm();
    showActionToast(
      `${input.machineCode} → Mantenimiento. ${input.estimatedDays} días est.` +
        (input.cost > 0 ? ` · ${formatMoney(input.cost)} registrado en Salidas.` : "")
    );
  }

  const filtered =
    mfilter === "todas" ? machines : machines.filter((m) => m.status === mfilter);

  const fleet = fleetCounts(machines);
  const selectedMachine = selectedCode
    ? machines.find((m) => m.code === selectedCode) ?? null
    : null;
  const maintenanceMachine = maintenanceCode
    ? machines.find((m) => m.code === maintenanceCode) ?? null
    : null;

  return (
    <>
      {/* ---------- MÓVIL ---------- */}
      <div className="lg:hidden">
        <MobileHeader title="Semáforo de flota" meta={`${machines.length} ACTIVOS`} />

        <main className="flex flex-col gap-4 px-3.5 pt-4 pb-[130px]">
          <div className="-mx-3.5 flex gap-1.5 overflow-x-auto px-3.5">
            {FILTER_ORDER.map((f) => {
              const active = f === mfilter;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={cn(
                    "flex min-h-9 shrink-0 items-center gap-1.5 border px-3 font-heading text-xs font-semibold uppercase",
                    active
                      ? "border-ink bg-ink text-paper"
                      : "border-divider-strong bg-paper text-text-2"
                  )}
                >
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: FILTER_DOT_VAR[f] }}
                  />
                  {FILTER_LABEL[f]}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-2.5">
            {filtered.map((m, i) => (
              <MachineCard
                key={m.code}
                machine={m}
                href={machineHref(m.code)}
                priority={i === 0}
              />
            ))}
          </div>

          <div className="flex flex-col gap-2 border-t border-divider pt-3 text-[11.5px] text-text-3">
            <div className="flex items-center gap-2">
              <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-status-working" />
              Trabajando · genera ingreso
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-accent-500" />
              Disponible · sin asignar
            </div>
            <div className="flex items-center gap-2">
              <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-status-maintenance" />
              Mantenimiento · parada
            </div>
          </div>
        </main>

        <div className="fixed inset-x-0 bottom-[78px] z-20 border-t border-divider bg-paper p-[10px_14px]">
          <Button
            render={<Link href="/presupuesto" />}
            nativeButton={false}
            variant="outline"
            className="min-h-12 w-full gap-2"
          >
            <Calculator className="h-4 w-4" strokeWidth={1.8} />
            Simular presupuesto
          </Button>
        </div>
      </div>

      {/* ---------- ESCRITORIO ---------- */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <DesktopTopbar title="Semáforo de la flota" />

        <main className="flex-1 overflow-y-auto px-[22px] py-[18px] pb-[26px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-1.5">
                {FILTER_ORDER.map((f) => {
                  const active = f === mfilter;
                  return (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      className={cn(
                        "flex min-h-[38px] items-center gap-1.5 border px-3.5 font-heading text-xs font-semibold uppercase",
                        active
                          ? "border-ink bg-ink text-paper"
                          : "border-divider-strong bg-paper text-text-2"
                      )}
                    >
                      <span
                        className="inline-block h-2 w-2 shrink-0 rounded-full"
                        style={{ backgroundColor: FILTER_DOT_VAR[f] }}
                      />
                      {FILTER_LABEL[f]}
                    </button>
                  );
                })}
              </div>
              <span className="h-px flex-1 bg-divider" />
              <span className="shrink-0 text-[12px] text-text-3">
                {fleet.WORKING} trabajando · {fleet.AVAILABLE} disponibles · {fleet.MAINTENANCE} en mantenimiento
              </span>
              <Button
                render={<Link href="/presupuesto" />}
                nativeButton={false}
                variant="outline"
                className="min-h-[38px] shrink-0 gap-2"
              >
                <Calculator className="h-4 w-4" strokeWidth={1.8} />
                Simular presupuesto
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filtered.map((m, i) => (
                <MachineCardDesktop
                  key={m.code}
                  machine={m}
                  href={machineHref(m.code)}
                  onChangeStatus={handleChangeStatus}
                  onUploadPhoto={handleUploadPhoto}
                  priority={i === 0}
                />
              ))}
            </div>

            <p className="border-t border-divider pt-3 text-[11.5px] text-text-3">
              El cambio queda registrado con la hora y se ve igual en el celular.
            </p>
          </div>
        </main>
      </div>

      <MachineDetailOverlay
        machine={selectedMachine}
        invoices={invoices}
        expenses={expenses}
        maintenanceRecords={maintenanceRecords}
        open={!!selectedMachine}
        onOpenChange={(open) => {
          if (!open) closeDetail();
        }}
        onChangeStatus={handleChangeStatus}
        onUploadPhoto={handleUploadPhoto}
      />

      <MaintenanceFormOverlay
        machine={maintenanceMachine}
        open={!!maintenanceMachine}
        onOpenChange={(open) => {
          if (!open) closeMaintenanceForm();
        }}
        onSubmit={handleStartMaintenance}
      />
    </>
  );
}
