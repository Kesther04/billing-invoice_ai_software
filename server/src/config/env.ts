// src/config/env.ts

import { z } from "zod";

const envSchema = z.object({
  NODE_ENV:     z.enum(["development", "test", "production"]).default("development"),
  PORT:         z.string().default("3000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_SECRET:   z.string().min(32, "JWT_SECRET must be at least 32 characters"),

  // OpenAI
  OPENAI_API_KEY: z.string().min(1, "OPENAI_API_KEY is required"),
  OPENAI_MODEL:   z.string().default("gpt-4o-mini"),

  // Optional
  FRONTEND_URL: z.string().default("http://localhost:5173"),
});

function loadEnv() {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error("❌  Invalid environment variables:");
    result.error.issues.forEach((e) => {
      console.error(`   ${e.path.join(".")}: ${e.message}`);
    });
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();