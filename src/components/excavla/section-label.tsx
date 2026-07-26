import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: ReactNode;
  trailing?: ReactNode;
  tone?: "default" | "onDark";
  className?: string;
}

/** Label uppercase .14em + línea flex-1 — el rasgo tipográfico central del sistema. */
export function SectionLabel({
  children,
  trailing,
  tone = "default",
  className,
}: SectionLabelProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span
        className={cn(
          "font-heading text-[11px] font-semibold tracking-[.14em] uppercase whitespace-nowrap",
          tone === "onDark" ? "text-accent-500" : "text-text-3"
        )}
      >
        {children}
      </span>
      <span
        className={cn(
          "h-px flex-1",
          tone === "onDark" ? "bg-ink-line" : "bg-divider"
        )}
      />
      {trailing}
    </div>
  );
}
