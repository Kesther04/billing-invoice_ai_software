// src/modules/billing/ai/ai.routes.ts

import { Router } from "express";
import { aiController } from "./ai.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { validateBody } from "../../../shared/middlewares/validate.middleware";
import { generateInvoiceSchema, saveAIInvoiceSchema } from "../../../shared/validators/ai.validator";
import { rateLimitMiddleware } from "../../../shared/middlewares/rate-limit.middleware";

const router = Router();

// Apply auth to all AI routes
router.use(authMiddleware);

/**
 * POST /billing/ai/generate
 * Rate limited — each call hits OpenAI
 */
router.post(
  "/generate",
  rateLimitMiddleware({ windowMs: 60_000, max: 10 }), // 10 req/min per user
  validateBody(generateInvoiceSchema),
  aiController.generate
);

/**
 * POST /billing/ai/save
 * Persists a reviewed AI-generated invoice
 */
router.post(
  "/save",
  validateBody(saveAIInvoiceSchema),
  aiController.save
);

export default router;