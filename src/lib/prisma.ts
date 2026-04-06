import path from "node:path";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const resolveDatabaseUrl = () => {
  const rawUrl = process.env.DATABASE_URL;
  if (!rawUrl) return undefined;

  if (rawUrl.startsWith("file:./")) {
    const relative = rawUrl.replace("file:./", "");
    return `file:${path.join(process.cwd(), relative)}`;
  }

  return rawUrl;
};

const databaseUrl = resolveDatabaseUrl();

const createClient = () =>
  new PrismaClient({
    datasourceUrl: databaseUrl,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : [],
  });

const client = createClient();

export const prisma =
  globalForPrisma.prisma && (globalForPrisma.prisma as any).user
    ? globalForPrisma.prisma
    : (client as unknown as PrismaClient);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
