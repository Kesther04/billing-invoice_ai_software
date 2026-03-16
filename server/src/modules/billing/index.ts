// src/modules/billing/index.ts

import { Router } from "express";
import invoiceRouter from "./invoices/invoice.routes";
import aiRouter      from "./ai/ai.routes";

const router = Router();

// /billing/invoices/...
router.use("/invoices", invoiceRouter);

// /billing/ai/...
router.use("/ai", aiRouter);

export default router;