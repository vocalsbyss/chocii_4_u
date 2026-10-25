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
    path.resolve(process.cwd(), ".next", "standalone", "prisma", "dev.db"),
    path.resolve(__dirname, "prisma", "dev.db"),
    path.resolve(__dirname, "..", "prisma", "dev.db"),
    path.resolve(__dirname, "..", "..", "prisma", "dev.db"),
    path.resolve(__dirname, "..", "..", "..", "prisma", "dev.db"),
    path.resolve(__dirname, "..", "..", "..", "..", "prisma", "dev.db"),
    "/var/task/prisma/dev.db",
    "/var/task/.next/server/prisma/dev.db",
    "/var/task/.next/standalone/prisma/dev.db",
  ];

  for (const p of candidatePaths) {
    try {
      if (fs.existsSync(p) && fs.statSync(p).size > 0) {
        return p;
      }
    } catch {}
  }

  // Deep directory search if standard paths didn't match
  try {
    const rootSearch = process.env.LAMBDA_TASK_ROOT || process.cwd();
    const searchDirs = [rootSearch, path.join(rootSearch, "prisma"), path.join(rootSearch, ".next")];
    for (const d of searchDirs) {
      if (fs.existsSync(d)) {
        const files = fs.readdirSync(d);
        for (const f of files) {
          if (f === "dev.db") {
            const full = path.join(d, f);
            if (fs.statSync(full).size > 0) {
              return full;
            }
          }
        }
      }
    }
  } catch {}

  return null;
}

function resolveDatabaseUrl(): string {
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
          try {
            fs.chmodSync(tmpDbPath, 0o666);
          } catch {}
        }
      }
      if (fs.existsSync(tmpDbPath)) {
        try {
          fs.chmodSync(tmpDbPath, 0o666);
        } catch {}
        return `file:${tmpDbPath}`;
      }
    } catch (e) {
      console.warn("Could not copy database to /tmp, falling back to found path:", e);
    }
  }

  if (foundBundled) {
    return `file:${foundBundled}`;
  }

  const envUrl = process.env.DATABASE_URL;
  if (envUrl && envUrl.startsWith("file:")) {
    return envUrl;
  }

  return "file:./prisma/dev.db";
}

const resolvedUrl = resolveDatabaseUrl();
process.env.DATABASE_URL = resolvedUrl;

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: { db: { url: resolvedUrl } },
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
