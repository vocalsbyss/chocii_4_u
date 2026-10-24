/**
 * Phone number normalization utility for chocii 4 u authentication.
 * Formats standard 10-digit, prefixed (+91, 91, 0), and spaced Indian phone numbers.
 */
export function normalizePhone(input: string): { normalized: string; rawDigits: string } | null {
  if (!input || typeof input !== "string") return null;
  const cleaned = input.replace(/\D/g, "");
  let rawDigits = "";

  if (cleaned.length === 10) {
    rawDigits = cleaned;
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    rawDigits = cleaned.slice(2);
  } else if (cleaned.length === 11 && cleaned.startsWith("0")) {
    rawDigits = cleaned.slice(1);
  } else if (cleaned.length > 10) {
    rawDigits = cleaned.slice(-10);
  } else {
    return null;
  }

  return {
    normalized: `+91${rawDigits}`,
    rawDigits,
  };
}
