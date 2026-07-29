import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Client } from "@/lib/excavla/types";
import { initials } from "@/lib/excavla/format";
import { formatMoneyShort } from "@/lib/excavla/money";
import { StatusBadge } from "./status-badge";

interface ClientCardProps {
  client: Client;
  servicesCount: number;
  facturado: number;
  porCobrar: number;
  href: string;
  className?: string;
}

/** Tarjeta de cliente móvil — tappable, abre la ficha. */
export function ClientCard({
  client,
  servicesCount,
  facturado,
  porCobrar,
  href,
  className,
}: ClientCardProps) {
  const debe = porCobrar > 0;

  return (
    <Link href={href} className={cn("flex flex-col gap-2.5 border border-divider p-3", className)}>
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-ink font-heading text-[15px] font-semibold text-accent-500">
          {initials(client.name)}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-heading text-[17px] font-semibold text-ink">
            {client.name}
          </span>
          <span className="block truncate text-[12px] text-text-3">
            {client.contact} · {client.phone}
          </span>
        </span>
      </div>
      <div className="flex items-center gap-2.5 border-t border-dashed border-divider-dash pt-2">
        <span className="font-heading text-[11px] font-semibold text-text-3 uppercase">
          {servicesCount} servicios
        </span>
        <span className="h-3.5 w-px shrink-0 bg-divider" />
        <span className="tabular flex-1 truncate text-[12px] text-text-2">
          {formatMoneyShort(facturado)} facturado
        </span>
        <StatusBadge tone={debe ? "available" : "working"} className="shrink-0">
          {debe ? "Debe" : "Al día"}
        </StatusBadge>
      </div>
    </Link>
  );
}
