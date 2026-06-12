import { defineConfig } from "prisma/config";

// Prisma 7 config: datasource URL is used by CLI (migrate, generate etc.)
// At runtime, PrismaClient reads DATABASE_URL from process.env directly.
export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? "",
  },
});
