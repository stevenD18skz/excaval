import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  clients as seedClients,
  expenses as seedExpenses,
  invoices as seedInvoices,
  machines as seedMachines,
  maintenanceRecords as seedMaintenanceRecords,
  payments as seedPayments,
  quotes as seedQuotes,
} from "./seed-data";
import type {
  Expense,
  ExpenseCat,
  Invoice,
  Machine,
  MachineStatus,
  MaintenanceRecord,
  Payment,
  Quote,
} from "./types";

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

export interface NewMaintenanceInput {
  machineCode: string;
  reason: string;
  estimatedDays: number;
  cost: number;
  hasInvoice: boolean;
}

export interface NewQuoteInput {
  machineCode: string;
  clientName: string;
  hours: number;
  ratePerHour: number;
}

interface ExcavalState {
  invoices: Invoice[];
  expenses: Expense[];
  machines: Machine[];
  clients: typeof seedClients;
  payments: Payment[];
  maintenanceRecords: MaintenanceRecord[];
  quotes: Quote[];
  undoStack: Record<string, UndoSnapshot>;
  markInvoicePaid: (id: string) => void;
  undoInvoicePaid: (id: string) => void;
  addAbono: (invoiceId: string, amount: number, note?: string) => Payment;
  addExpense: (input: NewExpenseInput) => Expense;
  setMachineStatus: (code: string, status: MachineStatus) => void;
  setMachinePhoto: (code: string, photo: string) => void;
  addMaintenanceRecord: (input: NewMaintenanceInput) => MaintenanceRecord;
  addQuote: (input: NewQuoteInput) => Quote;
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
export const useExcavalStore = create<ExcavalState>()(
  persist(
    (set, get) => ({
      invoices: seedInvoices,
      expenses: seedExpenses,
      machines: seedMachines,
      clients: seedClients,
      payments: seedPayments,
      maintenanceRecords: seedMaintenanceRecords,
      quotes: seedQuotes,
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

      addAbono: (invoiceId, amount, note) => {
        const payment: Payment = {
          id: `ABO-${1000 + get().payments.length}`,
          invoiceId,
          amount,
          date: TODAY_SHORT,
          note,
        };

        set((state) => {
          const invoice = state.invoices.find((i) => i.id === invoiceId);
          if (!invoice) return state;

          const paidSoFar =
            state.payments
              .filter((p) => p.invoiceId === invoiceId)
              .reduce((acc, p) => acc + p.amount, 0) + amount;
          const fullyPaid = paidSoFar >= invoice.amount;

          return {
            payments: [payment, ...state.payments],
            invoices: state.invoices.map((i) =>
              i.id === invoiceId
                ? fullyPaid
                  ? { ...i, status: "PAID", due: `Pagada ${TODAY_SHORT}`, overdue: false }
                  : { ...i, status: "PARTIAL" }
                : i
            ),
          };
        });

        return payment;
      },

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

      addMaintenanceRecord: (input) => {
        let expenseId: string | undefined;
        if (input.cost > 0) {
          const expense = get().addExpense({
            cat: "REPARACION",
            desc: input.reason,
            amount: input.cost,
            machine: input.machineCode,
            photo: input.hasInvoice,
          });
          expenseId = expense.id;
        }

        const record: MaintenanceRecord = {
          id: `MNT-${1000 + get().maintenanceRecords.length}`,
          machineCode: input.machineCode,
          reason: input.reason,
          startDate: TODAY_SHORT,
          estimatedDays: input.estimatedDays,
          cost: input.cost,
          hasInvoice: input.hasInvoice,
          status: "EN_CURSO",
          expenseId,
        };

        set((state) => ({
          maintenanceRecords: [record, ...state.maintenanceRecords],
          machines: state.machines.map((m) =>
            m.code === input.machineCode
              ? {
                  ...m,
                  status: "MAINTENANCE",
                  client: "Sin asignar",
                  since: "desde hoy",
                  updated: "Hoy · cambiado desde la obra",
                }
              : m
          ),
        }));

        return record;
      },

      addQuote: (input) => {
        const quote: Quote = {
          id: `COT-${1000 + get().quotes.length}`,
          machineCode: input.machineCode,
          clientName: input.clientName,
          hours: input.hours,
          ratePerHour: input.ratePerHour,
          total: input.hours * input.ratePerHour,
          date: TODAY_SHORT,
        };
        set((state) => ({ quotes: [quote, ...state.quotes] }));
        return quote;
      },

      resetDemo: () =>
        set({
          invoices: seedInvoices,
          expenses: seedExpenses,
          machines: seedMachines,
          clients: seedClients,
          payments: seedPayments,
          maintenanceRecords: seedMaintenanceRecords,
          quotes: seedQuotes,
          undoStack: {},
        }),
    }),
    {
      name: "excaval-demo",
      storage: createJSONStorage(() => sessionStorage),
      // Evita el desajuste de hidratación en Next: el primer render del
      // cliente usa el seed (igual que el servidor) y StoreHydrator
      // rehidrata desde sessionStorage justo después del mount.
      skipHydration: true,
      partialize: (state) => ({
        invoices: state.invoices,
        expenses: state.expenses,
        machines: state.machines,
        payments: state.payments,
        maintenanceRecords: state.maintenanceRecords,
        quotes: state.quotes,
        undoStack: state.undoStack,
      }),
    }
  )
);
