import { defineConfig } from "prisma/config";
import * as fs from "fs";

// Manually parse .env since Prisma CLI might evaluate this file before loading the .env
try {
  const env = fs.readFileSync(".env", "utf8");
  env.split("\n").forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      let val = match[2] || "";
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      process.env[match[1]] = val;
    }
  });
} catch (e) {
  // ignore
}

// Prisma 7 config: datasource URL is used by CLI (migrate, generate etc.)
// At runtime, PrismaClient reads DATABASE_URL from process.env directly.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL || "",
  },
});
