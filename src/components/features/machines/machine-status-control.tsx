"use client";

import { cn } from "@/lib/utils";
import type { MachineStatus } from "@/lib/excaval/types";
import { machineStatusLabel } from "@/components/shared/status-badge";

const ORDER: MachineStatus[] = ["WORKING", "AVAILABLE", "MAINTENANCE"];

const HINT: Record<MachineStatus, string> = {
  WORKING: "genera ingreso",
  AVAILABLE: "sin asignar",
  MAINTENANCE: "parada",
};

const DOT_VAR: Record<MachineStatus, string> = {
  WORKING: "var(--status-working)",
  AVAILABLE: "var(--status-available)",
  MAINTENANCE: "var(--status-maintenance)",
};

const TINT_VAR: Record<MachineStatus, string> = {
  WORKING: "var(--status-working-bg)",
  AVAILABLE: "var(--status-available-bg)",
  MAINTENANCE: "var(--status-maintenance-bg)",
};

const TEXT_VAR: Record<MachineStatus, string> = {
  WORKING: "var(--status-working-text)",
  AVAILABLE: "var(--status-available-text)",
  MAINTENANCE: "var(--status-maintenance-text)",
};

interface MachineStatusControlProps {
  status: MachineStatus;
  onChange: (status: MachineStatus) => void;
  /** "sheet": columna con hint, botones grandes (hoja móvil). "inline": fila compacta (tarjeta escritorio). */
  variant?: "sheet" | "inline";
  className?: string;
}

/** Los 3 botones de cambio de estado — un toque cambia el estado, sin confirmación. */
export function MachineStatusControl({
  status,
  onChange,
  variant = "sheet",
  className,
}: MachineStatusControlProps) {
  const isSheet = variant === "sheet";

  return (
    <div
      className={cn(
        isSheet
          ? "flex flex-col gap-2"
          : "flex gap-2 border-t border-dashed border-divider-dash pt-2.5",
        className
      )}
    >
      {ORDER.map((s) => {
        const active = s === status;
        return (
          <button
            key={s}
            type="button"
            onClick={() => onChange(s)}
            className={cn(
              "flex items-center border font-heading font-semibold uppercase",
              isSheet
                ? "min-h-11 justify-between px-3 text-[14.5px]"
                : "min-h-[38px] flex-1 justify-center gap-1.5 text-xs",
              !active && "border-[rgba(20,20,20,.22)] bg-paper text-text-2"
            )}
            style={
              active
                ? {
                    backgroundColor: TINT_VAR[s],
                    borderColor: DOT_VAR[s],
                    color: TEXT_VAR[s],
                  }
                : undefined
            }
          >
            <span className="flex items-center gap-2">
              <span
                className="inline-block shrink-0 rounded-full"
                style={{
                  width: isSheet ? 12 : 10,
                  height: isSheet ? 12 : 10,
                  backgroundColor: DOT_VAR[s],
                }}
              />
              {machineStatusLabel(s)}
            </span>
            {isSheet ? (
              <span className="font-sans text-[11px] font-normal normal-case text-text-3">
                {HINT[s]}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
