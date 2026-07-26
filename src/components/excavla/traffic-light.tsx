import { cn } from "@/lib/utils";
import type { MachineStatus } from "@/lib/excavla/types";

const LAMP_ORDER: MachineStatus[] = ["WORKING", "AVAILABLE", "MAINTENANCE"];

const LAMP_COLOR: Record<MachineStatus, string> = {
  WORKING: "var(--status-working)",
  AVAILABLE: "var(--status-available)",
  MAINTENANCE: "var(--status-maintenance)",
};

interface TrafficLightProps {
  status: MachineStatus;
  /** Diámetro de cada lámpara en px. 10 (desktop compacto) · 13 (card móvil) · 19 (card desktop grande) · 26 (hoja de detalle). */
  dotSize?: number;
  /** "light": contenedor claro con borde ink. "dark": contenedor blueprint negro con halo. */
  variant?: "light" | "dark";
  className?: string;
}

/** El semáforo físico de 3 lámparas: verde (Trabajando) → amarillo (Disponible) → rojo (Mantenimiento). */
export function TrafficLight({
  status,
  dotSize = 13,
  variant = "light",
  className,
}: TrafficLightProps) {
  const isDark = variant === "dark";
  const gap = Math.max(4, Math.round(dotSize * 0.3));
  const padding = isDark ? "9px 7px" : "6px 5px";

  return (
    <div
      className={cn(
        "inline-flex flex-col items-center border",
        isDark ? "border-transparent bg-ink" : "border-ink bg-surface",
        className
      )}
      style={{ padding, gap }}
    >
      {LAMP_ORDER.map((lamp) => {
        const active = lamp === status;
        return (
          <span
            key={lamp}
            aria-hidden
            className="block rounded-full border"
            style={{
              width: dotSize,
              height: dotSize,
              backgroundColor: active ? LAMP_COLOR[lamp] : "var(--status-off)",
              borderColor: isDark ? "rgba(255,255,255,.3)" : "var(--ink)",
              boxShadow:
                isDark && active ? "0 0 0 2px rgba(255,255,255,.14)" : undefined,
            }}
          />
        );
      })}
    </div>
  );
}
