"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MobileHeader } from "@/components/excavla/mobile-header";
import { DesktopTopbar } from "@/components/excavla/desktop-topbar";
import { MachineCard } from "@/components/excavla/machine-card";
import { MachineCardDesktop } from "@/components/excavla/machine-card-desktop";
import { MachineDetailOverlay } from "@/components/excavla/machine-detail-overlay";
import { showActionToast } from "@/components/excavla/action-toast";
import { useExcavlaStore } from "@/lib/excavla/store";
import { fleetCounts } from "@/lib/excavla/aggregates";
import { machineStatusLabel } from "@/components/excavla/status-badge";
import type { MachineStatus } from "@/lib/excavla/types";
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

  const machines = useExcavlaStore((s) => s.machines);
  const setMachineStatus = useExcavlaStore((s) => s.setMachineStatus);
  const setMachinePhoto = useExcavlaStore((s) => s.setMachinePhoto);

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

  function handleChangeStatus(code: string, status: MachineStatus) {
    setMachineStatus(code, status);
    showActionToast(`${code} → ${machineStatusLabel(status)}. Semáforo actualizado.`);
  }

  function handleUploadPhoto(code: string, photo: string) {
    setMachinePhoto(code, photo);
    showActionToast(`${code} → foto actualizada.`);
  }

  const filtered =
    mfilter === "todas" ? machines : machines.filter((m) => m.status === mfilter);

  const fleet = fleetCounts(machines);
  const selectedMachine = selectedCode
    ? machines.find((m) => m.code === selectedCode) ?? null
    : null;

  return (
    <>
      {/* ---------- MÓVIL ---------- */}
      <div className="lg:hidden">
        <MobileHeader title="Semáforo de flota" meta={`${machines.length} ACTIVOS`} />

        <main className="flex flex-col gap-4 px-3.5 pt-4 pb-[110px]">
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

        <MachineDetailOverlay
          machine={selectedMachine}
          open={!!selectedMachine}
          onOpenChange={(open) => {
            if (!open) closeDetail();
          }}
          onChangeStatus={handleChangeStatus}
          onUploadPhoto={handleUploadPhoto}
        />
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
            </div>

            <div className="grid grid-cols-2 gap-3">
              {filtered.map((m, i) => (
                <MachineCardDesktop
                  key={m.code}
                  machine={m}
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
    </>
  );
}
