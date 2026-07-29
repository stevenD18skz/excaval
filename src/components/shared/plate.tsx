import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type PlateVariant = "dark" | "accent" | "surface" | "tint" | "paper";

const VARIANT_CLASSES: Record<PlateVariant, string> = {
  dark: "bg-ink text-accent-500 border-ink",
  accent: "bg-accent-500 text-ink border-ink",
  surface: "bg-surface text-ink border-ink",
  tint: "bg-accent-100 text-ink border-ink",
  paper: "bg-paper text-ink border-ink",
};

interface PlateProps {
  children: ReactNode;
  variant?: PlateVariant;
  className?: string;
}

/** Placa tipo chapa: códigos e identificadores (FAC-0182, EX-01, REP, CMB). */
export function Plate({ children, variant = "dark", className }: PlateProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center border font-heading text-xs font-semibold tracking-[.07em] uppercase",
        VARIANT_CLASSES[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
