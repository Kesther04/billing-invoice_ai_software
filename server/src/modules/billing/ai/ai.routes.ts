import { Router } from "express";
import { generateInvoice, getPromptHistory } from "./ai.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";

const router = Router();

// All AI billing routes require authentication
router.use(authMiddleware);

/**
 * POST /billing/ai/generate
 * Parses a natural language prompt into a structured invoice draft.
 * Does NOT save an invoice — that happens via POST /billing/invoices.
 */
router.post("/generate", generateInvoice);

/**
 * GET /billing/ai/history
 * Returns the last 20 prompt runs for the authenticated org.
 */
router.get("/history", getPromptHistory);

export default router;