import { z } from "zod";

const envSchema = z.object({
  NODE_ENV:     z.enum(["development", "test", "production"]).default("development"),
  PORT:         z.string().default("5000"),
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  JWT_ACCESS_SECRET:   z.string().min(28, "JWT_ACCESS_SECRET must be at least 28 characters"),

  // Google Gemini
  GROQ_API_KEY: z.string().min(1, "GROQ_API_KEY is required"),
  GROQ_MODEL:   z.string().min(1, "GROQ_MODEL is required"),

  // // OpenAI (Now optional to avoid validation errors if you stop using it)
  // OPENAI_API_KEY: z.string().optional(),
  // OPENAI_MODEL:   z.string().default("gpt-4o-mini"),

  // Optional
  FRONTEND_URL: z.string().default("https://traqbill.vercel.app").describe("The URL of the frontend application, used for CORS and reset links"),
});

function loadEnv() {
  // We use process.env directly here
  const result = envSchema.safeParse(process.env);
  
  if (!result.success) {
    console.error("❌  Invalid environment variables:");
    result.error.issues.forEach((e) => {
      console.error(`   ${e.path.join(".")}: ${e.message}`);
    });
    // If validation fails, the app will stop here
    process.exit(1);
  }
  return result.data;
}

export const env = loadEnv();