import { create } from "zustand";
import {
  clients as seedClients,
  expenses as seedExpenses,
  invoices as seedInvoices,
  machines as seedMachines,
} from "./seed-data";
import type { Invoice } from "./types";

/** Fecha de referencia del sistema (ver AGENTS.md / contexto de sesión). */
const TODAY_SHORT = "26 jul";

interface UndoSnapshot {
  status: Invoice["status"];
  due: string;
  overdue: boolean;
}

interface ExcavlaState {
  invoices: Invoice[];
  expenses: typeof seedExpenses;
  machines: typeof seedMachines;
  clients: typeof seedClients;
  undoStack: Record<string, UndoSnapshot>;
  markInvoicePaid: (id: string) => void;
  undoInvoicePaid: (id: string) => void;
}

/**
 * Estado compartido entre Dashboard y los demás módulos: "un cambio en uno
 * se refleja en el otro" (README §State Management). Cobrar es optimista,
 * sin llamada a red — en producción esto se reemplaza por mutaciones al
 * backend con el mismo patrón optimista.
 */
export const useExcavlaStore = create<ExcavlaState>((set) => ({
  invoices: seedInvoices,
  expenses: seedExpenses,
  machines: seedMachines,
  clients: seedClients,
  undoStack: {},

  markInvoicePaid: (id) =>
    set((state) => {
      const invoice = state.invoices.find((i) => i.id === id);
      if (!invoice || invoice.status === "PAID") return state;

      const snapshot: UndoSnapshot = {
        status: invoice.status,
        due: invoice.due,
        overdue: invoice.overdue,
      };

      return {
        invoices: state.invoices.map((i) =>
          i.id === id
            ? { ...i, status: "PAID", due: `Pagada ${TODAY_SHORT}`, overdue: false }
            : i
        ),
        undoStack: { ...state.undoStack, [id]: snapshot },
      };
    }),

  undoInvoicePaid: (id) =>
    set((state) => {
      const snapshot = state.undoStack[id];
      if (!snapshot) return state;

      const nextUndoStack = { ...state.undoStack };
      delete nextUndoStack[id];

      return {
        invoices: state.invoices.map((i) => (i.id === id ? { ...i, ...snapshot } : i)),
        undoStack: nextUndoStack,
      };
    }),
}));
