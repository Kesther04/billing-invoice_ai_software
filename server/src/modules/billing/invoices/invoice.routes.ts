import { Router } from "express";
import {
  createInvoice,
  listInvoices,
  getInvoice,
  updateInvoice,
  deleteInvoice,
  sendInvoice,
} from "./invoice.controller";
import { authMiddleware } from "../../../shared/middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

/**
 * POST   /billing/invoices        — create (manual or AI-confirmed)
 * GET    /billing/invoices        — list (filter by ?status=&clientId=)
 * GET    /billing/invoices/:id    — get one
 * PATCH  /billing/invoices/:id    — update
 * DELETE /billing/invoices/:id    — delete
 * POST   /billing/invoices/:id/send — send to client (draft → pending)
 */
router.post("/",          createInvoice);
router.get("/",           listInvoices);
router.get("/:id",        getInvoice);
router.patch("/:id",      updateInvoice);
router.delete("/:id",     deleteInvoice);
router.post("/:id/send",  sendInvoice);

export default router;