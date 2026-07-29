"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, Check, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Client, Invoice, Payment } from "@/lib/excaval/types";
import { invoicePaidAmount, invoiceRemaining } from "@/lib/excaval/aggregates";
import { formatMoney } from "@/lib/excaval/money";
import { Blueprint } from "@/components/shared/blueprint";
import { Plate } from "@/components/shared/plate";
import { Money } from "@/components/shared/money";
import { AbonoForm } from "./abono-form";
import {
  StatusBadge,
  invoiceStatusLabel,
  invoiceStatusTone,
} from "@/components/shared/status-badge";

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
  payments,
  onMarkPaid,
  onAddAbono,
}: {
  invoice: Invoice;
  client: Client;
  payments: Payment[];
  onMarkPaid: (id: string) => void;
  onAddAbono: (id: string, amount: number, note?: string) => void;
}) {
  const [showAbonoForm, setShowAbonoForm] = useState(false);

  const pending = invoice.status !== "PAID";
  const invoicePayments = payments.filter((p) => p.invoiceId === invoice.id);
  const paidAmount = invoicePaidAmount(invoice.id, payments);
  const remaining = invoiceRemaining(invoice, payments);
  const paidPct = invoice.amount > 0 ? Math.min(100, Math.round((paidAmount / invoice.amount) * 100)) : 0;

  function handleAbonoSubmit(amount: number, note?: string) {
    onAddAbono(invoice.id, amount, note);
    setShowAbonoForm(false);
  }

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

        {paidAmount > 0 ? (
          <div className="mt-3 border-t border-dashed border-divider-dash pt-3">
            <div className="flex items-center justify-between text-[12px] text-accent-ink">
              <span>
                Abonado <Money value={paidAmount} className="text-[12px]" /> de{" "}
                <Money value={invoice.amount} className="text-[12px]" />
              </span>
              <span className="tabular">{paidPct}%</span>
            </div>
            <div className="mt-1.5 h-2 border border-ink bg-paper">
              <div className="h-full bg-ink" style={{ width: `${paidPct}%` }} />
            </div>
            <div className="mt-1.5 text-[12px] text-accent-ink">
              Saldo pendiente: <Money value={remaining} className="text-[12px]" />
            </div>
          </div>
        ) : null}
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

      {invoicePayments.length > 0 ? (
        <div>
          <span className="font-heading text-[10.5px] font-semibold tracking-[.1em] text-text-3 uppercase">
            Abonos registrados
          </span>
          <div className="mt-1.5 flex flex-col gap-1.5">
            {invoicePayments.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between border border-divider p-2 text-[12.5px]"
              >
                <span className="text-text-2">
                  {p.date}
                  {p.note ? ` · ${p.note}` : ""}
                </span>
                <span className="tabular font-heading font-semibold text-ink">
                  {formatMoney(p.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

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

      {pending && showAbonoForm ? (
        <AbonoForm max={remaining} onSubmit={handleAbonoSubmit} onCancel={() => setShowAbonoForm(false)} />
      ) : pending ? (
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={() => setShowAbonoForm(true)}>
            Registrar abono
          </Button>
          <Button type="button" className="gap-2" onClick={() => onMarkPaid(invoice.id)}>
            <Check className="h-4 w-4" strokeWidth={2.4} />
            Marcar cobrada
          </Button>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          render={<Link href={`/clientes?cliente=${client.id}`} />}
          nativeButton={false}
        >
          Ver cliente
        </Button>
        <Button
          variant="outline"
          render={<a href={`tel:${client.phone.replace(/\s+/g, "")}`} />}
          nativeButton={false}
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
  payments: Payment[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMarkPaid: (id: string) => void;
  onAddAbono: (id: string, amount: number, note?: string) => void;
}

/** Hoja de detalle de factura: Sheet (bottom) en móvil, Dialog centrado en escritorio. */
export function InvoiceDetailOverlay({
  invoice,
  client,
  payments,
  open,
  onOpenChange,
  onMarkPaid,
  onAddAbono,
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
          <DetailBody
            key={invoice.id}
            invoice={invoice}
            client={client}
            payments={payments}
            onMarkPaid={onMarkPaid}
            onAddAbono={onAddAbono}
          />
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hidden max-h-[88%] max-w-[480px] gap-0 overflow-y-auto rounded-none border border-ink border-t-[3px] border-t-accent-500 bg-paper p-0 shadow-[0_24px_60px_rgba(20,20,20,.35)] ring-0 sm:max-w-[480px] lg:grid">
          <DetailHeader invoice={invoice} />
          <DetailBody
            key={invoice.id}
            invoice={invoice}
            client={client}
            payments={payments}
            onMarkPaid={onMarkPaid}
            onAddAbono={onAddAbono}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
