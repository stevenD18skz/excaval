import { Home, MapPin } from "lucide-react";
import type { Machine, MachineStatus } from "@/lib/excavla/types";
import { Blueprint } from "./blueprint";
import { Plate } from "./plate";
import { TrafficLight } from "./traffic-light";
import { MachineStatusControl } from "./machine-status-control";
import { MachinePhotoUpload } from "./machine-photo-upload";
import {
  StatusBadge,
  machineStatusLabel,
  machineStatusTone,
} from "./status-badge";

const BORDER_VAR: Record<MachineStatus, string> = {
  WORKING: "var(--status-working)",
  AVAILABLE: "var(--status-available)",
  MAINTENANCE: "var(--status-maintenance)",
};

interface MachineCardDesktopProps {
  machine: Machine;
  onChangeStatus: (code: string, status: MachineStatus) => void;
  onUploadPhoto: (code: string, photo: string) => void;
  priority?: boolean;
}

/** Tarjeta de máquina de escritorio — el estado se cambia inline, sin abrir nada. */
export function MachineCardDesktop({
  machine,
  onChangeStatus,
  onUploadPhoto,
  priority = false,
}: MachineCardDesktopProps) {
  return (
    <div
      className="flex gap-3.5 border-t-4 p-3.5"
      style={{ borderTopColor: BORDER_VAR[machine.status] }}
    >
      <MachinePhotoUpload
        src={machine.photo}
        alt={machine.name}
        onUpload={(dataUrl) => onUploadPhoto(machine.code, dataUrl)}
        compact
        priority={priority}
        className="h-24 w-24"
      />

      <Blueprint tone="dark" className="shrink-0 self-start">
        <TrafficLight status={machine.status} dotSize={19} variant="dark" />
      </Blueprint>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <Plate variant="dark" className="h-6 px-1.5 text-[11px]">
            {machine.code}
          </Plate>
          <StatusBadge tone={machineStatusTone(machine.status)}>
            {machineStatusLabel(machine.status)}
          </StatusBadge>
          <span className="text-[11px] text-text-3">
            {machine.since} · {machine.hours}
          </span>
        </div>

        <div className="mt-1.5 truncate font-heading text-[19px] font-semibold text-ink">
          {machine.name}
        </div>
        <div className="truncate text-[12px] text-text-3">{machine.type}</div>

        <div className="mt-1.5 flex items-center gap-1.5 text-[12px] text-text-3">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-accent-700" strokeWidth={1.6} />
          <span className="truncate">{machine.location}</span>
        </div>
        <div className="mt-1 flex items-center gap-1.5 text-[12px] text-text-3">
          <Home className="h-3.5 w-3.5 shrink-0 text-accent-700" strokeWidth={1.6} />
          <span className="truncate">{machine.client}</span>
        </div>

        <MachineStatusControl
          status={machine.status}
          onChange={(status) => onChangeStatus(machine.code, status)}
          variant="inline"
          className="mt-3"
        />

        <p className="mt-2 text-[11px] text-text-4">{machine.updated}</p>
      </div>
    </div>
  );
}
