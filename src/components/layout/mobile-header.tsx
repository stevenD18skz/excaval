import { Search } from "lucide-react";
import { HazardTape } from "./hazard-tape";

interface MobileHeaderProps {
  title: string;
  meta: string;
}

/** Header negro fijo arriba, compartido por las 5 pantallas móviles. */
export function MobileHeader({ title, meta }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-20 bg-ink">
      <div className="flex items-center justify-between px-3.5 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="font-heading text-[19px] font-semibold tracking-[.14em] text-accent-500">
            EXCAVAL
          </span>
          <span className="h-4 w-px bg-ink-line" />
          <span className="font-heading text-xs font-semibold tracking-[.1em] text-text-4 uppercase">
            Gerencia
          </span>
        </div>
        <button
          type="button"
          aria-label="Buscar"
          className="flex h-11 w-11 items-center justify-center border border-ink-line text-paper"
        >
          <Search className="h-5 w-5" strokeWidth={1.6} />
        </button>
      </div>
      <div className="flex items-end justify-between px-3.5 pb-3">
        <h2 className="font-heading text-[31px] font-semibold leading-none text-paper">
          {title}
        </h2>
        <span className="font-heading text-[13px] font-semibold tracking-[.12em] text-text-4 uppercase">
          {meta}
        </span>
      </div>
      <HazardTape />
    </header>
  );
}
