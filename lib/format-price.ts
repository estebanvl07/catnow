/**
 * Formatea un monto numérico según el código de moneda (ISO 4217).
 * Usa Intl.NumberFormat para locale y símbolo correctos.
 */
export function formatPrice(amount: number, currencyCode: string = "USD"): string {
  return new Intl.NumberFormat("es", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}
