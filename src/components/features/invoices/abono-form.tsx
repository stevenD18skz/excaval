"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/excaval/money";

function digitsToAmount(digits: string): number {
  return digits ? parseInt(digits, 10) : 0;
}

function formatDigits(digits: string): string {
  return digits ? digitsToAmount(digits).toLocaleString("es-CO") : "";
}

interface AbonoFormProps {
  /** Saldo pendiente de la factura — tope del abono. */
  max: number;
  onSubmit: (amount: number, note?: string) => void;
  onCancel: () => void;
}

/** Form corto de un solo paso para registrar un abono contra el saldo pendiente. */
export function AbonoForm({ max, onSubmit, onCancel }: AbonoFormProps) {
  const [digits, setDigits] = useState("");
  const [note, setNote] = useState("");

  const amount = digitsToAmount(digits);
  const valid = amount > 0 && amount <= max;

  return (
    <div className="flex flex-col gap-3 border border-ink bg-surface p-3">
      <span className="font-heading text-[11px] font-semibold tracking-[.1em] text-text-3 uppercase">
        Registrar abono
      </span>

      <div>
        <div className="flex min-h-[50px] items-center gap-1.5 border border-ink bg-paper px-3">
          <span className="font-heading text-[20px] font-semibold text-accent-700">$</span>
          <input
            inputMode="numeric"
            autoFocus
            value={formatDigits(digits)}
            onChange={(e) => setDigits(e.target.value.replace(/\D/g, ""))}
            className="tabular font-heading w-full bg-transparent text-right text-[22px] font-semibold text-ink outline-none"
            placeholder="0"
          />
        </div>
        <p
          className={cn(
            "mt-1.5 text-[11px]",
            amount > max ? "text-status-maintenance" : "text-text-3"
          )}
        >
          {amount > max
            ? `El saldo pendiente es ${formatMoney(max)} — no puede abonar más que eso.`
            : `Saldo pendiente: ${formatMoney(max)}`}
        </p>
      </div>

      <Input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Nota (opcional) — ej: anticipo a 30 días"
        className="min-h-11 rounded-none border-divider-strong"
      />

      <div className="flex gap-2">
        <Button type="button" variant="outline" className="min-h-11 flex-1" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="button"
          className="min-h-11 flex-1"
          disabled={!valid}
          onClick={() => onSubmit(amount, note.trim() || undefined)}
        >
          Guardar abono
        </Button>
      </div>
    </div>
  );
}
