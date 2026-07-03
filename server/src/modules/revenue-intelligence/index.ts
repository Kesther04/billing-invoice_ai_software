import { Router } from "express";
import analyticsRoutes from "./analytics/analytics.routes";

const router = Router();

/**
 * /analytics/* — Revenue Intelligence routes
 */
router.use("/analytics", analyticsRoutes);

export default router;
