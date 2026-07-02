import type { Request, Response } from "express";
import * as invoiceService from "./invoice.service";
import { NotFoundError, ValidationError } from "./invoice.service";
import type { CreateInvoiceBody, UpdateInvoiceBody } from "./invoice.types";

/* ── POST /billing/invoices ──────────────────────────────────────────────────── */
export async function createInvoice(req: Request, res: Response): Promise<void> {
  const organizationId = (req as any).user?.organizationId;
  const createdById    = (req as any).user?.id;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const invoice = await invoiceService.createInvoice(
      req.body as CreateInvoiceBody,
      organizationId,
      createdById
    );
    res.status(201).json(invoice);
  } catch (err) {
    handleError(err, res);
  }
}

/* ── GET /billing/invoices ───────────────────────────────────────────────────── */
export async function listInvoices(req: Request, res: Response): Promise<void> {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const { status, clientId } = req.query as Record<string, string | undefined>;
    const invoices = await invoiceService.listInvoices(organizationId, { status, clientId });
    res.status(200).json(invoices);
  } catch (err) {
    handleError(err, res);
  }
}

/* ── GET /billing/invoices/:id ───────────────────────────────────────────────── */
export async function getInvoice(req: Request, res: Response): Promise<void> {
  const organizationId = (req as any).user?.organizationId;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const invoice = await invoiceService.getInvoice((req as any).params.id, organizationId);
    res.status(200).json(invoice);
  } catch (err) {
    handleError(err, res);
  }
}

/* ── PATCH /billing/invoices/:id ─────────────────────────────────────────────── */
export async function updateInvoice(req: Request, res: Response): Promise<void> {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const invoice = await invoiceService.updateInvoice(
      (req as any).params.id,
      organizationId,
      req.body as UpdateInvoiceBody
    );
    res.status(200).json(invoice);
  } catch (err) {
    handleError(err, res);
  }
}

/* ── DELETE /billing/invoices/:id ────────────────────────────────────────────── */
export async function deleteInvoice(req: Request, res: Response): Promise<void> {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    await invoiceService.deleteInvoice((req as any).params.id, organizationId);
    res.status(204).send();
  } catch (err) {
    handleError(err, res);
  }
}

/* ── POST /billing/invoices/:id/send ─────────────────────────────────────────── */
export async function sendInvoice(req: Request, res: Response): Promise<void> {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const invoice = await invoiceService.sendInvoice((req as any).params.id, organizationId);
    res.status(200).json(invoice);
  } catch (err) {
    handleError(err, res);
  }
}

/* ── Error handler ───────────────────────────────────────────────────────────── */
function handleError(err: unknown, res: Response): void {
  if (err instanceof NotFoundError) {
    res.status(404).json({ message: err.message });
  } else if (err instanceof ValidationError) {
    res.status(400).json({ message: err.message });
  } else {
    const message = err instanceof Error ? err.message : "Internal server error";
    res.status(500).json({ message });
  }
}