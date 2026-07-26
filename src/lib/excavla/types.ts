export type MachineStatus = "WORKING" | "AVAILABLE" | "MAINTENANCE";
export type InvoiceStatus = "PAID" | "PENDING";
export type ExpenseCat =
  | "REPUESTO"
  | "REPARACION"
  | "GASOLINA"
  | "PUNTO"
  | "SUELDO";

export interface Invoice {
  id: string; // 'FAC-0182'
  clientId: string;
  concept: string; // 'Alquiler excavadora EX-01 · 240 h · Vía Rionegro–La Ceja'
  amount: number; // COP, entero
  status: InvoiceStatus;
  date: string; // '12 jul 2026'
  due: string; // 'Vence 28 jul' | 'Pagada 22 jul' | 'Vencida 12 días'
  overdue: boolean; // solo aplica si status === 'PENDING'
  photo: boolean; // ¿tiene foto de factura adjunta?
}

export interface Expense {
  id: string;
  cat: ExpenseCat;
  desc: string;
  amount: number;
  date: string; // '22 jul'
  machine: string; // código de máquina o '—'
  photo: boolean;
}

export interface Machine {
  code: string; // 'EX-01'  ← placa, es el identificador visible
  name: string; // 'Excavadora CAT 320D'
  type: string; // 'Excavadora de orugas'
  status: MachineStatus;
  location: string; // 'Vía Rionegro–La Ceja · K12+400'
  client: string; // cliente/proyecto asignado, o 'Sin asignar'
  hours: string; // '14.820 h' (horómetro) o '186.400 km' para volquetas
  since: string; // 'desde 12 mar'
  updated: string; // 'Hoy 06:40 · operario J. Muñoz'
  photo: string; // URL o data URL de la foto de la máquina
}

export interface Client {
  id: string;
  name: string;
  contact: string;
  phone: string; // '314 552 8890'
  services: number;
}

export interface PayrollEntry {
  name: string;
  role: string; // 'Operario excavadora EX-01'
  amount: number;
  paid: boolean;
}

export const EXPENSE_CAT_META: Record<
  ExpenseCat,
  { code: string; label: string }
> = {
  REPUESTO: { code: "REP", label: "Repuestos" },
  REPARACION: { code: "REPÁ", label: "Reparaciones" },
  GASOLINA: { code: "CMB", label: "Combustible" },
  PUNTO: { code: "PTO", label: "Gastos de punto" },
  SUELDO: { code: "SUE", label: "Sueldos" },
};
