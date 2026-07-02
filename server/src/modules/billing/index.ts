
import { Router } from "express";
import aiRoutes      from "./ai/ai.routes";
import invoiceRoutes from "./invoices/invoice.routes";

const router = Router();

/**
 * /billing/ai/*       — AI generation + prompt history
 * /billing/invoices/* — Invoice CRUD + send
 */
router.use("/ai",       aiRoutes);
router.use("/invoices", invoiceRoutes);

export default router;