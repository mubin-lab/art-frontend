export function formatPrice(amount: number, currency: string = "BDT"): string {
  if (currency === "BDT") {
    return `৳${Math.round(amount).toLocaleString("en-US")}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}