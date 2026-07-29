"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MobileHeader } from "@/components/layout/mobile-header";
import { DesktopTopbar } from "@/components/layout/desktop-topbar";
import { Segmented } from "@/components/shared/segmented";
import { StatCard } from "@/components/shared/stat-card";
import { Blueprint } from "@/components/shared/blueprint";
import { Money } from "@/components/shared/money";
import { InvoiceCard } from "@/components/features/invoices/invoice-card";
import { InvoiceRow } from "@/components/features/invoices/invoice-row";
import { InvoiceDetailOverlay } from "@/components/features/invoices/invoice-detail-overlay";
import { showActionToast } from "@/components/layout/action-toast";
import { useExcavalStore } from "@/lib/excaval/store";
import { invoicePaidAmount, porCobrar, sumInvoices, vencidas } from "@/lib/excaval/aggregates";

type Filter = "todas" | "pagadas" | "pendientes";

function buildHref(base: string, params: URLSearchParams) {
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

export function CuentasView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filter = ((searchParams.get("filter") as Filter) || "todas") as Filter;
  const facturaId = searchParams.get("factura");

  const invoices = useExcavalStore((s) => s.invoices);
  const clients = useExcavalStore((s) => s.clients);
  const payments = useExcavalStore((s) => s.payments);
  const markInvoicePaid = useExcavalStore((s) => s.markInvoicePaid);
  const undoInvoicePaid = useExcavalStore((s) => s.undoInvoicePaid);
  const addAbono = useExcavalStore((s) => s.addAbono);

  function clientName(clientId: string): string {
    return clients.find((c) => c.id === clientId)?.name ?? clientId;
  }

  function setFilter(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next === "todas") params.delete("filter");
    else params.set("filter", next);
    router.push(buildHref("/cuentas", params));
  }

  function invoiceHref(id: string): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("factura", id);
    return buildHref("/cuentas", params);
  }

  function closeDetail() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("factura");
    router.push(buildHref("/cuentas", params));
  }

  function handleMarkPaid(id: string) {
    markInvoicePaid(id);
    showActionToast(
      `Factura ${id} marcada como cobrada. Ingreso confirmado en el libro.`,
      () => undoInvoicePaid(id)
    );
    if (facturaId === id) closeDetail();
  }

  const counts = {
    todas: invoices.length,
    pagadas: invoices.filter((i) => i.status === "PAID").length,
    pendientes: invoices.filter((i) => i.status !== "PAID").length,
  };

  const filtered = invoices.filter((inv) => {
    if (filter === "pagadas") return inv.status === "PAID";
    if (filter === "pendientes") return inv.status !== "PAID";
    return true;
  });

  const facturado = sumInvoices(invoices);
  const pendienteTotal = porCobrar(invoices, payments);
  const cobrado = facturado - pendienteTotal;
  const vencidasCount = vencidas(invoices);

  function handleAddAbono(id: string, amount: number, note?: string) {
    addAbono(id, amount, note);
    showActionToast(`Abono registrado en ${id}. Saldo actualizado en el libro de cuentas.`);
  }

  const segmentedOptions = [
    { value: "todas", label: "Todas", count: counts.todas },
    { value: "pagadas", label: "Pagadas", count: counts.pagadas },
    { value: "pendientes", label: "Por cobrar", count: counts.pendientes },
  ];

  const selectedInvoice = facturaId
    ? invoices.find((i) => i.id === facturaId) ?? null
    : null;
  const selectedClient = selectedInvoice
    ? clients.find((c) => c.id === selectedInvoice.clientId) ?? null
    : null;

  return (
    <>
      {/* ---------- MÓVIL ---------- */}
      <div className="lg:hidden">
        <MobileHeader title="Libro de cuentas" meta={`${invoices.length} FACTURAS`} />

        <main className="flex flex-col gap-4 px-3.5 pt-4 pb-[110px]">
          <Segmented value={filter} onChange={setFilter} options={segmentedOptions} />

          <div className="grid grid-cols-2 gap-2.5">
            <StatCard
              label="Cobrado en julio"
              value={
                <span className="text-status-working-text">
                  <Money value={cobrado} />
                </span>
              }
            />
            <div className="border border-ink bg-accent-100 p-[11px_12px]">
              <div className="font-heading text-[10px] font-semibold tracking-[.14em] text-accent-ink uppercase">
                Por cobrar
              </div>
              <div className="tabular font-heading mt-1.5 text-2xl font-semibold text-ink">
                <Money value={pendienteTotal} />
              </div>
              <div className="mt-1 text-[11px] text-accent-ink">
                {counts.pendientes} facturas · {vencidasCount} vencida
                {vencidasCount === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5">
            {filtered.map((inv) => (
              <InvoiceCard
                key={inv.id}
                invoice={inv}
                clientName={clientName(inv.clientId)}
                href={invoiceHref(inv.id)}
                paidAmount={invoicePaidAmount(inv.id, payments)}
              />
            ))}
          </div>
        </main>
      </div>

      {/* ---------- ESCRITORIO ---------- */}
      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <DesktopTopbar title="Libro de cuentas digital · julio 2026" />

        <main className="flex-1 overflow-y-auto px-[22px] py-[18px] pb-[26px]">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3.5">
              <StatCard label="Facturado en julio" value={<Money value={facturado} />} />
              <StatCard
                label="Cobrado"
                labelClassName="text-status-working"
                value={
                  <span className="text-status-working-text">
                    <Money value={cobrado} />
                  </span>
                }
              />
              <Blueprint className="border border-ink bg-accent-100 p-3">
                <div className="font-heading text-[10px] font-semibold tracking-[.14em] text-accent-ink uppercase">
                  Por cobrar
                </div>
                <div className="tabular font-heading mt-1.5 text-[30px] font-semibold text-ink">
                  <Money value={pendienteTotal} />
                </div>
                <div className="mt-1 text-[11px] text-accent-ink">
                  {counts.pendientes} facturas · {vencidasCount} vencida
                  {vencidasCount === 1 ? "" : "s"}
                </div>
              </Blueprint>
            </div>

            <div className="flex items-center gap-3">
              <Segmented
                size="desktop"
                value={filter}
                onChange={setFilter}
                options={segmentedOptions}
                className="shrink-0"
              />
              <span className="h-px flex-1 bg-divider" />
              <span className="shrink-0 text-[12px] text-text-3">
                Seguimiento automatizado · toca una fila para ver el papel
              </span>
            </div>

            <div className="border border-divider">
              {filtered.map((inv) => (
                <InvoiceRow
                  key={inv.id}
                  invoice={inv}
                  clientName={clientName(inv.clientId)}
                  detailHref={invoiceHref(inv.id)}
                  onMarkPaid={handleMarkPaid}
                  paidAmount={invoicePaidAmount(inv.id, payments)}
                />
              ))}
            </div>
          </div>
        </main>
      </div>

      <InvoiceDetailOverlay
        invoice={selectedInvoice}
        client={selectedClient}
        payments={payments}
        open={!!selectedInvoice}
        onOpenChange={(open) => {
          if (!open) closeDetail();
        }}
        onMarkPaid={handleMarkPaid}
        onAddAbono={handleAddAbono}
      />
    </>
  );
}
