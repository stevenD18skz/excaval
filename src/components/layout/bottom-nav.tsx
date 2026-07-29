"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";

function isActive(pathname: string, href: string) {
  return pathname.startsWith(href);
}

/** Nav inferior fijo, 5 botones — chrome compartido de las pantallas móviles. */
export function BottomNav({ className }: { className?: string }) {
  const pathname = usePathname();

  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex border-t-[3px] border-accent-500 bg-ink pb-[22px]",
        className
      )}
    >
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex min-h-14 flex-1 flex-col items-center justify-center gap-1 py-2",
              active ? "bg-ink-soft text-accent-500" : "text-nav-inactive"
            )}
          >
            <Icon className="h-[21px] w-[21px]" strokeWidth={1.6} />
            <span className="font-heading text-[10.5px] font-semibold tracking-[.08em] uppercase">
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
