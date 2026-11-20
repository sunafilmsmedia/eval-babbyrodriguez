export function formatCurrency(n: number | undefined): string {
  if (typeof n !== "number" || isNaN(n)) return "";
  return n.toLocaleString("es", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  });
}

export function groupedNumber(n: number | undefined): string {
  if (typeof n !== "number" || isNaN(n)) return "";
  return n.toLocaleString("es").replace(/ /g, " ");
}
