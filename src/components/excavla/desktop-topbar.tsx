import { Search } from "lucide-react";

interface DesktopTopbarProps {
  title: string;
}

/** Barra de título de escritorio: h3 + buscador de 290px. */
export function DesktopTopbar({ title }: DesktopTopbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-divider px-[22px] py-3.5">
      <h3 className="font-heading text-[25px] font-semibold tracking-[.01em] text-ink">
        {title}
      </h3>
      <label className="flex h-[38px] w-[290px] items-center gap-2 border border-divider-strong bg-surface px-3 text-[13.5px] text-text-3">
        <Search className="h-4 w-4 shrink-0" strokeWidth={1.6} />
        <input
          type="text"
          placeholder="Buscar factura, cliente o máquina"
          className="w-full bg-transparent outline-none placeholder:text-text-3"
        />
      </label>
    </div>
  );
}
