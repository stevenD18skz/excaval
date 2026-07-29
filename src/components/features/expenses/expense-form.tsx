"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { EXPENSE_CAT_META, type ExpenseCat } from "@/lib/excaval/types";
import type { NewExpenseInput } from "@/lib/excaval/store";
import { Plate } from "@/components/shared/plate";

const CATEGORY_ORDER: ExpenseCat[] = [
  "REPUESTO",
  "REPARACION",
  "GASOLINA",
  "PUNTO",
  "SUELDO",
];

function digitsToAmount(digits: string): number {
  return digits ? parseInt(digits, 10) : 0;
}

function formatDigits(digits: string): string {
  return digits ? digitsToAmount(digits).toLocaleString("es-CO") : "";
}

interface ExpenseFormBodyProps {
  machineCodes: string[];
  onSubmit: (input: NewExpenseInput) => void;
}

/**
 * Se monta con `key={open}` desde ExpenseFormOverlay: cada apertura es una
 * instancia nueva, así el formulario nace siempre en el paso 1 sin useEffect.
 */
function ExpenseFormBody({ machineCodes, onSubmit }: ExpenseFormBodyProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [cat, setCat] = useState<ExpenseCat | null>(null);
  const [amountDigits, setAmountDigits] = useState("");
  const [desc, setDesc] = useState("");
  const [machine, setMachine] = useState<string | null>(null);
  const [photo, setPhoto] = useState(false);

  const amount = digitsToAmount(amountDigits);
  const step2Valid = amount > 0 && desc.trim().length > 2;

  function handleSelectCategory(next: ExpenseCat) {
    setCat(next);
    setStep(2);
  }

  function handleSubmit() {
    if (!cat) return;
    onSubmit({ cat, desc: desc.trim(), amount, machine: machine ?? "—", photo });
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="border-b border-divider p-3.5">
        <span className="font-heading text-xs font-semibold tracking-[.1em] text-text-3 uppercase">
          Registrar salida · Paso {step} de 3
        </span>
        <div className="mt-2.5 flex gap-1">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={cn("h-[5px] flex-1", s <= step ? "bg-accent-500" : "bg-[rgba(20,20,20,.16)]")}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        {step === 1 ? (
          <div>
            <h2 className="font-heading text-[22px] leading-[1.15] font-semibold text-ink">
              ¿Qué tipo de salida es?
            </h2>
            <p className="mt-1 text-[12.5px] text-text-3">
              Toca una categoría. Un solo dato por pantalla.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2.5 lg:grid-cols-3">
              {CATEGORY_ORDER.map((c) => {
                const meta = EXPENSE_CAT_META[c];
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => handleSelectCategory(c)}
                    className="flex min-h-[84px] flex-col items-start justify-between border border-ink p-2.5"
                  >
                    <Plate variant="dark">{meta.code}</Plate>
                    <span className="font-heading text-sm font-semibold text-ink">
                      {meta.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        {step === 2 && cat ? (
          <div>
            <h2 className="font-heading text-[22px] leading-[1.15] font-semibold text-ink">
              ¿Cuánto y de qué?
            </h2>
            <p className="mt-1 text-[12.5px] text-text-3">
              Categoría: {EXPENSE_CAT_META[cat].label}
            </p>

            <div className="mt-4 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
              <div>
                <div className="flex min-h-[54px] items-center gap-1.5 border border-ink bg-surface px-3">
                  <span className="font-heading text-[22px] font-semibold text-accent-700">$</span>
                  <input
                    inputMode="numeric"
                    autoFocus
                    value={formatDigits(amountDigits)}
                    onChange={(e) =>
                      setAmountDigits(e.target.value.replace(/\D/g, ""))
                    }
                    className="tabular font-heading w-full bg-transparent text-right text-[26px] font-semibold text-ink outline-none"
                    placeholder="0"
                  />
                </div>
                <p className="mt-1.5 text-[11px] text-text-3">
                  Solo números. Se formatea solo mientras escribes.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Input
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Ej: cambio de filtros hidráulicos"
                  className="min-h-12 rounded-none border-divider-strong"
                />

                <div>
                  <span className="text-[11px] text-text-3">Máquina (opcional)</span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {machineCodes.map((code) => {
                      const active = machine === code;
                      return (
                        <button
                          key={code}
                          type="button"
                          onClick={() => setMachine(active ? null : code)}
                          className={cn(
                            "min-h-10 border px-2.5 font-heading text-xs font-semibold uppercase",
                            active
                              ? "border-ink bg-ink text-accent-500"
                              : "border-divider-strong bg-paper text-text-2"
                          )}
                        >
                          {code}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <p
              className={cn(
                "mt-3 text-center text-[11.5px]",
                step2Valid ? "text-text-3" : "text-status-maintenance"
              )}
            >
              {step2Valid
                ? "Un solo dato por pantalla."
                : "Escribe el monto y una descripción corta"}
            </p>
          </div>
        ) : null}

        {step === 3 && cat ? (
          <div>
            <h2 className="font-heading text-[22px] leading-[1.15] font-semibold text-ink">
              Foto del recibo y confirmación
            </h2>
            <p className="mt-1 text-[12.5px] text-text-3">
              Adjunta el papel ahora y no se pierde después.
            </p>

            <div className="mt-4 flex flex-col gap-3 lg:grid lg:grid-cols-2 lg:gap-4">
              <button
                type="button"
                onClick={() => setPhoto((p) => !p)}
                className={cn(
                  "flex min-h-[76px] items-center gap-3 border border-ink p-3",
                  photo ? "bg-accent-100" : "bg-paper"
                )}
              >
                <span className="doc-hatch flex h-[60px] w-[52px] shrink-0 items-center justify-center border border-ink">
                  <Camera className="h-6 w-6 text-ink" strokeWidth={1.6} />
                </span>
                <span className="font-heading text-sm font-semibold text-ink">
                  {photo ? "Recibo adjunto" : "Tomar foto del recibo"}
                </span>
              </button>

              <div className="border border-ink bg-surface p-3">
                <dl className="flex flex-col gap-2 text-[12.5px]">
                  <div className="flex items-center justify-between">
                    <dt className="text-text-3">Categoría</dt>
                    <dd className="font-heading font-semibold text-ink">
                      {EXPENSE_CAT_META[cat].label}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-text-3">Descripción</dt>
                    <dd className="max-w-[60%] truncate text-right font-heading font-semibold text-ink">
                      {desc}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-text-3">Máquina</dt>
                    <dd className="font-heading font-semibold text-ink">
                      {machine ?? "Sin asignar"}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between border-t border-dashed border-divider-dash pt-2">
                    <dt className="text-text-3">Monto</dt>
                    <dd className="tabular font-heading text-xl font-semibold text-ink">
                      {"$ " + amount.toLocaleString("es-CO")}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {step >= 2 ? (
        <div className="flex flex-col gap-2 border-t border-divider p-3.5 lg:flex-row lg:items-center">
          <div className="flex gap-2 lg:contents">
            <Button
              type="button"
              variant="outline"
              className="min-w-24"
              onClick={() => setStep((s) => (s === 3 ? 2 : 1))}
            >
              Atrás
            </Button>
            {step === 2 ? (
              <Button
                type="button"
                disabled={!step2Valid}
                className="min-h-[50px] flex-1 lg:order-3"
                onClick={() => step2Valid && setStep(3)}
              >
                Continuar
              </Button>
            ) : (
              <Button
                type="button"
                className="min-h-[50px] flex-1 lg:order-3 lg:min-w-[190px] lg:flex-none"
                onClick={handleSubmit}
              >
                Guardar salida
              </Button>
            )}
          </div>
          <p className="text-center text-[11.5px] text-text-3 lg:order-2 lg:flex-1">
            {step === 2
              ? "Un solo dato por pantalla."
              : "Revisa el resumen antes de guardar."}
          </p>
        </div>
      ) : null}
    </div>
  );
}

interface ExpenseFormOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  machineCodes: string[];
  onSubmit: (input: NewExpenseInput) => void;
}

/** Formulario guiado de 3 pasos para registrar una salida. Sheet en móvil, Dialog en escritorio. */
export function ExpenseFormOverlay({
  open,
  onOpenChange,
  machineCodes,
  onSubmit,
}: ExpenseFormOverlayProps) {
  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[94%] gap-0 rounded-none border-t-[3px] border-accent-500 bg-paper p-0 shadow-none lg:hidden"
        >
          <ExpenseFormBody key={String(open)} machineCodes={machineCodes} onSubmit={onSubmit} />
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hidden max-h-[88%] w-full max-w-[560px] gap-0 overflow-y-auto rounded-none border border-ink border-t-[3px] border-t-accent-500 bg-paper p-0 shadow-[0_24px_60px_rgba(20,20,20,.35)] ring-0 sm:max-w-[560px] lg:block">
          <ExpenseFormBody key={String(open)} machineCodes={machineCodes} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
}
