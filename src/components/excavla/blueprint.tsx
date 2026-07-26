import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const CORNER_POSITION: Record<string, string> = {
  tl: "top-1 left-1",
  tr: "top-1 right-1",
  bl: "bottom-1 left-1",
  br: "bottom-1 right-1",
};

function Corner({
  position,
  tone,
}: {
  position: keyof typeof CORNER_POSITION;
  tone: "light" | "dark";
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "pointer-events-none absolute flex h-2.5 w-2.5 items-center justify-center text-[11px] leading-none select-none",
        CORNER_POSITION[position],
        tone === "dark" ? "text-white/55" : "text-ink/35"
      )}
    >
      +
    </span>
  );
}

interface BlueprintProps {
  children: ReactNode;
  className?: string;
  /** Color de las marcas de esquina: "dark" para tarjetas de fondo negro. */
  tone?: "light" | "dark";
}

/** Tarjeta con marcas de registro `+` en las cuatro esquinas (gramática Industry). */
export function Blueprint({ children, className, tone = "light" }: BlueprintProps) {
  return (
    <div className={cn("relative", className)}>
      <Corner position="tl" tone={tone} />
      <Corner position="tr" tone={tone} />
      <Corner position="bl" tone={tone} />
      <Corner position="br" tone={tone} />
      {children}
    </div>
  );
}
