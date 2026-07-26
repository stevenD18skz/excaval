"use client";

import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileHeader } from "@/components/excavla/mobile-header";
import { DesktopTopbar } from "@/components/excavla/desktop-topbar";
import { Segmented } from "@/components/excavla/segmented";
import { Blueprint } from "@/components/excavla/blueprint";
import { Money } from "@/components/excavla/money";
import { ExpenseCard } from "@/components/excavla/expense-card";
import { PayrollRow } from "@/components/excavla/payroll-row";
import { ExpenseFormOverlay } from "@/components/excavla/expense-form";
import { showActionToast } from "@/components/excavla/action-toast";
import { Button } from "@/components/ui/button";
import { useExcavlaStore, type NewExpenseInput } from "@/lib/excavla/store";
import { payroll } from "@/lib/excavla/seed-data";
import { nomina, sumExpenses } from "@/lib/excavla/aggregates";
import { formatMoney } from "@/lib/excavla/money";
import { EXPENSE_CAT_META, type ExpenseCat } from "@/lib/excavla/types";
import { cn } from "@/lib/utils";

type SalidasTab = "gastos" | "sueldos";
type CatFilter = "todas" | ExpenseCat;

const CATEGORY_CHIPS: ExpenseCat[] = ["REPUESTO", "REPARACION", "GASOLINA", "PUNTO"];

function buildHref(base: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function SalidasView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const tab = ((searchParams.get("salidas") as SalidasTab) || "gastos") as SalidasTab;
  const catFilter = ((searchParams.get("cat") as CatFilter) || "todas") as CatFilter;
  const formOpen = searchParams.get("sheet") === "form";

  const expenses = useExcavlaStore((s) => s.expenses);
  const machines = useExcavlaStore((s) => s.machines);
  const addExpense = useExcavlaStore((s) => s.addExpense);

  function setParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildHref("/salidas", params));
  }

  function setTab(next: string) {
    setParams((params) => {
      if (next === "gastos") params.delete("salidas");
      else params.set("salidas", next);
      params.delete("cat");
    });
  }

  function setCat(next: string) {
    setParams((params) => {
      if (next === "todas") params.delete("cat");
      else params.set("cat", next);
    });
  }

  function openForm() {
    setParams((params) => params.set("sheet", "form"));
  }

  function closeForm() {
    setParams((params) => params.delete("sheet"));
  }

  function handleSaveExpense(input: NewExpenseInput) {
    addExpense(input);
    setParams((params) => {
      params.delete("sheet");
      if (input.cat === "SUELDO") params.set("salidas", "sueldos");
      else params.delete("salidas");
      params.delete("cat");
    });
    showActionToast(
      `Salida registrada · ${EXPENSE_CAT_META[input.cat].label} ${formatMoney(
        input.amount
      )}. Egresos del mes actualizados.`
    );
  }

  const egresosTotal = sumExpenses(expenses);
  const nominaTotal = nomina(expenses);
  const gastosOpTotal = egresosTotal - nominaTotal;

  const gastoExpenses = expenses.filter((e) => e.cat !== "SUELDO");
  const filteredExpenses =
    catFilter === "todas" ? gastoExpenses : gastoExpenses.filter((e) => e.cat === catFilter);

  const quincenas = expenses.filter((e) => e.cat === "SUELDO").length;
  const machineCodes = machines.map((m) => m.code);

  const tabOptions = [
    { value: "gastos", label: "Gastos" },
    { value: "sueldos", label: "Sueldos" },
  ];

  const chipOptions = [
    { value: "todas", label: "Todas", count: gastoExpenses.length },
    ...CATEGORY_CHIPS.map((cat) => ({
      value: cat,
      label: EXPENSE_CAT_META[cat].label,
      count: gastoExpenses.filter((e) => e.cat === cat).length,
    })),
  ];

  return (
    <>
      {/* ---------- MÓVIL ---------- */}
      <div className="lg:hidden">
        <MobileHeader title="Control de salidas" meta="JULIO 2026" />

        <main className="flex flex-col gap-4 px-3.5 pt-4 pb-[130px]">
          <Segmented value={tab} onChange={setTab} options={tabOptions} tone="accent" />

          {tab === "gastos" ? (
            <>
              <div className="-mx-3.5 flex gap-1.5 overflow-x-auto px-3.5">
                {chipOptions.map((chip) => {
                  const active = chip.value === catFilter;
                  return (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => setCat(chip.value)}
                      className={cn(
                        "min-h-9 shrink-0 border px-3 font-heading text-xs font-semibold uppercase",
                        active
                          ? "border-ink bg-ink text-paper"
                          : "border-divider-strong bg-paper text-text-2"
                      )}
                    >
                      {chip.label} {chip.count}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2.5">
                {filteredExpenses.map((exp) => (
                  <ExpenseCard key={exp.id} expense={exp} />
                ))}
              </div>
            </>
          ) : (
            <>
              <Blueprint tone="dark" className="bg-ink p-4 text-paper">
                <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-500 uppercase">
                  Nómina de julio · Pagada
                </span>
                <div className="tabular font-heading mt-1 text-[31px] font-semibold">
                  <Money value={nominaTotal} className="text-paper" />
                </div>
                <div className="mt-1 text-xs text-text-on-dark">
                  {payroll.length} operarios · {quincenas} quincena{quincenas === 1 ? "" : "s"} asentada
                  {quincenas === 1 ? "" : "s"}
                </div>
              </Blueprint>

              <div className="flex flex-col gap-2.5">
                {payroll.map((entry) => (
                  <PayrollRow key={entry.name} entry={entry} />
                ))}
              </div>
            </>
          )}
        </main>

        <div className="fixed inset-x-0 bottom-[78px] z-20 border-t border-divider bg-paper p-[10px_14px]">
          <Button type="button" className="min-h-12 w-full gap-2" onClick={openForm}>
            <Plus className="h-4 w-4" strokeWidth={1.8} />
            Registrar salida
          </Button>
        </div>
      </div>

      {/* ---------- ESCRITORIO ---------- */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <DesktopTopbar title="Control de salidas · julio 2026" />

        <main className="flex-1 overflow-y-auto px-[22px] py-[18px] pb-[26px]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <Segmented
                value={tab}
                onChange={setTab}
                options={tabOptions}
                tone="accent"
                size="desktop"
                className="shrink-0"
              />
              <span className="h-px flex-1 bg-divider" />
              <Button type="button" className="min-h-[42px] gap-2" onClick={openForm}>
                <Plus className="h-4 w-4" strokeWidth={1.8} />
                Registrar salida
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-3.5">
              <Blueprint tone="dark" className="bg-ink p-4 text-paper">
                <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-500 uppercase">
                  Total salidas del mes
                </span>
                <div className="tabular font-heading mt-1 text-[32px] font-semibold">
                  <Money value={egresosTotal} className="text-paper" />
                </div>
              </Blueprint>
              <div className="border border-divider p-3">
                <span className="font-heading text-[10px] font-semibold tracking-[.14em] text-text-3 uppercase">
                  Nómina de operarios
                </span>
                <div className="tabular font-heading mt-1.5 text-[30px] font-semibold text-ink">
                  <Money value={nominaTotal} />
                </div>
              </div>
              <div className="border border-divider p-3">
                <span className="font-heading text-[10px] font-semibold tracking-[.14em] text-text-3 uppercase">
                  Gastos operativos
                </span>
                <div className="tabular font-heading mt-1.5 text-[30px] font-semibold text-ink">
                  <Money value={gastosOpTotal} />
                </div>
                <div className="mt-1 text-[11px] text-text-3">
                  {gastoExpenses.length} gastos · repuestos, combustible, punto
                </div>
              </div>
            </div>

            {tab === "gastos" ? (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {chipOptions.map((chip) => {
                    const active = chip.value === catFilter;
                    return (
                      <button
                        key={chip.value}
                        type="button"
                        onClick={() => setCat(chip.value)}
                        className={cn(
                          "min-h-[38px] border px-3.5 font-heading text-xs font-semibold uppercase",
                          active
                            ? "border-ink bg-ink text-paper"
                            : "border-divider-strong bg-paper text-text-2"
                        )}
                      >
                        {chip.label} {chip.count}
                      </button>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {filteredExpenses.map((exp) => (
                    <ExpenseCard key={exp.id} expense={exp} size="lg" />
                  ))}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {payroll.map((entry) => (
                  <PayrollRow key={entry.name} entry={entry} size="lg" />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <ExpenseFormOverlay
        open={formOpen}
        onOpenChange={(open) => {
          if (!open) closeForm();
        }}
        machineCodes={machineCodes}
        onSubmit={handleSaveExpense}
      />
    </>
  );
}
