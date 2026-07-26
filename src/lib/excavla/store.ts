import { create } from "zustand";
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
}

/**
 * Estado compartido entre Dashboard y los demás módulos: "un cambio en uno
 * se refleja en el otro" (README §State Management). Cobrar es optimista,
 * sin llamada a red — en producción esto se reemplaza por mutaciones al
 * backend con el mismo patrón optimista.
 */
export const useExcavlaStore = create<ExcavlaState>((set, get) => ({
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
}));
