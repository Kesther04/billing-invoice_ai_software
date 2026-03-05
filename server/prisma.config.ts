import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",  // path to your schema
  migrations: {
    path: "prisma/migrations",      // default – adjust if needed
    // seed: "ts-node prisma/seed.ts",   // optional – if you have a seed script
  },

  datasource: {
    url: env("DATABASE_URL"),       // ← connection string used by migrate / introspect    
  },
});