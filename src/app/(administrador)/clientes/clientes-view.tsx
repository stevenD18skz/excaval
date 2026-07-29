"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { MobileHeader } from "@/components/layout/mobile-header";
import { DesktopTopbar } from "@/components/layout/desktop-topbar";
import { ClientCard } from "@/components/features/clients/client-card";
import { ClientRow } from "@/components/features/clients/client-row";
import { ClientDetailContent } from "@/components/features/clients/client-detail-content";
import { Blueprint } from "@/components/shared/blueprint";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useExcavalStore } from "@/lib/excaval/store";
import type { Client, Invoice } from "@/lib/excaval/types";

function buildHref(base: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function matchesQuery(client: Client, query: string): boolean {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return (
    client.name.toLowerCase().includes(needle) ||
    client.contact.toLowerCase().includes(needle) ||
    client.phone.toLowerCase().includes(needle)
  );
}

function statsFor(clientId: string, invoices: Invoice[]) {
  const clientInvoices = invoices.filter((i) => i.clientId === clientId);
  const facturado = clientInvoices.reduce((acc, i) => acc + i.amount, 0);
  const porCobrar = clientInvoices
    .filter((i) => i.status === "PENDING")
    .reduce((acc, i) => acc + i.amount, 0);
  return { facturado, porCobrar, servicesCount: clientInvoices.length };
}

export function ClientesView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const selectedId = searchParams.get("cliente");

  const clients = useExcavalStore((s) => s.clients);
  const invoices = useExcavalStore((s) => s.invoices);

  function setParams(mutate: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(searchParams.toString());
    mutate(params);
    router.push(buildHref("/clientes", params));
  }

  function setQuery(value: string) {
    setParams((params) => {
      if (value) params.set("q", value);
      else params.delete("q");
    });
  }

  function clientHref(id: string): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("cliente", id);
    return buildHref("/clientes", params);
  }

  function closeDetail() {
    setParams((params) => params.delete("cliente"));
  }

  const filtered = clients.filter((c) => matchesQuery(c, q));

  const mobileSelected = selectedId ? clients.find((c) => c.id === selectedId) ?? null : null;
  const mobileSelectedInvoices = mobileSelected
    ? invoices.filter((i) => i.clientId === mobileSelected.id)
    : [];

  const deskSelectedId = selectedId ?? clients[0]?.id ?? null;
  const deskSelected = deskSelectedId
    ? clients.find((c) => c.id === deskSelectedId) ?? null
    : null;
  const deskSelectedInvoices = deskSelected
    ? invoices.filter((i) => i.clientId === deskSelected.id)
    : [];

  return (
    <>
      {/* ---------- MÓVIL ---------- */}
      <div className="lg:hidden">
        <MobileHeader title="Clientes" meta={`${clients.length} REGISTROS`} />

        <main className="flex flex-col gap-3.5 px-3.5 pt-4 pb-[110px]">
          <label className="flex min-h-11 items-center gap-2 border border-ink bg-surface px-3">
            <Search className="h-[17px] w-[17px] shrink-0 text-text-3" strokeWidth={1.6} />
            <input
              type="text"
              value={q}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar cliente o proyecto"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-text-3"
            />
          </label>

          <div className="flex flex-col gap-2.5">
            {filtered.map((c) => {
              const stats = statsFor(c.id, invoices);
              return (
                <ClientCard
                  key={c.id}
                  client={c}
                  servicesCount={stats.servicesCount}
                  facturado={stats.facturado}
                  porCobrar={stats.porCobrar}
                  href={clientHref(c.id)}
                />
              );
            })}
          </div>
        </main>

        <Sheet
          open={!!mobileSelected}
          onOpenChange={(open) => {
            if (!open) closeDetail();
          }}
        >
          <SheetContent
            side="bottom"
            className="max-h-[92%] gap-0 overflow-y-auto rounded-none border-t-[3px] border-accent-500 bg-paper p-4 shadow-none lg:hidden"
          >
            {mobileSelected ? (
              <ClientDetailContent
                client={mobileSelected}
                invoices={mobileSelectedInvoices}
                size="sm"
              />
            ) : null}
          </SheetContent>
        </Sheet>
      </div>

      {/* ---------- ESCRITORIO ---------- */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <DesktopTopbar title="Clientes y archivo CRM" />

        <main className="flex-1 overflow-y-auto px-[22px] py-[18px] pb-[26px]">
          <div className="grid grid-cols-[340px_1fr] items-start gap-[18px]">
            <div className="flex flex-col gap-3">
              <label className="flex min-h-[42px] items-center gap-2 border border-ink bg-surface px-3">
                <Search className="h-4 w-4 shrink-0 text-text-3" strokeWidth={1.6} />
                <input
                  type="text"
                  value={q}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Buscar cliente o proyecto"
                  className="w-full bg-transparent text-[13.5px] outline-none placeholder:text-text-3"
                />
              </label>

              <div className="flex flex-col gap-2">
                {filtered.map((c) => {
                  const stats = statsFor(c.id, invoices);
                  return (
                    <ClientRow
                      key={c.id}
                      client={c}
                      servicesCount={stats.servicesCount}
                      facturado={stats.facturado}
                      porCobrar={stats.porCobrar}
                      href={clientHref(c.id)}
                      active={c.id === deskSelectedId}
                    />
                  );
                })}
              </div>
            </div>

            {deskSelected ? (
              <Blueprint className="border border-divider p-[18px]">
                <ClientDetailContent
                  client={deskSelected}
                  invoices={deskSelectedInvoices}
                  size="lg"
                />
              </Blueprint>
            ) : null}
          </div>
        </main>
      </div>
    </>
  );
}
