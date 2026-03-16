// src/modules/billing/ai/ai.repository.ts
//
// Currently the Invoice model itself stores all AI metadata (aiPrompt,
// aiConfidence, aiSuggestions, source). This repository is a thin wrapper
// for any future dedicated AI-log table and for querying AI-sourced invoices.

import { db } from "../../../shared/database";
import type { InvoiceStatus } from "../invoices/invoice.types";

export const aiRepository = {
  /** Return all AI-generated invoices for an organisation. */
  async findAIInvoicesByOrg(organizationId: string) {
    return db.invoice.findMany({
      where:   { organizationId, source: "ai" },
      include: { lineItems: true },
      orderBy: { createdAt: "desc" },
    });
  },

  /** Return the raw prompt + confidence for an invoice (for audit trails). */
  async getAIMetadata(invoiceId: string) {
    return db.invoice.findUnique({
      where:  { id: invoiceId },
      select: {
        aiPrompt:      true,
        aiConfidence:  true,
        aiSuggestions: true,
        source:        true,
      },
    });
  },
};