"use client";

import { useState } from "react";
import { Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plate } from "@/components/shared/plate";
import type { NewMaintenanceInput } from "@/lib/excaval/store";
import type { Machine } from "@/lib/excaval/types";

const DAY_OPTIONS = [1, 2, 3, 5, 8, 15];

function digitsToAmount(digits: string): number {
  return digits ? parseInt(digits, 10) : 0;
}

function formatDigits(digits: string): string {
  return digits ? digitsToAmount(digits).toLocaleString("es-CO") : "";
}

function MaintenanceFormBody({
  machine,
  onSubmit,
}: {
  machine: Machine;
  onSubmit: (input: NewMaintenanceInput) => void;
}) {
  const [reason, setReason] = useState("");
  const [days, setDays] = useState(3);
  const [costDigits, setCostDigits] = useState("");
  const [hasInvoice, setHasInvoice] = useState(false);

  const cost = digitsToAmount(costDigits);
  const valid = reason.trim().length > 2 && days > 0;

  function handleSubmit() {
    if (!valid) return;
    onSubmit({
      machineCode: machine.code,
      reason: reason.trim(),
      estimatedDays: days,
      cost,
      hasInvoice,
    });
  }

  return (
    <div className="flex flex-col gap-0">
      <div className="flex items-center gap-2.5 border-b border-divider p-3.5">
        <Plate variant="dark" className="h-7 px-1.5">
          {machine.code}
        </Plate>
        <span className="font-heading text-xs font-semibold tracking-[.1em] text-text-3 uppercase">
          Enviar a mantenimiento
        </span>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto p-4">
        <div>
          <h2 className="font-heading text-[20px] leading-[1.15] font-semibold text-ink">
            ¿Qué le pasa a la máquina?
          </h2>
          <p className="mt-1 text-[12.5px] text-text-3">
            {machine.name} · registra el motivo y cuánto tiempo va a estar parada.
          </p>
        </div>

        <Input
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Ej: cambio de orugas, reparación de motor..."
          className="min-h-12 rounded-none border-divider-strong"
          autoFocus
        />

        <div>
          <span className="text-[11px] text-text-3">Días estimados de parada</span>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {DAY_OPTIONS.map((d) => {
              const active = d === days;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={cn(
                    "min-h-10 min-w-10 border font-heading text-sm font-semibold",
                    active
                      ? "border-ink bg-ink text-accent-500"
                      : "border-divider-strong bg-paper text-text-2"
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="text-[11px] text-text-3">Costo estimado (opcional)</span>
          <div className="mt-1.5 flex min-h-[52px] items-center gap-1.5 border border-ink bg-surface px-3">
            <span className="font-heading text-[20px] font-semibold text-accent-700">$</span>
            <input
              inputMode="numeric"
              value={formatDigits(costDigits)}
              onChange={(e) => setCostDigits(e.target.value.replace(/\D/g, ""))}
              className="tabular font-heading w-full bg-transparent text-right text-[24px] font-semibold text-ink outline-none"
              placeholder="0"
            />
          </div>
          <p className="mt-1.5 text-[11px] text-text-3">
            Si hay costo, se registra de una vez como salida de Reparaciones.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setHasInvoice((v) => !v)}
          className={cn(
            "flex min-h-[68px] items-center gap-3 border border-ink p-3",
            hasInvoice ? "bg-accent-100" : "bg-paper"
          )}
        >
          <span className="doc-hatch flex h-[52px] w-[46px] shrink-0 items-center justify-center border border-ink">
            <Camera className="h-5 w-5 text-ink" strokeWidth={1.6} />
          </span>
          <span className="font-heading text-sm font-semibold text-ink">
            {hasInvoice ? "Factura de mantenimiento adjunta" : "Tiene factura del mantenimiento"}
          </span>
        </button>
      </div>

      <div className="border-t border-divider p-3.5">
        <Button
          type="button"
          className="min-h-[50px] w-full"
          disabled={!valid}
          onClick={handleSubmit}
        >
          Confirmar mantenimiento
        </Button>
      </div>
    </div>
  );
}

interface MaintenanceFormOverlayProps {
  machine: Machine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: NewMaintenanceInput) => void;
}

/** Mini-form al enviar una máquina a mantenimiento: motivo, días y costo. Sheet en móvil, Dialog en escritorio. */
export function MaintenanceFormOverlay({
  machine,
  open,
  onOpenChange,
  onSubmit,
}: MaintenanceFormOverlayProps) {
  if (!machine) return null;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          className="max-h-[92%] gap-0 rounded-none border-t-[3px] border-accent-500 bg-paper p-0 shadow-none lg:hidden"
        >
          <MaintenanceFormBody key={machine.code} machine={machine} onSubmit={onSubmit} />
        </SheetContent>
      </Sheet>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="hidden max-h-[88%] w-full max-w-[520px] gap-0 overflow-y-auto rounded-none border border-ink border-t-[3px] border-t-accent-500 bg-paper p-0 shadow-[0_24px_60px_rgba(20,20,20,.35)] ring-0 sm:max-w-[520px] lg:block">
          <MaintenanceFormBody key={machine.code} machine={machine} onSubmit={onSubmit} />
        </DialogContent>
      </Dialog>
    </>
  );
}
