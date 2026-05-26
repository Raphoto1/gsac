import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

export type PrismaConnectionMode = "accelerate" | "adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const rawResolvedUrl =
  process.env.DATABASE_URL ??
  process.env.PRISMA_DATABASE_URL ??
  process.env.POSTGRES_URL;

if (!rawResolvedUrl) {
  throw new Error(
    "Missing Prisma connection URL. Define DATABASE_URL, PRISMA_DATABASE_URL, or POSTGRES_URL."
  );
}

function normalizePostgresSslMode(url: string): string {
  if (!(url.startsWith("postgresql://") || url.startsWith("postgres://"))) {
    return url;
  }

  try {
    const parsed = new URL(url);
    const sslMode = parsed.searchParams.get("sslmode");

    if (!sslMode) {
      return url;
    }

    const normalized = sslMode.toLowerCase();
    if (normalized === "prefer" || normalized === "require" || normalized === "verify-ca") {
      parsed.searchParams.set("sslmode", "verify-full");
      return parsed.toString();
    }

    return url;
  } catch {
    return url;
  }
}

const resolvedUrl = normalizePostgresSslMode(rawResolvedUrl);

const hasPrismaProtocol =
  resolvedUrl.startsWith("prisma://") || resolvedUrl.startsWith("prisma+postgres://");

const hasPostgresProtocol =
  resolvedUrl.startsWith("postgresql://") || resolvedUrl.startsWith("postgres://");

export const prismaConnectionMode: PrismaConnectionMode = hasPrismaProtocol
  ? "accelerate"
  : "adapter-pg";

function buildPrismaClient() {
  if (hasPrismaProtocol) {
    return new PrismaClient({
      accelerateUrl: resolvedUrl,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  if (hasPostgresProtocol) {
    const pool = new Pool({ connectionString: resolvedUrl });
    const adapter = new PrismaPg(pool);

    return new PrismaClient({
      adapter,
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  }

  throw new Error(
    "Invalid database URL protocol. Use prisma://, prisma+postgres://, postgresql:// or postgres://"
  );
}

export const prisma =
  globalForPrisma.prisma ??
  buildPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
