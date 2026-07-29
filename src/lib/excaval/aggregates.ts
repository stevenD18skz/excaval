import type { Expense, ExpenseCat, Invoice, Machine, MachineStatus, Payment } from "./types";
import { EXPENSE_CAT_META } from "./types";

export function sumInvoices(invoices: Invoice[]): number {
  return invoices.reduce((acc, i) => acc + i.amount, 0);
}

export function sumExpenses(expenses: Expense[]): number {
  return expenses.reduce((acc, e) => acc + e.amount, 0);
}

/** Suma de abonos ya registrados contra una factura puntual. */
export function invoicePaidAmount(invoiceId: string, payments: Payment[]): number {
  return payments
    .filter((p) => p.invoiceId === invoiceId)
    .reduce((acc, p) => acc + p.amount, 0);
}

/** Lo que falta por cobrar de una factura — 0 si ya está PAID. */
export function invoiceRemaining(invoice: Invoice, payments: Payment[]): number {
  if (invoice.status === "PAID") return 0;
  return invoice.amount - invoicePaidAmount(invoice.id, payments);
}

/** Por cobrar real: saldo pendiente de las facturas PENDING y PARTIAL (no el monto bruto). */
export function porCobrar(invoices: Invoice[], payments: Payment[]): number {
  return invoices
    .filter((i) => i.status !== "PAID")
    .reduce((acc, i) => acc + invoiceRemaining(i, payments), 0);
}

export function nomina(expenses: Expense[]): number {
  return expenses
    .filter((e) => e.cat === "SUELDO")
    .reduce((acc, e) => acc + e.amount, 0);
}

export function vencidas(invoices: Invoice[]): number {
  return invoices.filter((i) => i.status !== "PAID" && i.overdue).length;
}

/** Orden por fecha corta tipo '22 jul' — mismo criterio en todas las listas de movimientos. */
export function dayOf(dateStr: string): number {
  return parseInt(dateStr, 10) || 0;
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

export function computeAggregates(invoices: Invoice[], expenses: Expense[], payments: Payment[]) {
  const ingresos = sumInvoices(invoices);
  const egresos = sumExpenses(expenses);
  const neta = ingresos - egresos;
  const pendiente = porCobrar(invoices, payments);
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

export interface MachineFinancials {
  code: string;
  name: string;
  ingresos: number;
  egresos: number;
  neta: number;
  margen: number;
}

function financialsForCode(
  code: string,
  invoices: Invoice[],
  expenses: Expense[]
): Omit<MachineFinancials, "code" | "name"> {
  const ingresos = invoices
    .filter((i) => i.machineCode === code)
    .reduce((acc, i) => acc + i.amount, 0);
  const egresos = expenses
    .filter((e) => e.machine === code)
    .reduce((acc, e) => acc + e.amount, 0);
  const neta = ingresos - egresos;
  return {
    ingresos,
    egresos,
    neta,
    margen: ingresos > 0 ? Math.round((neta / ingresos) * 100) : 0,
  };
}

/** Cuánto ha generado y gastado cada máquina — atribución por Invoice.machineCode / Expense.machine. */
export function machineFinancials(
  machines: Machine[],
  invoices: Invoice[],
  expenses: Expense[]
): MachineFinancials[] {
  return machines.map((m) => ({
    code: m.code,
    name: m.name,
    ...financialsForCode(m.code, invoices, expenses),
  }));
}

/** Igual que machineFinancials pero para una sola máquina — usado en el tab Rendimiento. */
export function machineFinancialsFor(
  code: string,
  invoices: Invoice[],
  expenses: Expense[]
): Omit<MachineFinancials, "code" | "name"> {
  return financialsForCode(code, invoices, expenses);
}

export interface MachineMovement {
  kind: "income" | "expense";
  id: string;
  /** Código corto para la placa: 'FAC' en ingresos, código de categoría en salidas. */
  code: string;
  title: string;
  sub: string;
  amount: number;
  day: number;
  href: string;
}

/** Historial de movimientos (facturas + salidas) de una máquina puntual, más reciente primero. */
export function machineMovements(
  code: string,
  invoices: Invoice[],
  expenses: Expense[]
): MachineMovement[] {
  const income: MachineMovement[] = invoices
    .filter((i) => i.machineCode === code)
    .map((i) => ({
      kind: "income",
      id: i.id,
      code: "FAC",
      title: i.concept,
      sub: `Ingreso · ${i.date.replace(" 2026", "")}`,
      amount: i.amount,
      day: dayOf(i.date),
      href: `/cuentas?factura=${i.id}`,
    }));

  const expense: MachineMovement[] = expenses
    .filter((e) => e.machine === code)
    .map((e) => ({
      kind: "expense",
      id: e.id,
      code: EXPENSE_CAT_META[e.cat].code,
      title: e.desc,
      sub: `${EXPENSE_CAT_META[e.cat].label} · ${e.date}`,
      amount: e.amount,
      day: dayOf(e.date),
      href: `/salidas?cat=${e.cat}`,
    }));

  return [...income, ...expense].sort((a, b) => b.day - a.day);
}
