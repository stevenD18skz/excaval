import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { Invoice, MachineStatus } from "@/lib/excaval/types";

export type StatusTone = "working" | "available" | "maintenance" | "off";

const TONE_CLASSES: Record<StatusTone, string> = {
  working: "bg-status-working-bg text-status-working-text border-status-working",
  available:
    "bg-status-available-bg text-status-available-text border-status-available-border",
  maintenance:
    "bg-status-maintenance-bg text-status-maintenance-text border-status-maintenance",
  off: "bg-surface text-text-3 border-divider",
};

interface StatusBadgeProps {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
}

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center border px-[9px] py-[2px] font-heading text-[11px] font-semibold tracking-[.06em] uppercase",
        TONE_CLASSES[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

const MACHINE_STATUS_LABEL: Record<MachineStatus, string> = {
  WORKING: "Trabajando",
  AVAILABLE: "Disponible",
  MAINTENANCE: "Mantenimiento",
};

const MACHINE_STATUS_TONE: Record<MachineStatus, StatusTone> = {
  WORKING: "working",
  AVAILABLE: "available",
  MAINTENANCE: "maintenance",
};

export function machineStatusLabel(status: MachineStatus): string {
  return MACHINE_STATUS_LABEL[status];
}

export function machineStatusTone(status: MachineStatus): StatusTone {
  return MACHINE_STATUS_TONE[status];
}

export function invoiceStatusLabel(invoice: Invoice): string {
  if (invoice.status === "PAID") return "Pagada";
  return invoice.overdue ? "Vencida" : "Por cobrar";
}

export function invoiceStatusTone(invoice: Invoice): StatusTone {
  if (invoice.status === "PAID") return "working";
  return invoice.overdue ? "maintenance" : "available";
}

const TONE_BORDER_VAR: Record<StatusTone, string> = {
  working: "var(--status-working)",
  available: "var(--status-available)",
  maintenance: "var(--status-maintenance)",
  off: "var(--status-off)",
};

/** Color de borde de énfasis (border-left) según el estado de la factura. */
export function invoiceBorderColor(invoice: Invoice): string {
  return TONE_BORDER_VAR[invoiceStatusTone(invoice)];
}
