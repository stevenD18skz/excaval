import { cn } from "@/lib/utils";
import { formatMoney, formatMoneyShort } from "@/lib/excavla/money";

interface MoneyProps {
  value: number;
  /** "long": $ 38.400.000 · "short": $ 38,4 M */
  variant?: "long" | "short";
  /** "auto" antepone − si value es negativo. "negative" fuerza el signo (para egresos ya positivos). */
  sign?: "auto" | "negative" | "none";
  className?: string;
}

/** Cifra tabular en formato COP, según el formato de moneda del sistema. */
export function Money({ value, variant = "long", sign = "auto", className }: MoneyProps) {
  const formatted =
    variant === "short" ? formatMoneyShort(Math.abs(value)) : formatMoney(Math.abs(value));
  const showMinus = sign === "negative" || (sign === "auto" && value < 0);

  return (
    <span className={cn("tabular font-heading font-semibold", className)}>
      {showMinus ? "−" : ""}
      {formatted}
    </span>
  );
}
