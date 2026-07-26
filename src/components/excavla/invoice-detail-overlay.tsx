"use client";

import Link from "next/link";
import { Camera, Check, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Client, Invoice } from "@/lib/excavla/types";
import { Blueprint } from "./blueprint";
import { Plate } from "./plate";
import { Money } from "./money";
import {
  StatusBadge,
  invoiceStatusLabel,
  invoiceStatusTone,
} from "./status-badge";

function DetailHeader({ invoice }: { invoice: Invoice }) {
  return (
    <div className="flex items-center gap-2.5 border-b border-divider p-3.5">
      <Plate variant="dark" className="h-7 px-1.5">
        {invoice.id}
      </Plate>
      <span className="font-heading text-xs font-semibold tracking-[.1em] text-text-3 uppercase">
        Detalle de factura
      </span>
    </div>
  );
}

function DetailBody({
  invoice,
  client,
  onMarkPaid,
}: {
  invoice: Invoice;
  client: Client;
  onMarkPaid: (id: string) => void;
}) {
  const pending = invoice.status === "PENDING";

  return (
    <div className="flex flex-col gap-4 overflow-y-auto p-4">
      <div>
        <span className="font-heading text-[11px] font-semibold tracking-[.1em] text-text-3 uppercase">
          Cliente
        </span>
        <h2 className="font-heading text-[23px] font-semibold text-ink">{client.name}</h2>
        <p className="mt-1 text-[13px] text-text-2">{invoice.concept}</p>
      </div>

      <Blueprint
        className={cn(
          "border border-ink p-4",
          pending ? "bg-accent-100" : "bg-surface"
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-heading text-[11px] font-semibold tracking-[.14em] text-text-3 uppercase">
            Monto
          </span>
          <StatusBadge tone={invoiceStatusTone(invoice)}>
            {invoiceStatusLabel(invoice)}
          </StatusBadge>
        </div>
        <div className="tabular font-heading mt-1 text-[34px] font-semibold text-ink">
          <Money value={invoice.amount} />
        </div>
      </Blueprint>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="font-heading text-[10.5px] font-semibold tracking-[.1em] text-text-3 uppercase">
            Emitida
          </span>
          <p className="mt-0.5 text-[14.5px] text-ink">{invoice.date}</p>
        </div>
        <div>
          <span className="font-heading text-[10.5px] font-semibold tracking-[.1em] text-text-3 uppercase">
            Vencimiento
          </span>
          <p
            className={cn(
              "mt-0.5 text-[14.5px]",
              invoice.overdue ? "text-status-maintenance" : "text-ink"
            )}
          >
            {invoice.due}
          </p>
        </div>
      </div>

      <Blueprint className="flex items-center gap-3 border border-divider bg-surface p-3">
        <div className="doc-hatch flex h-16 w-14 shrink-0 items-center justify-center border border-ink">
          <Camera className="h-6 w-6 text-ink" strokeWidth={1.6} />
        </div>
        <div>
          <p className="font-heading text-sm font-semibold text-ink">Foto de la factura</p>
          <p className="mt-0.5 text-[12px] text-text-3">
            {invoice.photo
              ? `Adjunta · tomada el ${invoice.date}`
              : "Sin adjuntar — tócala para subirla"}
          </p>
        </div>
      </Blueprint>

      {pending ? (
        <Button
          type="button"
          className="min-h-[52px] gap-2 text-base"
          onClick={() => onMarkPaid(invoice.id)}
        >
          <Check className="h-4 w-4" strokeWidth={2.4} />
          Marcar como cobrada
        </Button>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="outline" render={<Link href={`/clientes?cliente=${client.id}`} />}>
          Ver cliente
        </Button>
        <Button
          variant="outline"
          render={<a href={`tel:${client.phone.replace(/\s+/g, "")}`} />}
          className="gap-1.5"
        >
          <Phone className="h-4 w-4" strokeWidth={1.6} />
          Llamar
        </Button>
      </div>
    </div>
  );
}

interface InvoiceDetailOverlayProps {
  invoice: Invoice | null;
  client: Client | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkPaid: (id: string) => void;
}

/** Hoja de detalle de factura: Sheet (bottom) en móvil, Dialog centrado en escritorio. */
export function InvoiceDetailOverlay({
  invoice,
  client,
  open,
  onOpenChange,
  onMarkPaid,
}: InvoiceDetailOverlayProps) {
  if (!invoice || !client) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[92%] gap-0 rounded-none border-t-[3px] border-accent-500 bg-paper p-0 shadow-none lg:hidden"
        >
          <DetailHeader invoice={invoice} />
          <DetailBody invoice={invoice} client={client} onMarkPaid={onMarkPaid} />
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hidden max-w-[480px] rounded-none border border-ink border-t-[3px] border-t-accent-500 bg-paper p-0 shadow-[0_24px_60px_rgba(20,20,20,.35)] ring-0 sm:max-w-[480px] lg:grid">
          <DetailHeader invoice={invoice} />
          <DetailBody invoice={invoice} client={client} onMarkPaid={onMarkPaid} />
        </DialogContent>
      </Dialog>
    </>
  );
}
