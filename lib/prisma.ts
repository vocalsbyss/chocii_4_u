import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function resolveDatabaseUrl(): string | undefined {
  const envUrl = process.env.DATABASE_URL;

  // If a remote cloud database (e.g. Postgres, Supabase, Neon) is specified, use directly
  if (envUrl && !envUrl.startsWith("file:")) {
    return envUrl;
  }

  const isVercel = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    process.env.VERCEL_ENV
  );

  const bundledDbPath = path.resolve(process.cwd(), "prisma", "dev.db");

  if (isVercel) {
    // In Vercel serverless functions, the root filesystem is read-only.
    // Copy the seeded SQLite database to /tmp so reading and writing both work without errors!
    const tmpDbPath = "/tmp/chocii_prod.db";
    try {
      if (!fs.existsSync(tmpDbPath)) {
        if (fs.existsSync(bundledDbPath)) {
          fs.copyFileSync(bundledDbPath, tmpDbPath);
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.warn("Could not copy database to /tmp, falling back to bundled path:", e);
    }
  }

  // Use absolute path for SQLite so Prisma locates dev.db regardless of process cwd
  if (fs.existsSync(bundledDbPath)) {
    return `file:${bundledDbPath}`;
  }

  return envUrl;
}

const resolvedUrl = resolveDatabaseUrl();

export const prisma =
  global.prisma ||
  new PrismaClient({
    ...(resolvedUrl ? { datasources: { db: { url: resolvedUrl } } } : {}),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
