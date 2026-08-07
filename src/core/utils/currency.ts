/**
 * Converts EGP amount (e.g., 100.50) to Piastres (10050) as BIGINT integer.
 */
export function toPiastres(amountEGP: number): number {
  if (isNaN(amountEGP)) return 0;
  return Math.round(amountEGP * 100);
}

/**
 * Converts Piastres (e.g., 10050) to EGP decimal (100.50).
 */
export function toEGP(piastres: number): number {
  if (!piastres) return 0;
  return piastres / 100;
}

/**
 * Formats Piastres into formatted EGP currency string (e.g., "10,050.00 ج.م").
 */
export function formatCurrency(piastres: number, includeSymbol: boolean = true): string {
  const egp = toEGP(piastres);
  const formatted = new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(egp);

  return includeSymbol ? `${formatted} ج.م` : formatted;
}

/**
 * Formats EGP number value into standard currency display string.
 */
export function formatEGP(amountEGP: number): string {
  return formatCurrency(toPiastres(amountEGP));
}
