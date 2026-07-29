"use client";

import { toast } from "sonner";
import { Check } from "lucide-react";

/** Toast negro/amarillo del sistema, con Deshacer opcional. Se auto-oculta a 4200ms. */
export function showActionToast(message: string, onUndo?: () => void) {
  toast.custom(
    (id) => (
      <div className="flex items-center gap-3 border-l-[5px] border-accent-500 bg-ink p-3 text-paper shadow-[0_12px_30px_rgba(20,20,20,.3)]">
        <Check className="h-[18px] w-[18px] shrink-0 text-accent-500" strokeWidth={2.2} />
        <span className="flex-1 text-[12.5px]">{message}</span>
        {onUndo ? (
          <button
            type="button"
            onClick={() => {
              onUndo();
              toast.dismiss(id);
            }}
            className="shrink-0 border border-ink-dim px-2.5 py-1.5 font-heading text-xs font-semibold tracking-[.06em] text-accent-500 uppercase"
          >
            Deshacer
          </button>
        ) : null}
      </div>
    ),
    { duration: 4200 }
  );
}
