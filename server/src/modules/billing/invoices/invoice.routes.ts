// src/modules/billing/invoices/invoice.routes.ts

import { Router } from "express";
import { invoiceController } from "./invoice.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";
import { validateBody } from "../../../shared/middlewares/validate.middleware";
import {
  createInvoiceSchema,
  updateInvoiceSchema,
} from "../../../shared/validators/invoice.validator";

const router = Router();

router.use(authMiddleware);

// GET  /billing/invoices/summary  — must be before /:id
router.get("/summary", invoiceController.summary);

// CRUD
router.post(  "/",    validateBody(createInvoiceSchema), invoiceController.create);
router.get(   "/",    invoiceController.list);
router.get(   "/:id", invoiceController.getOne);
router.patch( "/:id", validateBody(updateInvoiceSchema), invoiceController.update);
router.delete("/:id", invoiceController.remove);

export default router;