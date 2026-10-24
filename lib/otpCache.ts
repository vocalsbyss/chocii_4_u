/**
 * In-memory distributed-friendly cache for OTP verification.
 * Backs up SQLite database operations in serverless environments.
 */

export interface OtpEntry {
  code: string;
  phone?: string;
  email?: string;
  name?: string;
  expiresAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __chociiOtpCache: Map<string, OtpEntry> | undefined;
}

if (!globalThis.__chociiOtpCache) {
  globalThis.__chociiOtpCache = new Map<string, OtpEntry>();
}

export const otpCache = {
  set(key: string, entry: OtpEntry) {
    if (!key) return;
    globalThis.__chociiOtpCache!.set(key.toLowerCase().trim(), entry);
  },
  get(key: string): OtpEntry | undefined {
    if (!key) return undefined;
    const entry = globalThis.__chociiOtpCache!.get(key.toLowerCase().trim());
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      globalThis.__chociiOtpCache!.delete(key.toLowerCase().trim());
      return undefined;
    }
    return entry;
  },
  delete(key: string) {
    if (!key) return;
    globalThis.__chociiOtpCache!.delete(key.toLowerCase().trim());
  },
};
