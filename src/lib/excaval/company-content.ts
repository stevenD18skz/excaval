export interface CompanyValue {
  title: string;
  body: string;
}

export interface Service {
  code: string; // placa corta, estilo plate
  title: string;
  body: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  location: string;
  photo: string;
}

const MACHINE_PHOTO = "/Maquinas/maquina_1.jpeg";

export const COMPANY_PROFILE = {
  legalName: "Excaval Rionegro",
  tagline: "Maquinaria pesada al servicio de tu obra",
  phone: "314 552 8890",
  whatsapp: "573145528890",
  email: "contacto@excaval.co",
  address: "Vía Rionegro–La Ceja, Antioquia",
};

/** Misión/visión — contenido provisional, se reemplaza cuando el cliente entregue el texto real. */
export const MISSION =
  "Poner a disposición de empresas y contratistas una flota de maquinaria pesada confiable y bien mantenida, con respuesta rápida y operarios certificados, para que cada obra avance sin contratiempos.";

export const VISION =
  "Ser la empresa de referencia en alquiler de maquinaria pesada del oriente antioqueño, reconocida por la disponibilidad de su flota, la transparencia en el servicio y el cumplimiento en cada proyecto.";

export const VALUES: CompanyValue[] = [
  {
    title: "Cumplimiento",
    body: "La máquina llega cuando se pactó y con las horas que el proyecto necesita, sin sorpresas de última hora.",
  },
  {
    title: "Mantenimiento preventivo",
    body: "Cada activo tiene su hoja de vida al día — revisiones programadas antes de que se conviertan en una parada de obra.",
  },
  {
    title: "Transparencia",
    body: "Tarifas claras por hora u obra, y seguimiento del servicio desde la cotización hasta la factura.",
  },
  {
    title: "Seguridad",
    body: "Operarios certificados y protocolos de seguridad en cada operación, en obra propia o de terceros.",
  },
];

export const SERVICES: Service[] = [
  {
    code: "ALQ",
    title: "Alquiler por horas o por obra",
    body: "Excavadoras, retroexcavadoras, volquetas, rodillos, cargadores y motoniveladoras — con o sin operario, por el tiempo que dure tu proyecto.",
  },
  {
    code: "OPE",
    title: "Operarios certificados",
    body: "Cada máquina puede salir con su propio operario, con experiencia comprobada en obra vial y urbanización.",
  },
  {
    code: "MNT",
    title: "Mantenimiento incluido",
    body: "La flota se mantiene por nuestra cuenta — el cliente solo se preocupa por avanzar la obra.",
  },
  {
    code: "COT",
    title: "Cotización a la medida",
    body: "Presupuesto según horas estimadas, tipo de máquina y proyecto, con respuesta el mismo día.",
  },
];

/** Galería de trabajos — usa la única foto real disponible hasta subir el registro fotográfico completo. */
export const GALLERY: GalleryItem[] = [
  {
    id: "gal-01",
    title: "Nivelación vía Rionegro–La Ceja",
    location: "K12+400 · julio 2026",
    photo: MACHINE_PHOTO,
  },
  {
    id: "gal-02",
    title: "Urbanización La Ceja · Etapa 2",
    location: "Urbanizadora La Ceja",
    photo: MACHINE_PHOTO,
  },
  {
    id: "gal-03",
    title: "Transporte de material · Cantera El Peñol",
    location: "Vialpisos Ltda.",
    photo: MACHINE_PHOTO,
  },
  {
    id: "gal-04",
    title: "Vía municipal K3+100",
    location: "Municipio de Rionegro",
    photo: MACHINE_PHOTO,
  },
];
