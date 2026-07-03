import { Router } from "express";
import { getRevenueAnalyticsHandler } from "./analytics.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { requireAuth } from "../../users";

const router = Router();

router.use(authMiddleware);

/**
 * GET /revenue/analytics
 * Dashboard analytics — overview + pending payments.
 * trend, topClients, insights return [] at Layer 1.
 */
router.get("/", requireAuth, getRevenueAnalyticsHandler);

export default router;