import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url:
      process.env.DATABASE_URL ??
      process.env.PRISMA_DATABASE_URL ??
      process.env.POSTGRES_URL,
  },
});
