import Link from "next/link";
import { ChevronRight, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { Client, Invoice } from "@/lib/excavla/types";
import { initials } from "@/lib/excavla/format";
import { Money } from "./money";
import { SectionLabel } from "./section-label";
import {
  StatusBadge,
  invoiceBorderColor,
  invoiceStatusLabel,
} from "./status-badge";

interface ClientDetailContentProps {
  client: Client;
  invoices: Invoice[];
  /** "sm": ficha en Sheet móvil · "lg": panel fijo del maestro/detalle de escritorio. */
  size?: "sm" | "lg";
  className?: string;
}

/** Ficha de cliente: facturado/por cobrar, historial de servicios, llamar. */
export function ClientDetailContent({
  client,
  invoices,
  size = "sm",
  className,
}: ClientDetailContentProps) {
  const facturado = invoices.reduce((acc, i) => acc + i.amount, 0);
  const pendiente = invoices
    .filter((i) => i.status === "PENDING")
    .reduce((acc, i) => acc + i.amount, 0);
  const debe = pendiente > 0;
  const firstName = client.contact.split(" ")[0];

  const avatarSize = size === "lg" ? "h-14 w-14 text-xl" : "h-[52px] w-[52px] text-lg";
  const nameSize = size === "lg" ? "text-[26px]" : "text-[21px]";
  const kpiValueSize = size === "lg" ? "text-[26px]" : "text-2xl";

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex shrink-0 items-center justify-center bg-ink font-heading font-semibold text-accent-500",
            avatarSize
          )}
        >
          {initials(client.name)}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className={cn("truncate font-heading font-semibold text-ink", nameSize)}>
            {client.name}
          </h2>
          <p className="truncate text-[12.5px] text-text-3">
            {client.contact} · {client.phone}
            {size === "lg" ? ` · ${client.services} servicios contratados` : ""}
          </p>
        </div>
        {size === "lg" ? (
          <StatusBadge tone={debe ? "available" : "working"} className="shrink-0">
            {debe ? "Debe" : "Al día"}
          </StatusBadge>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="border border-divider p-3">
          <span className="font-heading text-[10px] font-semibold tracking-[.14em] text-text-3 uppercase">
            {size === "lg" ? "Facturado histórico" : "Facturado"}
          </span>
          <div className={cn("tabular font-heading mt-1.5 font-semibold text-ink", kpiValueSize)}>
            <Money value={facturado} />
          </div>
        </div>
        <div
          className={cn(
            "border border-ink p-3",
            debe ? "bg-accent-100" : "bg-surface"
          )}
        >
          <span
            className={cn(
              "font-heading text-[10px] font-semibold tracking-[.14em] uppercase",
              debe ? "text-accent-ink" : "text-text-3"
            )}
          >
            Por cobrar
          </span>
          <div className={cn("tabular font-heading mt-1.5 font-semibold text-ink", kpiValueSize)}>
            <Money value={pendiente} />
          </div>
        </div>
      </div>

      {size === "sm" ? (
        <StatusBadge tone={debe ? "available" : "working"} className="w-fit">
          {debe ? "Debe" : "Al día"}
        </StatusBadge>
      ) : null}

      <div>
        <SectionLabel>Historial de servicios</SectionLabel>
        <div className="mt-2 flex flex-col gap-2">
          {invoices.map((inv) => (
            <Link
              key={inv.id}
              href={`/cuentas?factura=${inv.id}`}
              className="flex items-center gap-3 border border-divider p-2.5"
              style={{ borderLeft: `4px solid ${invoiceBorderColor(inv)}` }}
            >
              <span className="min-w-0 flex-1">
                <span className="block truncate font-heading text-[13.5px] font-semibold text-ink">
                  {inv.concept}
                </span>
                <span className="block text-[11px] text-text-3">
                  {inv.date} · {invoiceStatusLabel(inv)}
                </span>
              </span>
              <span className="tabular font-heading shrink-0 text-[15px] font-semibold text-ink">
                <Money value={inv.amount} />
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-text-3" strokeWidth={1.6} />
            </Link>
          ))}
        </div>
      </div>

      <Button
        render={<a href={`tel:${client.phone.replace(/\s+/g, "")}`} />}
        nativeButton={false}
        className="min-h-12 gap-2"
      >
        <Phone className="h-4 w-4" strokeWidth={1.6} />
        Llamar a {firstName}
      </Button>
    </div>
  );
}
