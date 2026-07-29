import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Blueprint } from "@/components/shared/blueprint";
import { Plate } from "@/components/shared/plate";
import { HazardTape } from "@/components/layout/hazard-tape";
import { SectionLabel } from "@/components/shared/section-label";
import { machines } from "@/lib/excaval/seed-data";
import {
  COMPANY_PROFILE,
  GALLERY,
  MISSION,
  SERVICES,
  VALUES,
  VISION,
} from "@/lib/excaval/company-content";

const NAV_LINKS = [
  { href: "#servicios", label: "Servicios" },
  { href: "#maquinas", label: "Máquinas" },
  { href: "#trabajos", label: "Trabajos" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

function whatsappHref(text: string): string {
  return `https://wa.me/${COMPANY_PROFILE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export default function PublicoPage() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Header público */}
      <header className="sticky top-0 z-30 bg-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 lg:px-8">
          <div className="flex items-center gap-2.5">
            <span className="font-heading text-lg font-semibold tracking-[.14em] text-accent-500">
              EXCAVAL
            </span>
            <span className="hidden h-4 w-px bg-ink-line sm:block" />
            <span className="hidden font-heading text-xs font-semibold tracking-[.1em] text-text-4 uppercase sm:block">
              Rionegro · Antioquia
            </span>
          </div>
          <nav className="hidden items-center gap-5 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-heading text-xs font-semibold tracking-[.08em] text-text-on-dark uppercase hover:text-accent-500"
              >
                {link.label}
              </a>
            ))}
          </nav>
          <Button
            render={<a href={`tel:${COMPANY_PROFILE.phone.replace(/\s+/g, "")}`} />}
            nativeButton={false}
            className="min-h-10 gap-1.5"
          >
            <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
            Llamar
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
                Alquiler de maquinaria pesada
              </span>
              <h1 className="mt-3.5 max-w-xl font-heading text-[34px] leading-[1.05] font-semibold text-ink sm:text-[42px] lg:text-[50px]">
                {COMPANY_PROFILE.tagline}
              </h1>
              <p className="mt-4 max-w-lg text-[15px] leading-[1.5] text-text-2">
                {MISSION}
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <Button
                  render={
                    <a
                      href={whatsappHref(
                        "Hola, quiero cotizar el alquiler de una máquina para un proyecto."
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                    />
                  }
                  nativeButton={false}
                  className="min-h-12 gap-2 px-5 text-[15px]"
                >
                  Solicitar cotización
                  <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
                </Button>
                <Button
                  render={<a href="#maquinas" />}
                  nativeButton={false}
                  variant="outline"
                  className="min-h-12 px-5 text-[15px]"
                >
                  Ver las máquinas
                </Button>
              </div>
            </div>

            <Blueprint className="w-full max-w-md self-start overflow-hidden border border-ink lg:max-w-sm">
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src="/Maquinas/maquina_1.jpeg"
                  alt="Máquina de la flota Excaval en operación"
                  fill
                  priority
                  sizes="(max-width: 1024px) 90vw, 420px"
                  className="object-cover"
                />
              </div>
            </Blueprint>
          </div>
        </section>

        {/* Servicios */}
        <section id="servicios" className="px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>Qué hacemos</SectionLabel>
            <h2 className="mt-3 max-w-2xl font-heading text-[26px] leading-[1.1] font-semibold text-ink lg:text-[30px]">
              Maquinaria lista para tu obra, con o sin operario.
            </h2>

            <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {SERVICES.map((s) => (
                <div key={s.code} className="flex flex-col gap-3 border border-divider p-4">
                  <Plate variant="dark" className="h-7 w-fit px-2">
                    {s.code}
                  </Plate>
                  <h3 className="font-heading text-[16px] font-semibold text-ink">{s.title}</h3>
                  <p className="text-[13px] leading-[1.4] text-text-2">{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catálogo de máquinas */}
        <section id="maquinas" className="border-t border-divider px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>Nuestra flota</SectionLabel>
            <h2 className="mt-3 max-w-2xl font-heading text-[26px] leading-[1.1] font-semibold text-ink lg:text-[30px]">
              Excavadoras, retroexcavadoras, volquetas, rodillos, cargadores y motoniveladoras.
            </h2>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {machines.map((m) => (
                <Blueprint key={m.code} className="flex flex-col border border-ink">
                  <div className="relative aspect-[4/3] w-full border-b border-ink">
                    <Image
                      src={m.photo}
                      alt={m.name}
                      fill
                      sizes="(max-width: 1024px) 90vw, 33vw"
                      className="object-cover"
                    />
                    {m.status === "AVAILABLE" ? (
                      <span className="absolute top-2 left-2 border border-ink bg-accent-500 px-2 py-[3px] font-heading text-[10px] font-semibold tracking-[.06em] text-ink uppercase">
                        Disponible ahora
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col gap-2.5 p-3.5">
                    <div className="flex items-center gap-2">
                      <Plate variant="dark" className="h-6 px-1.5 text-[11px]">
                        {m.code}
                      </Plate>
                      <span className="text-[11.5px] text-text-3">{m.type}</span>
                    </div>
                    <h3 className="font-heading text-[18px] font-semibold text-ink">{m.name}</h3>
                    <p className="text-[12.5px] leading-[1.4] text-text-2">
                      {m.publicDescription}
                    </p>
                    <dl className="mt-1 flex flex-col border-t border-dashed border-divider-dash pt-2.5">
                      {m.specs.slice(0, 3).map((spec) => (
                        <div
                          key={spec.label}
                          className="flex items-center justify-between py-1 text-[11.5px]"
                        >
                          <dt className="text-text-3">{spec.label}</dt>
                          <dd className="font-heading font-semibold text-ink">{spec.value}</dd>
                        </div>
                      ))}
                    </dl>
                    <a
                      href={whatsappHref(
                        `Hola, quiero cotizar el alquiler de la ${m.name} (${m.code}).`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 flex items-center justify-center gap-1.5 border border-ink bg-paper py-2.5 font-heading text-xs font-semibold tracking-[.06em] text-ink uppercase hover:bg-surface"
                    >
                      Cotizar esta máquina
                      <ArrowRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </a>
                  </div>
                </Blueprint>
              ))}
            </div>
          </div>
        </section>

        {/* Galería de trabajos */}
        <section id="trabajos" className="border-t border-divider px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>Trabajos realizados</SectionLabel>
            <h2 className="mt-3 max-w-2xl font-heading text-[26px] leading-[1.1] font-semibold text-ink lg:text-[30px]">
              Proyectos donde ya hemos trabajado.
            </h2>

            <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {GALLERY.map((g) => (
                <div key={g.id} className="border border-divider">
                  <div className="relative aspect-square w-full border-b border-divider">
                    <Image
                      src={g.photo}
                      alt={g.title}
                      fill
                      sizes="(max-width: 1024px) 45vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <p className="truncate font-heading text-[13px] font-semibold text-ink">
                      {g.title}
                    </p>
                    <p className="truncate text-[11px] text-text-3">{g.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Nosotros: misión / visión / valores */}
        <section id="nosotros" className="border-t border-divider px-4 py-12 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <SectionLabel>Quiénes somos</SectionLabel>
            <h2 className="mt-3 max-w-2xl font-heading text-[26px] leading-[1.1] font-semibold text-ink lg:text-[30px]">
              Cumplimiento y mantenimiento, obra tras obra.
            </h2>

            <div className="mt-8 grid gap-3.5 lg:grid-cols-2">
              <Blueprint tone="dark" className="bg-ink p-5 text-paper">
                <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-500 uppercase">
                  Misión
                </span>
                <p className="mt-2 text-[14px] leading-[1.5] text-text-on-dark">{MISSION}</p>
              </Blueprint>
              <Blueprint className="border border-ink bg-surface p-5">
                <span className="font-heading text-[11px] font-semibold tracking-[.16em] text-accent-700 uppercase">
                  Visión
                </span>
                <p className="mt-2 text-[14px] leading-[1.5] text-text-2">{VISION}</p>
              </Blueprint>
            </div>

            <div className="mt-8 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
              {VALUES.map((v) => (
                <div key={v.title} className="flex flex-col gap-2.5 border border-divider p-4">
                  <Check className="h-5 w-5 text-accent-700" strokeWidth={1.8} />
                  <h3 className="font-heading text-[15px] font-semibold text-ink">{v.title}</h3>
                  <p className="text-[12.5px] leading-[1.4] text-text-2">{v.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contacto */}
        <section id="contacto" className="border-t border-divider px-4 py-14 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-4 border border-ink bg-surface p-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="font-heading text-[22px] font-semibold text-ink">
                Cuéntanos qué necesita tu obra.
              </h2>
              <p className="mt-1 text-[13.5px] text-text-3">
                Respondemos cotizaciones el mismo día.
              </p>
              <div className="mt-3 flex flex-col gap-1.5 text-[13px] text-text-2">
                <span className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-accent-700" strokeWidth={1.6} />
                  {COMPANY_PROFILE.phone}
                </span>
                <span className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-accent-700" strokeWidth={1.6} />
                  {COMPANY_PROFILE.email}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-accent-700" strokeWidth={1.6} />
                  {COMPANY_PROFILE.address}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2.5">
              <Button
                render={
                  <a
                    href={whatsappHref("Hola, quiero cotizar el alquiler de una máquina.")}
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
                nativeButton={false}
                className="min-h-12 gap-2 px-5 text-[15px]"
              >
                Escribir por WhatsApp
                <ArrowRight className="h-4 w-4" strokeWidth={1.8} />
              </Button>
              <Button
                render={<a href={`tel:${COMPANY_PROFILE.phone.replace(/\s+/g, "")}`} />}
                nativeButton={false}
                variant="outline"
                className="min-h-12 gap-2 px-5 text-[15px]"
              >
                <Phone className="h-4 w-4" strokeWidth={1.8} />
                Llamar ahora
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-ink-line bg-ink">
        <HazardTape />
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-5 sm:flex-row sm:items-center lg:px-8">
          <span className="font-heading text-sm font-semibold tracking-[.1em] text-accent-500">
            EXCAVAL
          </span>
          <span className="text-[11.5px] text-text-4">
            Alquiler de maquinaria pesada · {COMPANY_PROFILE.address}
          </span>
          <Link
            href="/"
            className="font-heading text-[11px] font-semibold tracking-[.08em] text-text-on-dark uppercase hover:text-accent-500"
          >
            Ver simulación del sistema
          </Link>
        </div>
      </footer>
    </div>
  );
}
