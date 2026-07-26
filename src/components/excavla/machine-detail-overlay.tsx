"use client";

import type { ReactNode } from "react";
import { Clock, Home, MapPin } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import type { Machine, MachineStatus } from "@/lib/excavla/types";
import { Blueprint } from "./blueprint";
import { Plate } from "./plate";
import { TrafficLight } from "./traffic-light";
import { MachineStatusControl } from "./machine-status-control";
import { MachinePhotoUpload } from "./machine-photo-upload";

function InfoCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5 border border-divider p-3">
      <span className="mt-0.5 shrink-0 text-accent-700">{icon}</span>
      <div className="min-w-0">
        <div className="font-heading text-[10.5px] font-semibold tracking-[.08em] text-text-3 uppercase">
          {label}
        </div>
        <div className="mt-0.5 truncate text-[14.5px] text-ink">{value}</div>
      </div>
    </div>
  );
}

interface MachineDetailOverlayProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onChangeStatus: (code: string, status: MachineStatus) => void;
  onUploadPhoto: (code: string, photo: string) => void;
}

/** Hoja de cambio de estado del semáforo — solo móvil (en escritorio es inline en la tarjeta). */
export function MachineDetailOverlay({
  machine,
  open,
  onOpenChange,
  onChangeStatus,
  onUploadPhoto,
}: MachineDetailOverlayProps) {
  if (!machine) return null;

  const metricLabel = machine.hours.includes("km") ? "kilometraje" : "horómetro";

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[92%] gap-0 rounded-none border-t-[3px] border-accent-500 bg-paper p-0 shadow-none lg:hidden"
      >
        <div className="flex items-center gap-2.5 border-b border-divider p-3.5">
          <Plate variant="dark" className="h-7 px-1.5">
            {machine.code}
          </Plate>
          <span className="font-heading text-xs font-semibold tracking-[.1em] text-text-3 uppercase">
            Semáforo de la máquina
          </span>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto p-4">
          <MachinePhotoUpload
            src={machine.photo}
            alt={machine.name}
            onUpload={(dataUrl) => onUploadPhoto(machine.code, dataUrl)}
            priority
            className="h-44 w-full"
          />

          <div>
            <h2 className="font-heading text-[23px] font-semibold text-ink">{machine.name}</h2>
            <p className="mt-1 text-[13px] text-text-2">
              {machine.type} · {metricLabel} {machine.hours}
            </p>
          </div>

          <div className="flex items-start gap-4">
            <Blueprint tone="dark" className="shrink-0">
              <TrafficLight status={machine.status} dotSize={26} variant="dark" />
            </Blueprint>
            <MachineStatusControl
              status={machine.status}
              onChange={(status) => onChangeStatus(machine.code, status)}
              variant="sheet"
              className="flex-1"
            />
          </div>

          <div className="flex flex-col gap-2.5">
            <InfoCard
              icon={<MapPin className="h-4 w-4" strokeWidth={1.6} />}
              label="Ubicación actual"
              value={machine.location}
            />
            <InfoCard
              icon={<Home className="h-4 w-4" strokeWidth={1.6} />}
              label="Cliente / proyecto"
              value={machine.client}
            />
            <InfoCard
              icon={<Clock className="h-4 w-4" strokeWidth={1.6} />}
              label="Último cambio"
              value={machine.updated}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
