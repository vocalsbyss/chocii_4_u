import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function findBundledDb(): string | null {
  const candidatePaths = [
    path.resolve(process.cwd(), "prisma", "dev.db"),
    path.resolve(process.cwd(), ".next", "server", "prisma", "dev.db"),
    path.resolve(__dirname, "prisma", "dev.db"),
    path.resolve(__dirname, "..", "prisma", "dev.db"),
    path.resolve(__dirname, "..", "..", "prisma", "dev.db"),
    path.resolve(__dirname, "..", "..", "..", "prisma", "dev.db"),
    path.resolve(__dirname, "..", "..", "..", "..", "prisma", "dev.db"),
    "/var/task/prisma/dev.db",
    "/var/task/.next/server/prisma/dev.db",
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).size > 0) {
        return p;
      }
    } catch {}
  }
  return null;
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

  const foundBundled = findBundledDb();

  if (isVercel) {
    const tmpDbPath = "/tmp/chocii_prod.db";
    try {
      if (!fs.existsSync(tmpDbPath) || fs.statSync(tmpDbPath).size === 0) {
        if (foundBundled) {
          fs.copyFileSync(foundBundled, tmpDbPath);
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.warn("Could not copy database to /tmp, falling back to found path:", e);
    }
  }

  if (foundBundled) {
    return `file:${foundBundled}`;
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
