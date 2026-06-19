import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// Resolve absolute path to the local dev.db file at the root of the project
const dbPath = path.resolve(process.cwd(), "dev.db");
let connectionUrl = process.env.DATABASE_URL || `file:${dbPath}`;

if (connectionUrl.startsWith("file:")) {
  let filePath = connectionUrl.substring(5);
  // If it's a relative path from the env (e.g. "./dev.db" or "dev.db"), anchor it to the workspace root
  if (!path.isAbsolute(filePath)) {
    if (filePath.startsWith("./")) {
      filePath = filePath.substring(2);
    }
    connectionUrl = `file:${path.resolve(process.cwd(), filePath)}`;
  }
}

const adapter = new PrismaLibSql({
  url: connectionUrl,
});

export const db = globalForPrisma.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
