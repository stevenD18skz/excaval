import Link from "next/link";
import {
  ArrowDownToLine,
  ArrowRight,
  CheckCircle2,
  FileText,
  PlayCircle,
  Smartphone,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blueprint } from "@/components/excavla/blueprint";
import { Plate } from "@/components/excavla/plate";
import { HazardTape } from "@/components/excavla/hazard-tape";
import { SectionLabel } from "@/components/excavla/section-label";
import { MachineNavIcon } from "@/components/excavla/nav-items";

const MODULES = [
  {
    code: "INI",
    title: "Dashboard",
    icon: TrendingUp,
    body: "Ingresos, egresos y ganancia neta del mes de un vistazo, con el balance de los últimos 6 meses y a dónde se fue el dinero.",
  },
  {
    code: "FAC",
    title: "Libro de cuentas digital",
    icon: FileText,
    body: "Cada factura con su estado — Pagado, Por cobrar, Vencida — y seguimiento automático de lo pendiente.",
  },
  {
    code: "SAL",
    title: "Control de salidas",
    icon: ArrowDownToLine,
    body: "Repuestos, reparaciones, combustible, gastos de punto y sueldos de operarios, categorizados y con foto del recibo.",
  },
  {
    code: "MAQ",
    title: "Semáforo de la máquina",
    icon: MachineNavIcon,
    body: "Trabajando, Disponible o Mantenimiento — el estado de cada máquina, su ubicación y el proyecto asignado.",
  },
  {
    code: "CLI",
    title: "Gestión documental y CRM",
    icon: Users,
    body: "Archivo de papeles por transacción, directorio de clientes con historial, y buscador global.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header público */}
      <header className="bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="font-heading text-lg font-semibold tracking-[.14em] text-accent-500">
              EXCAVLA
            </span>
            <span className="hidden h-4 w-px bg-ink-line sm:block" />
            <span className="hidden font-heading text-xs font-semibold tracking-[.1em] text-text-4 uppercase sm:block">
              Gerencia · Rionegro
            </span>
          </div>
          <Button render={<Link href="/dashboard" />} nativeButton={false} className="min-h-10">
            Probar la simulación
          </Button>
        </div>
      </header>
      <HazardTape />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-divider px-4 py-14 lg:px-8 lg:py-20">
          <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
            <div className="flex-1">
              <span className="inline-flex items-center gap-1.5 border border-ink bg-accent-100 px-2.5 py-1 font-heading text-[10.5px] font-semibold tracking-[.1em] text-accent-ink uppercase">
                <PlayCircle className="h-3.5 w-3.5" strokeWidth={1.8} />
                Simulación interactiva · empresa ficticia
              </span>
              <h1 className="mt-3.5 max-w-xl font-heading text-[34px] leading-[1.05] font-semibold text-ink sm:text-[42px] lg:text-[50px]">
                Controla el dinero, los papeles y las máquinas de tu empresa desde un solo lugar.
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.5] text-text-2">
                EXCAVLA es la herramienta interna para empresas de maquinaria pesada —
                excavadoras, retroexcavadoras, volquetas, rodillos, cargadores, motoniveladoras.
                Un solo rol, sin permisos que confundir: gerencia consulta y registra todo desde
                el celular, parada en la obra.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  render={<Link href="/dashboard" />}
                  nativeButton={false}
                  className="min-h-12 gap-2 px-5 text-[15px]"
                >
                  Simular uso con una empresa
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </Button>
                <Button
                  render={<Link href="#modulos" />}
                  nativeButton={false}
                  variant="outline"
                  className="min-h-12 px-5 text-[15px]"
                >
                  Ver los módulos
                </Button>
              </div>
              <p className="mt-3.5 max-w-md text-[12px] leading-[1.45] text-text-3">
                No necesitas crear cuenta: es una simulación con los datos de Excavla Rionegro,
                una empresa ficticia. Cobrar facturas, cambiar el semáforo de una máquina o
                registrar una salida se guarda en tu navegador mientras dure la sesión, para que
                se sienta como el sistema real.
              </p>
            </div>

            <Blueprint tone="dark" className="w-full max-w-md self-start bg-ink p-4 pb-3.5 text-paper lg:max-w-sm">
              <div className="flex items-center gap-2">
                <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-500 uppercase">
                  Ganancia neta · Libre
                </span>
                <span className="h-px flex-1 bg-ink-line" />
              </div>
              <div className="tabular font-heading mt-1 text-[42px] leading-[1.02] font-semibold">
                $ 23.760.000
              </div>
              <div className="mt-2 flex items-center gap-2">
                <span className="bg-accent-500 px-[7px] py-[2px] font-heading text-xs font-semibold text-ink">
                  +8,4% vs junio
                </span>
                <span className="text-xs text-text-on-dark">margen 41% · vs junio</span>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-ink-line pt-3.5">
                <Plate variant="accent" className="h-8 justify-self-start px-2">
                  FAC
                </Plate>
                <Plate variant="dark" className="h-8 justify-self-start px-2">
                  SUE
                </Plate>
                <Plate variant="dark" className="h-8 justify-self-start px-2">
                  CMB
                </Plate>
              </div>
            </Blueprint>
          </div>
        </section>

        {/* Acción #1 */}
        <section className="px-4 py-10 lg:px-8">
          <div className="mx-auto flex max-w-6xl items-center gap-3 border border-ink border-l-[6px] border-l-accent-500 bg-accent-100 p-4">
            <CheckCircle2 className="h-6 w-6 shrink-0 text-ink" strokeWidth={1.8} />
            <p className="text-[13.5px] leading-[1.4] text-ink">
              <span className="font-heading font-semibold">La acción #1 del sistema</span> — la
              que se hace parado en la obra — es marcar una factura como cobrada. Todo el
              dashboard móvil está pensado para llegar a esa acción en 3 toques.
            </p>
          </div>
        </section>

        {/* Módulos */}
        <section id="modulos" className="px-4 py-10 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>Cinco módulos</SectionLabel>
            <h2 className="mt-3 max-w-2xl font-heading text-[26px] leading-[1.1] font-semibold text-ink lg:text-[30px]">
              Todo lo que gerencia necesita para operar, en un solo tablero.
            </h2>

            <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
              {MODULES.map((m) => (
                <div key={m.code} className="flex flex-col gap-3 border border-divider p-4">
                  <div className="flex items-center gap-2.5">
                    <Plate variant="dark" className="h-7 px-2">
                      {m.code}
                    </Plate>
                    <m.icon className="h-[18px] w-[18px] text-accent-700" strokeWidth={1.6} />
                  </div>
                  <h3 className="font-heading text-[17px] font-semibold text-ink">{m.title}</h3>
                  <p className="text-[13px] leading-[1.4] text-text-2">{m.body}</p>
                </div>
              ))}

              <div className="flex flex-col justify-center gap-3 border border-dashed border-[rgba(20,20,20,.3)] p-4">
                <Smartphone className="h-5 w-5 text-accent-700" strokeWidth={1.6} />
                <h3 className="font-heading text-[15px] font-semibold text-ink">
                  Mobile-first, de verdad
                </h3>
                <p className="text-[13px] leading-[1.4] text-text-3">
                  Pensado para el campo de obra. La vista de escritorio queda para la oficina.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="px-4 py-14 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-4 border border-ink bg-surface p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-heading text-[22px] font-semibold text-ink">
                Dinero, papeles y máquinas, siempre al día.
              </h2>
              <p className="mt-1 text-[13.5px] text-text-3">
                Probá la simulación con datos de una empresa ficticia — sin registro, sin
                compromiso.
              </p>
            </div>
            <Button
              render={<Link href="/dashboard" />}
              nativeButton={false}
              className="min-h-12 shrink-0 gap-2 px-5 text-[15px]"
            >
              Simular uso con una empresa
              <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-line bg-ink">
        <HazardTape />
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 sm:flex-row sm:items-center lg:px-8">
          <span className="font-heading text-sm font-semibold tracking-[.1em] text-accent-500">
            EXCAVLA
          </span>
          <span className="text-[11.5px] text-text-4">
            Sistema de gestión administrativa y operativa para maquinaria pesada.
          </span>
        </div>
      </footer>
    </div>
  );
}
