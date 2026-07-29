"use client";

import { useState, type ReactNode } from "react";
import { Clock, Home, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Expense, Invoice, Machine, MachineStatus, MaintenanceRecord } from "@/lib/excaval/types";
import { machineFinancialsFor, machineMovements } from "@/lib/excaval/aggregates";
import { formatMoney } from "@/lib/excaval/money";
import { Blueprint } from "@/components/shared/blueprint";
import { Plate } from "@/components/shared/plate";
import { Money } from "@/components/shared/money";
import { Segmented } from "@/components/shared/segmented";
import { StatCard } from "@/components/shared/stat-card";
import { SectionLabel } from "@/components/shared/section-label";
import { TrafficLight } from "@/components/shared/traffic-light";
import { StatusBadge } from "@/components/shared/status-badge";
import { MachineStatusControl } from "./machine-status-control";
import { MachinePhotoUpload } from "./machine-photo-upload";

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 border border-divider p-3">
      <span className="mt-0.5 shrink-0 text-accent-700">{icon}</span>
      <div className="min-w-0">
        <div className="font-heading text-[10.5px] font-semibold tracking-[.08em] text-text-3 uppercase">
          {label}
        </div>
        <div className="mt-0.5 truncate text-[14.5px] text-ink">{value}</div>
      </div>
    </div>
  );
}

function SemaforoTab({
  machine,
  onChangeStatus,
  onUploadPhoto,
}: {
  machine: Machine;
  onChangeStatus: (code: string, status: MachineStatus) => void;
  onUploadPhoto: (code: string, photo: string) => void;
}) {
  const metricLabel = machine.hours.includes("km") ? "kilometraje" : "horómetro";

  return (
    <div className="flex flex-col gap-4">
      <MachinePhotoUpload
        src={machine.photo}
        alt={machine.name}
        onUpload={(dataUrl) => onUploadPhoto(machine.code, dataUrl)}
        priority
        className="h-44 w-full"
      />

      <div>
        <h2 className="font-heading text-[23px] font-semibold text-ink">{machine.name}</h2>
        <p className="mt-1 text-[13px] text-text-2">
          {machine.type} · {metricLabel} {machine.hours}
        </p>
      </div>

      <div className="flex items-start gap-4">
        <Blueprint tone="dark" className="shrink-0">
          <TrafficLight status={machine.status} dotSize={26} variant="dark" />
        </Blueprint>
        <MachineStatusControl
          status={machine.status}
          onChange={(status) => onChangeStatus(machine.code, status)}
          variant="sheet"
          className="flex-1"
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <InfoCard
          icon={<MapPin className="h-4 w-4" strokeWidth={1.6} />}
          label="Ubicación actual"
          value={machine.location}
        />
        <InfoCard
          icon={<Home className="h-4 w-4" strokeWidth={1.6} />}
          label="Cliente / proyecto"
          value={machine.client}
        />
        <InfoCard
          icon={<Clock className="h-4 w-4" strokeWidth={1.6} />}
          label="Último cambio"
          value={machine.updated}
        />
      </div>
    </div>
  );
}

function RendimientoTab({
  machine,
  invoices,
  expenses,
  maintenanceRecords,
}: {
  machine: Machine;
  invoices: Invoice[];
  expenses: Expense[];
  maintenanceRecords: MaintenanceRecord[];
}) {
  const fin = machineFinancialsFor(machine.code, invoices, expenses);
  const movements = machineMovements(machine.code, invoices, expenses);
  const records = maintenanceRecords.filter((r) => r.machineCode === machine.code);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard
          label="Generado"
          labelClassName="text-status-working"
          value={<Money value={fin.ingresos} variant="short" />}
        />
        <StatCard
          label="Gastado"
          labelClassName="text-status-maintenance"
          value={<Money value={fin.egresos} variant="short" />}
        />
      </div>

      <Blueprint tone="dark" className="bg-ink p-4 text-paper">
        <span className="font-heading text-[11px] font-semibold tracking-[.14em] text-accent-500 uppercase">
          Ganancia neta
        </span>
        <div className="tabular font-heading mt-1 text-[30px] font-semibold">
          <Money value={fin.neta} className="text-paper" />
        </div>
        <div className="mt-1 text-xs text-text-on-dark">Margen {fin.margen}%</div>
      </Blueprint>

      <div>
        <SectionLabel>Ficha técnica</SectionLabel>
        <dl className="mt-2 flex flex-col">
          {machine.specs.map((s) => (
            <div
              key={s.label}
              className="flex items-center justify-between border-b border-dashed border-divider-dash py-1.5 text-[12.5px] last:border-b-0"
            >
              <dt className="text-text-3">{s.label}</dt>
              <dd className="font-heading font-semibold text-ink">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>

      {records.length > 0 ? (
        <div>
          <SectionLabel>Historial de mantenimiento</SectionLabel>
          <div className="mt-2 flex flex-col gap-2">
            {records.map((r) => (
              <div key={r.id} className="border border-divider p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-heading text-[13px] font-semibold text-ink">
                    {r.reason}
                  </span>
                  <StatusBadge tone={r.status === "EN_CURSO" ? "maintenance" : "off"}>
                    {r.status === "EN_CURSO" ? "En curso" : "Finalizado"}
                  </StatusBadge>
                </div>
                <div className="mt-1 text-[11.5px] text-text-3">
                  Desde {r.startDate} · {r.estimatedDays} días est.
                  {r.cost > 0 ? ` · ${formatMoney(r.cost)}` : ""}
                  {r.hasInvoice ? " · con factura" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <SectionLabel>Movimientos de la máquina</SectionLabel>
        {movements.length === 0 ? (
          <p className="mt-2 text-[12.5px] text-text-3">
            Sin facturas ni salidas registradas todavía.
          </p>
        ) : (
          <div className="mt-2 flex flex-col gap-2">
            {movements.map((m) => (
              <div key={m.id} className="flex items-center gap-3 border border-divider p-2.5">
                <Plate variant={m.kind === "income" ? "accent" : "dark"} className="h-8 w-[38px]">
                  {m.code}
                </Plate>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-heading text-[14px] font-semibold text-ink">
                    {m.title}
                  </span>
                  <span className="block truncate text-[11px] text-text-3">{m.sub}</span>
                </span>
                <span
                  className={cn(
                    "tabular font-heading shrink-0 text-[14px] font-semibold",
                    m.kind === "income" ? "text-status-working-text" : "text-ink"
                  )}
                >
                  <Money value={m.amount} sign={m.kind === "expense" ? "negative" : "none"} />
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DetailBody({
  machine,
  invoices,
  expenses,
  maintenanceRecords,
  onChangeStatus,
  onUploadPhoto,
}: {
  machine: Machine;
  invoices: Invoice[];
  expenses: Expense[];
  maintenanceRecords: MaintenanceRecord[];
  onChangeStatus: (code: string, status: MachineStatus) => void;
  onUploadPhoto: (code: string, photo: string) => void;
}) {
  const [tab, setTab] = useState<"semaforo" | "rendimiento">("semaforo");

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      <Segmented
        value={tab}
        onChange={(v) => setTab(v as "semaforo" | "rendimiento")}
        options={[
          { value: "semaforo", label: "Semáforo" },
          { value: "rendimiento", label: "Rendimiento" },
        ]}
      />

      {tab === "semaforo" ? (
        <SemaforoTab
          machine={machine}
          onChangeStatus={onChangeStatus}
          onUploadPhoto={onUploadPhoto}
        />
      ) : (
        <RendimientoTab
          machine={machine}
          invoices={invoices}
          expenses={expenses}
          maintenanceRecords={maintenanceRecords}
        />
      )}
    </div>
  );
}

interface MachineDetailOverlayProps {
  machine: Machine | null;
  invoices: Invoice[];
  expenses: Expense[];
  maintenanceRecords: MaintenanceRecord[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (code: string, status: MachineStatus) => void;
  onUploadPhoto: (code: string, photo: string) => void;
}

/** Detalle de máquina: Sheet (bottom) en móvil, Dialog centrado en escritorio — Semáforo / Rendimiento. */
export function MachineDetailOverlay({
  machine,
  invoices,
  expenses,
  maintenanceRecords,
  open,
  onOpenChange,
  onChangeStatus,
  onUploadPhoto,
}: MachineDetailOverlayProps) {
  if (!machine) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[92%] gap-0 rounded-none border-t-[3px] border-accent-500 bg-paper p-0 shadow-none lg:hidden"
        >
          <div className="flex items-center gap-2.5 border-b border-divider p-3.5">
            <Plate variant="dark" className="h-7 px-1.5">
              {machine.code}
            </Plate>
            <span className="font-heading text-xs font-semibold tracking-[.1em] text-text-3 uppercase">
              Detalle de máquina
            </span>
          </div>
          <DetailBody
            key={machine.code}
            machine={machine}
            invoices={invoices}
            expenses={expenses}
            maintenanceRecords={maintenanceRecords}
            onChangeStatus={onChangeStatus}
            onUploadPhoto={onUploadPhoto}
          />
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hidden max-h-[88%] max-w-[480px] gap-0 overflow-y-auto rounded-none border border-ink border-t-[3px] border-t-accent-500 bg-paper p-0 shadow-[0_24px_60px_rgba(20,20,20,.35)] ring-0 sm:max-w-[480px] lg:grid">
          <div className="flex items-center gap-2.5 border-b border-divider p-3.5">
            <Plate variant="dark" className="h-7 px-1.5">
              {machine.code}
            </Plate>
            <span className="font-heading text-xs font-semibold tracking-[.1em] text-text-3 uppercase">
              Detalle de máquina
            </span>
          </div>
          <DetailBody
            key={machine.code}
            machine={machine}
            invoices={invoices}
            expenses={expenses}
            maintenanceRecords={maintenanceRecords}
            onChangeStatus={onChangeStatus}
            onUploadPhoto={onUploadPhoto}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
