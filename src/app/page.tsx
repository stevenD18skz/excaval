import { SupabaseStatus } from "@/components/supabase-status";

const modules = [
  {
    title: "Dashboard financiero",
    description:
      "Resumen mensual de ingresos, egresos y ganancia neta, con visualización gráfica de balances para decidir rápido.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M4 19V10M12 19V5M20 19v-7"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    title: "Libro de Cuentas Digital",
    description:
      'Registro de ingresos con estado "Pagado" o "Por Cobrar" y seguimiento automático de facturas pendientes.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M5 4.5C5 3.67 5.67 3 6.5 3H17a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6.5A1.5 1.5 0 0 1 5 19.5v-15Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path
          d="M9 8h6M9 12h6M9 16h3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    title: "Control de Salidas y Sueldos",
    description:
      "Gastos categorizados (repuestos, reparaciones, gasolina, punto) y pagos a operarios, en modo transaccional para evitar descuadres.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M3 10h18"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="7" cy="14.5" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Semáforo de la Máquina",
    description:
      "Estado del activo en tiempo real (Trabajando, Disponible, Mantenimiento) con ubicación y cliente o proyecto asignado.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <rect
          x="8"
          y="2"
          width="8"
          height="20"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle cx="12" cy="7" r="1.4" fill="currentColor" />
        <circle cx="12" cy="12" r="1.4" fill="currentColor" />
        <circle cx="12" cy="17" r="1.4" fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Gestión Documental y CRM",
    description:
      "Archivo de papeles: fotos de facturas y recibos asociadas a cada transacción, más un directorio de clientes con buscador global.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6">
        <path
          d="M3 7.5A1.5 1.5 0 0 1 4.5 6H9l2 2h8.5A1.5 1.5 0 0 1 21 9.5v9A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-11Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

const pillars = [
  {
    title: "Cero curva de aprendizaje",
    description:
      "Formularios guiados paso a paso y tarjetas interactivas en lugar de tablas densas: cualquier directivo lo usa desde el primer día.",
  },
  {
    title: "Mobile-first, de verdad",
    description:
      "Pensado para consultarse desde el campo de obra: responsividad absoluta en cualquier pantalla, sin perder funciones.",
  },
  {
    title: "Datos íntegros y validados",
    description:
      "Validación en cliente y servidor, transacciones seguras y PostgreSQL con integridad referencial estricta para tus números.",
  },
];

const stack = [
  "Next.js",
  "Tailwind CSS",
  "Supabase Postgres",
  "Supabase Storage",
  "Supabase Auth",
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-white font-sans text-brand-black">
      <SupabaseStatus />
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-brand-yellow" />
            <span className="text-lg font-bold tracking-tight">EXCAVLA</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm font-medium text-brand-gray sm:flex">
            <a href="#modulos" className="hover:text-brand-black">
              Módulos
            </a>
            <a href="#por-que" className="hover:text-brand-black">
              Por qué Excavla
            </a>
            <a href="#stack" className="hover:text-brand-black">
              Tecnología
            </a>
          </nav>
          <a
            href="#"
            className="rounded-md bg-brand-black px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-black/80"
          >
            Iniciar sesión
          </a>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-black text-white">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-1/3 [background:repeating-linear-gradient(135deg,var(--brand-yellow)_0,var(--brand-yellow)_18px,transparent_18px,transparent_36px)] opacity-90 lg:block" />
          <div className="mx-auto grid max-w-6xl gap-12 px-6 py-24 lg:grid-cols-2 lg:items-center lg:py-32">
            <div>
              <span className="inline-flex items-center rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold uppercase tracking-wide text-brand-black">
                Gestión administrativa y operativa
              </span>
              <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Controla el dinero, los papeles y las máquinas de tu empresa
                desde un solo lugar.
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
                Excavla centraliza el flujo de caja, la gestión documental y
                el estado de tu maquinaria pesada en una plataforma de
                extrema simplicidad, pensada para que la gerencia decida sin
                perder tiempo.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <a
                  href="#modulos"
                  className="rounded-md bg-brand-yellow px-6 py-3 text-center text-sm font-bold text-brand-black transition-colors hover:bg-brand-yellow-dark"
                >
                  Ver los módulos
                </a>
                <a
                  href="#por-que"
                  className="rounded-md border border-white/20 px-6 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-white/10"
                >
                  Cómo funciona
                </a>
              </div>
            </div>

            {/* Dashboard mock card */}
            <div className="relative rounded-xl border border-white/10 bg-white p-6 text-brand-black shadow-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray">
                Resumen del mes
              </p>
              <div className="mt-4 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-brand-gray-light p-3">
                  <p className="text-xs text-brand-gray">Ingresos</p>
                  <p className="mt-1 text-lg font-bold">$48.2M</p>
                </div>
                <div className="rounded-lg bg-brand-gray-light p-3">
                  <p className="text-xs text-brand-gray">Egresos</p>
                  <p className="mt-1 text-lg font-bold">$31.4M</p>
                </div>
                <div className="rounded-lg bg-brand-yellow p-3">
                  <p className="text-xs font-medium text-brand-black/70">
                    Ganancia
                  </p>
                  <p className="mt-1 text-lg font-bold">$16.8M</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between rounded-lg border border-black/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">Excavadora CAT-320</p>
                    <p className="text-xs text-brand-gray">
                      Proyecto Vía Norte
                    </p>
                  </div>
                  <span className="rounded-full bg-brand-yellow/20 px-3 py-1 text-xs font-bold text-brand-yellow-dark">
                    Trabajando
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-black/5 px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold">
                      Factura #0234 · Constructora Rivas
                    </p>
                    <p className="text-xs text-brand-gray">Vence en 5 días</p>
                  </div>
                  <span className="rounded-full bg-brand-black/5 px-3 py-1 text-xs font-bold text-brand-black">
                    Por cobrar
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-b border-black/5 bg-brand-gray-light">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 text-center sm:grid-cols-4">
            {[
              ["1", "tipo de usuario, sin roles que confundan"],
              ["100%", "responsive, mobile-first"],
              ["Transaccional", "sin descuadres financieros"],
              ["Postgres", "con integridad referencial estricta"],
            ].map(([stat, label]) => (
              <div key={stat}>
                <p className="text-xl font-bold text-brand-black">{stat}</p>
                <p className="mt-1 text-xs text-brand-gray">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Modules / Features */}
        <section id="modulos" className="mx-auto max-w-6xl px-6 py-24">
          <div className="max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-wide text-brand-yellow-dark">
              Módulos
            </span>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Todo lo que Gerencia necesita para operar, en un solo tablero.
            </h2>
            <p className="mt-4 text-lg text-brand-gray">
              Cada módulo responde a una necesidad concreta del negocio: qué
              entra, qué sale, dónde está cada máquina y dónde quedó cada
              papel.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((m) => (
              <div
                key={m.title}
                className="group rounded-xl border border-black/5 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand-black text-brand-yellow transition-colors group-hover:bg-brand-yellow group-hover:text-brand-black">
                  {m.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold">{m.title}</h3>
                <p className="mt-2 text-sm leading-6 text-brand-gray">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Excavla */}
        <section id="por-que" className="bg-brand-black py-24 text-white">
          <div className="mx-auto max-w-6xl px-6">
            <div className="max-w-2xl">
              <span className="text-sm font-bold uppercase tracking-wide text-brand-yellow">
                Por qué Excavla
              </span>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Simplicidad de extremo a extremo, no otro sistema complejo.
              </h2>
            </div>
            <div className="mt-14 grid gap-8 sm:grid-cols-3">
              {pillars.map((p, i) => (
                <div key={p.title} className="border-t-2 border-brand-yellow pt-6">
                  <span className="text-sm font-bold text-brand-yellow">
                    0{i + 1}
                  </span>
                  <h3 className="mt-3 text-xl font-bold">{p.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {p.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stack */}
        <section id="stack" className="mx-auto max-w-6xl px-6 py-20">
          <p className="text-center text-sm font-bold uppercase tracking-wide text-brand-gray">
            Construido con tecnología moderna
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {stack.map((s) => (
              <span
                key={s}
                className="rounded-full border border-black/10 bg-brand-gray-light px-4 py-2 text-sm font-semibold text-brand-black"
              >
                {s}
              </span>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-brand-yellow px-8 py-14 text-center">
            <h2 className="max-w-xl text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">
              Empieza a llevar el control de tu operación hoy.
            </h2>
            <p className="max-w-lg text-brand-black/70">
              Dinero, papeles y máquinas, siempre visibles, siempre al día.
            </p>
            <a
              href="#"
              className="rounded-md bg-brand-black px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-black/80"
            >
              Solicitar acceso
            </a>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-brand-gray sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-sm bg-brand-yellow" />
            <span className="font-bold text-brand-black">EXCAVLA</span>
          </div>
          <p>Sistema de Gestión Administrativa y Operativa para maquinaria pesada.</p>
        </div>
      </footer>
    </div>
  );
}
