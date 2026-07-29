# EXCAVAL

Sistema de Gestión Administrativa y Operativa para una empresa de maquinaria pesada. Centraliza el flujo de caja, la gestión documental y el estado de la maquinaria en una interfaz de extrema simplicidad, pensada para un único tipo de usuario: Gerencia/Directivos.

## Contexto del proyecto

A diferencia de un ERP complejo con múltiples roles, Excaval elimina esa complejidad: todo el sistema está diseñado para que un directivo consulte y registre información desde el campo de obra, en el celular, sin curva de aprendizaje.

### Módulos

| Módulo | Qué resuelve |
|---|---|
| **Dashboard** | Página de inicio con resumen de dinero (ingresos, egresos, ganancia neta del mes) y visualización gráfica de balances. |
| **Libro de Cuentas Digital** | Registro de ingresos con estado ("Pagado" / "Por Cobrar") y seguimiento automático de facturas pendientes. |
| **Control de Salidas (Egresos y Sueldos)** | Gastos categorizados (repuestos, reparaciones, gasolina, "gastos de punto") y pagos a operarios, en modo transaccional para evitar descuadres. |
| **Semáforo de la Máquina** | Estado operativo del activo: Trabajando / Disponible / Mantenimiento, ubicación actual y cliente/proyecto asignado. |
| **Gestión Documental y CRM** | Archivo de papeles (fotos de facturas/recibos por transacción) y archivo de clientes, con buscador global. |

### Requerimientos no funcionales

- **Mobile-first**: los directivos consultan principalmente desde el campo de obra.
- **Validación de datos** en cliente y servidor, para evitar errores contables.
- **Cero curva de aprendizaje**: formularios guiados y tarjetas (cards) en vez de tablas densas.

## Stack técnico

- **Front-end**: [Next.js](https://nextjs.org) (App Router) + [Tailwind CSS](https://tailwindcss.com)
- **Back-end**: Next.js API Routes (serverless, mismo repositorio)
- **Base de datos**: PostgreSQL vía [Supabase](https://supabase.com)
- **Storage**: Supabase Storage (archivo de papeles/facturas)
- **Auth**: Supabase Auth (correo electrónico/contraseña)
- **Gestor de paquetes**: pnpm

### Entidades núcleo (referencia)

```
users            id, email, created_at
clients          id, name, phone, company, created_at
transactions     id, type (INCOME|EXPENSE), category (SUELDO|REPUESTO|SERVICIO|PUNTO),
                 amount, status (PAID|PENDING), client_id, description, receipt_url, date
machine_status   id, status (WORKING|AVAILABLE|MAINTENANCE), location, client_id, updated_at
```

## Desarrollo local

```bash
pnpm install
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

Otros scripts:

```bash
pnpm build   # build de producción
pnpm start   # sirve el build de producción
pnpm lint    # eslint
```

## Variables de entorno

Este proyecto usará Supabase. Al configurarlo, crea un `.env.local` (ignorado por git) con:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

## Despliegue

El proyecto está vinculado a Vercel y conectado al repositorio de GitHub: cada push a `main` despliega a producción, y las demás ramas generan preview deployments automáticamente.

- Producción: https://excaval.vercel.app
- Repositorio: https://github.com/stevenD18skz/excaval
