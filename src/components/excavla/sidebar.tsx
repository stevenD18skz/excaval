"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { HazardTape } from "./hazard-tape";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

/** Barra lateral fija de escritorio, 216px — reemplaza el nav inferior a partir de `lg`. */
export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "flex w-[216px] shrink-0 flex-col bg-ink py-[18px] pb-4",
        className
      )}
    >
      <div className="border-b border-ink-line px-[18px] pb-4">
        <div className="font-heading text-[22px] font-semibold tracking-[.14em] text-accent-500">
          EXCAVLA
        </div>
        <div className="mt-1 font-heading text-[11px] font-semibold tracking-[.14em] text-text-4 uppercase">
          Gerencia · Rionegro
        </div>
      </div>

      <nav className="flex flex-col py-2">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex min-h-11 items-center gap-2.5 border-l-[3px] px-4 py-[11px] font-heading text-sm font-semibold tracking-[.08em] uppercase",
                active
                  ? "border-accent-500 bg-ink-soft text-paper"
                  : "border-transparent text-nav-inactive"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.6} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-ink-line">
        <HazardTape />
        <p className="px-[18px] pt-3 text-[11px] text-text-4">
          Datos al 25 de julio · COP
        </p>
      </div>
    </aside>
  );
}
