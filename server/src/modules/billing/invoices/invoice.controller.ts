// src/modules/billing/invoices/invoice.controller.ts

import type { Request, Response, NextFunction } from "express";
import { invoiceService } from "./invoice.service";
import type { CreateInvoiceInput, UpdateInvoiceInput, InvoiceListFilters } from "./invoice.types";

// Helper — pulls org / user from request (set by auth middleware)
function orgId(req: Request): string {
  return (req as any).user?.organizationId as string;
}
function userId(req: Request): string {
  return (req as any).user?.id as string;
}

export const invoiceController = {
  /**
   * POST /billing/invoices
   * Creates a manual invoice and persists it immediately.
   */
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as CreateInvoiceInput;

      const invoice = await invoiceService.create({
        organizationId: orgId(req),
        createdById:    userId(req),
        input: {
          ...input,
          source: "manual", // always "manual" for this endpoint
        },
      });

      res.status(201).json(invoice);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /billing/invoices
   * Paginated list with optional filters.
   */
  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const filters: InvoiceListFilters = {
        status:   req.query.status   as any,
        clientId: req.query.clientId as string,
        search:   req.query.search   as string,
        from:     req.query.from     as string,
        to:       req.query.to       as string,
        page:     req.query.page     ? Number(req.query.page)  : 1,
        limit:    req.query.limit    ? Number(req.query.limit) : 20,
      };

      const result = await invoiceService.list(orgId(req), filters);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /billing/invoices/:id
   */
  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const invoiceId = req.params.id;

      if (typeof invoiceId == "string") {
        const invoice = await invoiceService.getById(invoiceId  , orgId(req));
        res.status(200).json(invoice);
      } else {
        res.status(400).json({ error: "Invalid invoice ID" });
      }
    } catch (err) {
      next(err);
    }
  },

  /**
   * PATCH /billing/invoices/:id
   */
  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const input = req.body as UpdateInvoiceInput;
      if (typeof req.params.id == "string") {
        const invoice = await invoiceService.update(req.params.id, orgId(req), input);
        res.status(200).json(invoice);
      } else {
        res.status(400).json({ error: "Invalid invoice ID" });
      }
    } catch (err) {
      next(err);
    }
  },

  /**
   * DELETE /billing/invoices/:id
   */
  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (typeof req.params.id == "string") {
        await invoiceService.delete(req.params.id, orgId(req));
        res.status(204).send();
      } else {
        res.status(400).json({ error: "Invalid invoice ID" });
      }
    } catch (err) {
      next(err);
    }
  },

  /**
   * GET /billing/invoices/summary
   * Returns per-status counts and totals — used by dashboard.
   */
  async summary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await invoiceService.getStatusSummary(orgId(req));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  },
};