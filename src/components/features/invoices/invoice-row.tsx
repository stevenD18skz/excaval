import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/lib/excaval/types";
import { Button } from "@/components/ui/button";
import { Plate } from "@/components/shared/plate";
import { Money } from "@/components/shared/money";
import { formatMoney } from "@/lib/excaval/money";
import {
  StatusBadge,
  invoiceBorderColor,
  invoiceStatusLabel,
  invoiceStatusTone,
} from "@/components/shared/status-badge";

interface InvoiceRowProps {
  invoice: Invoice;
  clientName: string;
  detailHref: string;
  onMarkPaid: (id: string) => void;
  /** Suma de abonos ya registrados — solo se muestra si es > 0. */
  paidAmount?: number;
}

/** Fila de factura de escritorio: acciones inline (cobrar y ver papel). */
export function InvoiceRow({
  invoice,
  clientName,
  detailHref,
  onMarkPaid,
  paidAmount = 0,
}: InvoiceRowProps) {
  return (
    <div
      className="flex items-center gap-4 border-b border-divider p-[13px_15px] last:border-b-0"
      style={{ borderLeft: `5px solid ${invoiceBorderColor(invoice)}` }}
    >
      <Plate variant="dark" className="h-8 shrink-0 px-1.5">
        {invoice.id}
      </Plate>
      <span className="min-w-0 flex-1">
        <span className="block font-heading text-[17px] font-semibold text-ink">
          {clientName}
        </span>
        <span className="block truncate text-[12.5px] text-text-2">
          {invoice.concept}
        </span>
        {paidAmount > 0 ? (
          <span className="block text-[11px] text-accent-ink">
            Abonado {formatMoney(paidAmount)} de {formatMoney(invoice.amount)}
          </span>
        ) : null}
      </span>
      <StatusBadge tone={invoiceStatusTone(invoice)} className="shrink-0">
        {invoiceStatusLabel(invoice)}
      </StatusBadge>
      <span
        className={cn(
          "w-[118px] shrink-0 text-right text-[12.5px]",
          invoice.overdue ? "text-status-maintenance" : "text-text-3"
        )}
      >
        {invoice.due}
      </span>
      <span className="tabular font-heading w-[145px] shrink-0 text-right text-xl font-semibold text-ink">
        <Money value={invoice.amount} />
      </span>
      <span className="flex w-[190px] shrink-0 items-center justify-end gap-2">

        
        {invoice.status === "PENDING" ? (
          <Button type="button" className="min-h-10" onClick={() => onMarkPaid(invoice.id)}>
            Marcar cobrada
          </Button>
        ) : null}

        <Button
          variant="outline"
          render={<Link href={detailHref} />}
          nativeButton={false}
          className="min-h-10"
        >
          Ver papel
        </Button>
      </span>
    </div>
  );
}
