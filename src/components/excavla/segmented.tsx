"use client";

import { cn } from "@/lib/utils";

interface SegmentedOption {
  value: string;
  label: string;
  count?: number;
}

interface SegmentedProps {
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  size?: "mobile" | "desktop";
  /** "paper": activo negro/blanco (Cuentas). "accent": activo negro/amarillo (Salidas). */
  tone?: "paper" | "accent";
  className?: string;
}

/** Segmentado de filtro: activo negro, inactivo blanco. */
export function Segmented({
  options,
  value,
  onChange,
  size = "mobile",
  tone = "paper",
  className,
}: SegmentedProps) {
  return (
    <div className={cn("flex border border-ink", className)}>
      {options.map((opt, i) => {
        const active = opt.value === value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={cn(
              "flex-1 font-heading font-semibold uppercase",
              size === "mobile"
                ? "min-h-11 text-[12.5px]"
                : "min-h-10 px-4 py-[9px] text-[12.5px]",
              i > 0 && "border-l border-ink",
              active
                ? tone === "accent"
                  ? "bg-ink text-accent-500"
                  : "bg-ink text-paper"
                : "bg-paper text-text-2"
            )}
          >
            {opt.label}
            {opt.count !== undefined ? ` ${opt.count}` : ""}
          </button>
        );
      })}
    </div>
  );
}
