// src/modules/billing/ai/ai.types.ts

import type { InvoiceParty, LineItemInput } from "../invoices/invoice.types";

// ─── Request / Response shapes ────────────────────────────────────────────────

export interface GenerateInvoiceRequest {
  prompt: string;
}

export interface GenerateInvoiceResponse {
  invoice: ParsedInvoiceFromAI;
  confidence: number;
  suggestions: string[];
}

// ─── What the AI parser produces ─────────────────────────────────────────────

export interface ParsedInvoiceFromAI {
  invoiceNumber?: string;
  from?: InvoiceParty;
  to?: InvoiceParty;
  issueDate?: string;
  dueDate?: string;
  lineItems: LineItemInput[];
  taxRate?: number;
  discountAmount?: number;
  currency?: string;
  notes?: string;
}

// ─── Raw OpenAI function-call result (before validation) ─────────────────────

export interface RawAIInvoicePayload {
  client_name?: string;
  client_email?: string;
  client_company?: string;
  service_description?: string;
  amount?: number;
  quantity?: number;
  unit_price?: number;
  currency?: string;
  tax_rate?: number;
  due_days?: number;
  notes?: string;
  line_items?: Array<{
    description: string;
    quantity: number;
    unit_price: number;
  }>;
}