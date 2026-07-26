import { cn } from "@/lib/utils";

/** Franja de peligro amarillo/negro. Solo bajo el header móvil y en el pie de la barra lateral. */
export function HazardTape({ className }: { className?: string }) {
  return <div aria-hidden className={cn("hazard-tape h-[5px] w-full", className)} />;
}
