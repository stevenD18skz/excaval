import { Home, FileText, ArrowDownToLine, Users, type LucideProps } from "lucide-react";

export function MachineNavIcon({ className, strokeWidth }: LucideProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      strokeWidth={strokeWidth ?? 1.6}
      aria-hidden
    >
      <rect x="8" y="2" width="8" height="20" rx="4" stroke="currentColor" />
      <circle cx="12" cy="7" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
      <circle cx="12" cy="17" r="1.3" fill="currentColor" stroke="none" />
    </svg>
  );
}

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Inicio", icon: Home },
  { href: "/cuentas", label: "Cuentas", icon: FileText },
  { href: "/salidas", label: "Salidas", icon: ArrowDownToLine },
  { href: "/maquinas", label: "Máquinas", icon: MachineNavIcon },
  { href: "/clientes", label: "Clientes", icon: Users },
] as const;
