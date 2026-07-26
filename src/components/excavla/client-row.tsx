import Link from "next/link";
import { cn } from "@/lib/utils";
import type { Client } from "@/lib/excavla/types";
import { initials } from "@/lib/excavla/format";
import { formatMoneyShort } from "@/lib/excavla/money";
import { StatusBadge } from "./status-badge";

interface ClientRowProps {
  client: Client;
  servicesCount: number;
  facturado: number;
  porCobrar: number;
  href: string;
  active: boolean;
}

/** Fila de cliente del maestro/detalle de escritorio — el borde siempre está
 * presente (transparente si no está seleccionada) para que no salte el layout. */
export function ClientRow({
  client,
  servicesCount,
  facturado,
  porCobrar,
  href,
  active,
}: ClientRowProps) {
  const debe = porCobrar > 0;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 border border-l-4 p-2.5",
        active
          ? "border-ink border-l-accent-500 bg-accent-100"
          : "border-divider border-l-transparent bg-paper"
      )}
    >
      <span className="flex h-[38px] w-[38px] shrink-0 items-center justify-center bg-ink font-heading text-[13px] font-semibold text-accent-500">
        {initials(client.name)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate font-heading text-[15px] font-semibold text-ink">
          {client.name}
        </span>
        <span className="tabular block truncate text-[11.5px] text-text-3">
          {servicesCount} servicios · {formatMoneyShort(facturado)}
        </span>
      </span>
      <StatusBadge tone={debe ? "available" : "working"} className="shrink-0">
        {debe ? "Debe" : "Al día"}
      </StatusBadge>
    </Link>
  );
}
