import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Invoice } from "@/lib/excaval/types";
import { Plate } from "@/components/shared/plate";
import { Money } from "@/components/shared/money";
import {
  StatusBadge,
  invoiceBorderColor,
  invoiceStatusLabel,
  invoiceStatusTone,
} from "@/components/shared/status-badge";

interface InvoiceCardProps {
  invoice: Invoice;
  clientName: string;
  href: string;
}

/** Tarjeta de factura móvil — tappable, abre la hoja de detalle. */
export function InvoiceCard({ invoice, clientName, href }: InvoiceCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-2 border border-divider p-3"
      style={{ borderLeft: `5px solid ${invoiceBorderColor(invoice)}` }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Plate variant="dark" className="h-6 px-1.5">
            {invoice.id}
          </Plate>
          <span className="text-[11px] text-text-3">{invoice.date}</span>
        </div>
        <StatusBadge tone={invoiceStatusTone(invoice)}>
          {invoiceStatusLabel(invoice)}
        </StatusBadge>
      </div>

      <div className="font-heading text-lg font-semibold text-ink">{clientName}</div>
      <p className="text-[12.5px] leading-[1.35] text-text-2">{invoice.concept}</p>

      <div className="flex items-center justify-between border-t border-dashed border-divider-dash pt-2">
        <span className="tabular font-heading text-[25px] font-semibold text-ink">
          <Money value={invoice.amount} />
        </span>
        <span className="flex items-center gap-1">
          <span
            className={cn(
              "text-[12.5px]",
              invoice.overdue ? "text-status-maintenance" : "text-text-3"
            )}
          >
            {invoice.due}
          </span>
          <ChevronRight className="h-4 w-4 text-text-3" strokeWidth={1.6} />
        </span>
      </div>
    </Link>
  );
}
