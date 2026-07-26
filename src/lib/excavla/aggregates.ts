import type { Expense, ExpenseCat, Invoice, Machine, MachineStatus } from "./types";
import { EXPENSE_CAT_META } from "./types";

export function sumInvoices(invoices: Invoice[]): number {
  return invoices.reduce((acc, i) => acc + i.amount, 0);
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}

export function porCobrar(invoices: Invoice[]): number {
  return invoices
    .filter((i) => i.status === "PENDING")
    .reduce((acc, i) => acc + i.amount, 0);
}

export function nomina(expenses: Expense[]): number {
  return expenses
    .filter((e) => e.cat === "SUELDO")
    .reduce((acc, e) => acc + e.amount, 0);
}

export function vencidas(invoices: Invoice[]): number {
  return invoices.filter((i) => i.status === "PENDING" && i.overdue).length;
}

export function fleetCounts(
  machines: Machine[]
): Record<MachineStatus, number> {
  return {
    WORKING: machines.filter((m) => m.status === "WORKING").length,
    AVAILABLE: machines.filter((m) => m.status === "AVAILABLE").length,
    MAINTENANCE: machines.filter((m) => m.status === "MAINTENANCE").length,
  };
}

export interface MonthSummary {
  month: string; // 'feb', 'mar', ...
  ingresos: number; // millones COP
  egresos: number; // millones COP
}

/** feb–jun 2026 hardcodeados; en producción vendrían del backend. */
export const HISTORICAL_MONTHS: MonthSummary[] = [
  { month: "feb", ingresos: 98, egresos: 71 },
  { month: "mar", ingresos: 112, egresos: 80 },
  { month: "abr", ingresos: 104, egresos: 76 },
  { month: "may", ingresos: 127, egresos: 89 },
  { month: "jun", ingresos: 118, egresos: 82 },
];

export function currentMonthLabel(): string {
  return "jul";
}

export function computeAggregates(invoices: Invoice[], expenses: Expense[]) {
  const ingresos = sumInvoices(invoices);
  const egresos = sumExpenses(expenses);
  const neta = ingresos - egresos;
  const pendiente = porCobrar(invoices);
  const cobrado = ingresos - pendiente;
  const nominaTotal = nomina(expenses);
  const gastosOp = egresos - nominaTotal;
  const margen = ingresos > 0 ? Math.round((neta / ingresos) * 100) : 0;

  const chart: MonthSummary[] = [
    ...HISTORICAL_MONTHS,
    {
      month: currentMonthLabel(),
      ingresos: Math.round(ingresos / 1e6),
      egresos: Math.round(egresos / 1e6),
    },
  ];

  return {
    ingresos,
    egresos,
    neta,
    porCobrar: pendiente,
    cobrado,
    nomina: nominaTotal,
    gastosOp,
    margen,
    vencidas: vencidas(invoices),
    chart,
  };
}

export interface BreakdownItem {
  cat: ExpenseCat;
  label: string;
  amount: number;
  /** Participación sobre el total de egresos. */
  pct: number;
  /** Participación sobre la categoría de mayor gasto — controla el ancho de la barra. */
  barPct: number;
  fill: string;
}

const BREAKDOWN_ORDER: ExpenseCat[] = [
  "SUELDO",
  "GASOLINA",
  "REPUESTO",
  "REPARACION",
  "PUNTO",
];

const BREAKDOWN_FILL: Record<ExpenseCat, string> = {
  SUELDO: "var(--ink)",
  GASOLINA: "var(--accent-500)",
  REPUESTO: "var(--text-3)",
  REPARACION: "var(--accent-700)",
  PUNTO: "#c9c9c4",
};

/** "A dónde se fue el dinero": desglose de egresos por categoría, en orden fijo. */
export function expenseBreakdown(expenses: Expense[]): BreakdownItem[] {
  const total = sumExpenses(expenses);
  const byCat = BREAKDOWN_ORDER.map((cat) => ({
    cat,
    amount: expenses
      .filter((e) => e.cat === cat)
      .reduce((acc, e) => acc + e.amount, 0),
  }));
  const max = Math.max(...byCat.map((c) => c.amount), 1);

  return byCat.map(({ cat, amount }) => ({
    cat,
    label: EXPENSE_CAT_META[cat].label,
    amount,
    pct: total > 0 ? Math.round((amount / total) * 100) : 0,
    barPct: Math.round((amount / max) * 100),
    fill: BREAKDOWN_FILL[cat],
  }));
}
