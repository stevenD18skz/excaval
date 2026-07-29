"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check } from "lucide-react";
import { MobileHeader } from "@/components/layout/mobile-header";
import { DesktopTopbar } from "@/components/layout/desktop-topbar";
import { Blueprint } from "@/components/shared/blueprint";
import { Plate } from "@/components/shared/plate";
import { Money } from "@/components/shared/money";
import { SectionLabel } from "@/components/shared/section-label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MachinePhoto } from "@/components/features/machines/machine-photo";
import { showActionToast } from "@/components/layout/action-toast";
import { useExcavalStore } from "@/lib/excaval/store";
import { formatMoney } from "@/lib/excaval/money";
import type { Machine, Quote } from "@/lib/excaval/types";

function buildHref(base: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function digitsToAmount(digits: string): number {
  return digits ? parseInt(digits, 10) : 0;
}

function formatDigits(digits: string): string {
  return digits ? digitsToAmount(digits).toLocaleString("es-CO") : "";
}

interface CalculatorBodyProps {
  machines: Machine[];
  machine: Machine | null;
  clientName: string;
  hoursDigits: string;
  rateDigits: string;
  hours: number;
  rate: number;
  total: number;
  valid: boolean;
  onSelectMachine: (code: string) => void;
  onChangeMachine: () => void;
  onClientNameChange: (v: string) => void;
  onHoursChange: (v: string) => void;
  onRateChange: (v: string) => void;
  onSave: () => void;
}

function CalculatorBody({
  machines,
  machine,
  clientName,
  hoursDigits,
  rateDigits,
  hours,
  rate,
  total,
  valid,
  onSelectMachine,
  onChangeMachine,
  onClientNameChange,
  onHoursChange,
  onRateChange,
  onSave,
}: CalculatorBodyProps) {
  if (!machine) {
    return (
      <div>
        <SectionLabel>1. Elige la máquina</SectionLabel>
        <div className="mt-3 grid grid-cols-2 gap-2.5 lg:grid-cols-3">
          {machines.map((m) => (
            <button
              key={m.code}
              type="button"
              onClick={() => onSelectMachine(m.code)}
              className="flex flex-col items-start gap-2 border border-ink p-3 text-left"
            >
              <Plate variant="dark">{m.code}</Plate>
              <span className="font-heading text-sm font-semibold text-ink">{m.name}</span>
              <span className="text-[11.5px] text-text-3">{m.type}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-2">
        <SectionLabel>2. Datos del servicio</SectionLabel>
        <button
          type="button"
          onClick={onChangeMachine}
          className="shrink-0 font-heading text-xs font-semibold tracking-[.06em] text-accent-700 uppercase hover:underline"
        >
          Cambiar máquina
        </button>
      </div>

      <Blueprint className="flex gap-3 border border-ink p-3">
        <MachinePhoto src={machine.photo} alt={machine.name} priority className="h-20 w-20" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <Plate variant="dark" className="h-6 px-1.5 text-[11px]">
              {machine.code}
            </Plate>
            <span className="text-[11px] text-text-3">{machine.type}</span>
          </div>
          <div className="mt-1 truncate font-heading text-[17px] font-semibold text-ink">
            {machine.name}
          </div>
          <p className="mt-1 line-clamp-2 text-[12px] text-text-3">{machine.publicDescription}</p>
        </div>
      </Blueprint>

      <div>
        <span className="text-[11px] text-text-3">Cliente (opcional)</span>
        <Input
          value={clientName}
          onChange={(e) => onClientNameChange(e.target.value)}
          placeholder="Ej: Constructora Andina S.A.S."
          className="mt-1.5 min-h-12 rounded-none border-divider-strong"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <span className="text-[11px] text-text-3">Horas de trabajo</span>
          <input
            inputMode="numeric"
            value={hoursDigits}
            onChange={(e) => onHoursChange(e.target.value.replace(/\D/g, ""))}
            placeholder="0"
            className="tabular font-heading mt-1.5 flex min-h-12 w-full items-center border border-ink bg-surface px-3 text-right text-[20px] font-semibold text-ink outline-none"
          />
        </div>
        <div>
          <span className="text-[11px] text-text-3">Precio / hora</span>
          <div className="mt-1.5 flex min-h-12 items-center gap-1 border border-ink bg-surface px-2.5">
            <span className="font-heading text-[16px] font-semibold text-accent-700">$</span>
            <input
              inputMode="numeric"
              value={formatDigits(rateDigits)}
              onChange={(e) => onRateChange(e.target.value.replace(/\D/g, ""))}
              placeholder="0"
              className="tabular font-heading w-full bg-transparent text-right text-[18px] font-semibold text-ink outline-none"
            />
          </div>
        </div>
      </div>

      <Blueprint tone="dark" className="bg-ink p-4 text-paper">
        <div className="flex items-center gap-2">
          <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-500 uppercase">
            Cotización estimada
          </span>
          <span className="h-px flex-1 bg-ink-line" />
        </div>
        <div className="tabular font-heading mt-1 text-[38px] font-semibold">
          <Money value={total} className="text-paper" />
        </div>
        <div className="mt-1 text-xs text-text-on-dark">
          {hours || 0} h × {formatMoney(rate)}/h
        </div>
      </Blueprint>

      <Button type="button" className="min-h-12 gap-2" disabled={!valid} onClick={onSave}>
        <Check className="h-4 w-4" strokeWidth={2.2} />
        Guardar cotización
      </Button>
    </div>
  );
}

function QuoteHistory({ quotes, machines }: { quotes: Quote[]; machines: Machine[] }) {
  function machineName(code: string): string {
    return machines.find((m) => m.code === code)?.name ?? code;
  }

  return (
    <div>
      <SectionLabel>Últimas cotizaciones</SectionLabel>
      <div className="mt-3 flex flex-col gap-2">
        {quotes.map((q) => (
          <div key={q.id} className="flex items-center gap-3 border border-divider p-2.5">
            <Plate variant="accent" className="h-8 w-[46px]">
              {q.machineCode}
            </Plate>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-heading text-[14px] font-semibold text-ink">
                {q.clientName}
              </span>
              <span className="block truncate text-[11px] text-text-3">
                {machineName(q.machineCode)} · {q.hours} h × {formatMoney(q.ratePerHour)} · {q.date}
              </span>
            </span>
            <span className="tabular font-heading shrink-0 text-[15px] font-semibold text-ink">
              {formatMoney(q.total)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PresupuestoView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCode = searchParams.get("maquina");

  const machines = useExcavalStore((s) => s.machines);
  const quotes = useExcavalStore((s) => s.quotes);
  const addQuote = useExcavalStore((s) => s.addQuote);

  const machine = selectedCode ? machines.find((m) => m.code === selectedCode) ?? null : null;

  const [clientName, setClientName] = useState("");
  const [hoursDigits, setHoursDigits] = useState("");
  const [rateDigits, setRateDigits] = useState("");

  function selectMachine(code: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("maquina", code);
    router.push(buildHref("/presupuesto", params));
    const next = machines.find((m) => m.code === code);
    setRateDigits(next ? String(next.suggestedRate) : "");
    setHoursDigits("");
    setClientName("");
  }

  function changeMachine() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("maquina");
    router.push(buildHref("/presupuesto", params));
  }

  const hours = digitsToAmount(hoursDigits);
  const rate = digitsToAmount(rateDigits);
  const total = hours * rate;
  const valid = !!machine && hours > 0 && rate > 0;

  function handleSave() {
    if (!machine || !valid) return;
    addQuote({
      machineCode: machine.code,
      clientName: clientName.trim() || "Cliente por definir",
      hours,
      ratePerHour: rate,
    });
    showActionToast(`Cotización guardada · ${machine.code} · ${formatMoney(total)}`);
  }

  const recentQuotes = quotes.slice(0, 5);

  const calculator = (
    <CalculatorBody
      machines={machines}
      machine={machine}
      clientName={clientName}
      hoursDigits={hoursDigits}
      rateDigits={rateDigits}
      hours={hours}
      rate={rate}
      total={total}
      valid={valid}
      onSelectMachine={selectMachine}
      onChangeMachine={changeMachine}
      onClientNameChange={setClientName}
      onHoursChange={setHoursDigits}
      onRateChange={setRateDigits}
      onSave={handleSave}
    />
  );

  return (
    <>
      <div className="lg:hidden">
        <MobileHeader title="Simulador de presupuesto" meta="COTIZADOR" />
        <main className="flex flex-col gap-4 px-3.5 pt-4 pb-[110px]">
          {calculator}
          {recentQuotes.length > 0 ? (
            <QuoteHistory quotes={recentQuotes} machines={machines} />
          ) : null}
        </main>
      </div>

      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <DesktopTopbar title="Simulador de presupuesto" />
        <main className="flex-1 overflow-y-auto px-[22px] py-[18px] pb-[26px]">
          <div className="mx-auto flex max-w-3xl flex-col gap-4">
            {calculator}
            {recentQuotes.length > 0 ? (
              <QuoteHistory quotes={recentQuotes} machines={machines} />
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
