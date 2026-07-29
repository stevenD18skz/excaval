import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  clients as seedClients,
  expenses as seedExpenses,
  invoices as seedInvoices,
  machines as seedMachines,
} from "./seed-data";
import type { Expense, ExpenseCat, Invoice, Machine, MachineStatus } from "./types";

/** Fecha de referencia del sistema (ver AGENTS.md / contexto de sesión). */
const TODAY_SHORT = "26 jul";

interface UndoSnapshot {
  status: Invoice["status"];
  due: string;
  overdue: boolean;
}

export interface NewExpenseInput {
  cat: ExpenseCat;
  desc: string;
  amount: number;
  machine: string;
  photo: boolean;
}

interface ExcavlaState {
  invoices: Invoice[];
  expenses: Expense[];
  machines: Machine[];
  clients: typeof seedClients;
  undoStack: Record<string, UndoSnapshot>;
  markInvoicePaid: (id: string) => void;
  undoInvoicePaid: (id: string) => void;
  addExpense: (input: NewExpenseInput) => Expense;
  setMachineStatus: (code: string, status: MachineStatus) => void;
  setMachinePhoto: (code: string, photo: string) => void;
  resetDemo: () => void;
}

/**
 * Estado de la simulación: compartido entre Dashboard y los demás módulos
 * ("un cambio en uno se refleja en el otro", README §State Management), y
 * persistido en `sessionStorage` — los cambios de una visita sobreviven a
 * la navegación y al refresh, pero se reinician en cada sesión nueva del
 * navegador. Cobrar y cambiar estado son optimistas, sin llamada a red: en
 * producción esto se reemplaza por mutaciones al backend con el mismo
 * patrón, y `sessionStorage` por la fuente de verdad real.
 */
export const useExcavlaStore = create<ExcavlaState>()(
  persist(
    (set, get) => ({
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

      addExpense: (input) => {
        const expense: Expense = {
          id: `GAS-${1000 + get().expenses.length}`,
          cat: input.cat,
          desc: input.desc,
          amount: input.amount,
          date: TODAY_SHORT,
          machine: input.machine,
          photo: input.photo,
        };
        set((state) => ({ expenses: [expense, ...state.expenses] }));
        return expense;
      },

      setMachineStatus: (code, status) =>
        set((state) => ({
          machines: state.machines.map((m) =>
            m.code === code
              ? {
                  ...m,
                  status,
                  client: status === "WORKING" ? m.client : "Sin asignar",
                  since: "desde hoy",
                  updated: "Hoy · cambiado desde la obra",
                }
              : m
          ),
        })),

      setMachinePhoto: (code, photo) =>
        set((state) => ({
          machines: state.machines.map((m) => (m.code === code ? { ...m, photo } : m)),
        })),

      resetDemo: () =>
        set({
          invoices: seedInvoices,
          expenses: seedExpenses,
          machines: seedMachines,
          clients: seedClients,
          undoStack: {},
        }),
    }),
    {
      name: "excavla-demo",
      storage: createJSONStorage(() => sessionStorage),
      // Evita el desajuste de hidratación en Next: el primer render del
      // cliente usa el seed (igual que el servidor) y StoreHydrator
      // rehidrata desde sessionStorage justo después del mount.
      skipHydration: true,
      partialize: (state) => ({
        invoices: state.invoices,
        expenses: state.expenses,
        machines: state.machines,
        undoStack: state.undoStack,
      }),
    }
  )
);
