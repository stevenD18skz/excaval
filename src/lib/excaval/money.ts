export function formatMoney(n: number): string {
  return "$ " + Math.round(n).toLocaleString("es-CO");
}

export function formatMoneyShort(n: number): string {
  return (
    "$ " +
    (n / 1e6).toLocaleString("es-CO", {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    }) +
    " M"
  );
}

export function formatExpense(n: number): string {
  return "−" + formatMoney(n);
}
