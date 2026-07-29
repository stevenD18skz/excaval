import Link from "next/link";
import { MapPin } from "lucide-react";
import type { Machine } from "@/lib/excavla/types";
import { Plate } from "./plate";
import { TrafficLight } from "./traffic-light";
import { MachinePhoto } from "./machine-photo";
import {
  StatusBadge,
  machineStatusLabel,
  machineStatusTone,
} from "./status-badge";

interface MachineCardProps {
  machine: Machine;
  href: string;
  priority?: boolean;
}

/** Tarjeta de máquina móvil — tappable, abre la hoja del semáforo. */
export function MachineCard({ machine, href, priority = false }: MachineCardProps) {
  return (
    <Link href={href} className="flex gap-3 border border-divider p-3">
      <MachinePhoto
        src={machine.photo}
        alt={machine.name}
        priority={priority}
        className="h-[68px] w-14"
      />

      <div className="flex shrink-0 flex-col items-center gap-2">
        <Plate variant="dark" className="h-[34px] w-[46px] text-[13px]">
          {machine.code}
        </Plate>
        <TrafficLight status={machine.status} dotSize={13} variant="light" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <StatusBadge tone={machineStatusTone(machine.status)}>
            {machineStatusLabel(machine.status)}
          </StatusBadge>
          <span className="shrink-0 text-[11px] text-text-3">{machine.since}</span>
        </div>
        <div className="mt-1 truncate font-heading text-[17px] font-semibold text-ink">
          {machine.name}
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-text-3">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-700" strokeWidth={1.6} />
          <span className="truncate">{machine.location}</span>
        </div>
        <div className="mt-0.5 truncate text-[12px] text-text-3">{machine.client}</div>
      </div>
    </Link>
  );
}
