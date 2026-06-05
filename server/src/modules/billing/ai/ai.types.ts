// src/modules/billing/ai/ai.types.ts

import type { InvoiceParty, LineItemInput } from "../invoices/invoice.types";

// ─── Request / Response shapes ────────────────────────────────────────────────

export interface GenerateInvoiceRequest {
  prompt: string;
  fromParty: {          // ← add — populated from auth middleware
    name: string;
    email: string;
    organizationName: string;
  };
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
  client_name?:        string | null;
  client_email?:       string | null;
  client_company?:     string | null;
  client_address?:     string | null;  // ← add
  client_phone?:       string | null;  // ← add
  service_description?: string | null;
  amount?:             number | null;
  quantity?:           number | null;
  unit_price?:         number | null;
  line_items?:         { description: string; quantity: number; unit_price: number }[] | null;
  currency?:           string | null;
  tax_rate?:           number | null;
  due_days?:           number | null;
  notes?:              string | null;
}
