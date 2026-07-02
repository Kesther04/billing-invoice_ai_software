import type { Prisma } from "../../../generated/client";

/* ── Mirrors the frontend Party interface ───────────────────────────────────── */
export interface Party {
  name?:    string;
  email?:   string;
  company?: string;
  address?: string;
}

/* ── Mirrors the frontend LineItem interface ────────────────────────────────── */
export interface LineItemInput {
  description: string;
  quantity:    number;
  unitPrice:   number;
  total:       number;
}

/* ── What the client sends when creating/updating an invoice ────────────────── */
export interface CreateInvoiceBody {
  invoiceNumber?:  string;
  status?:         "draft" | "pending" | "paid" | "overdue" | "cancelled";
  from:            Party;
  to:              Party;
  issueDate:       string;
  dueDate:         string;
  lineItems:       LineItemInput[];
  subtotal:        number;
  taxRate:         number;
  taxAmount:       number;
  discountAmount:  number;
  total:           number;
  currency?:       string;
  notes?:          string;
  // AI metadata — only present when source = ai
  source?:         "manual" | "ai";
  aiPrompt?:       string;
  aiConfidence?:   number;
  promptRunId?:    string;
  clientId?:       string;
}

export type UpdateInvoiceBody = Partial<CreateInvoiceBody>;

/* ── What the API returns for an invoice (maps DB → frontend Invoice) ────────── */
export interface InvoiceDTO {
  id:             string;
  invoiceNumber:  string;
  status:         "draft" | "pending" | "paid" | "overdue" | "cancelled";
  source:         "manual" | "ai";
  from:           Party;
  to:             Party;
  issueDate:      string;
  dueDate:        string;
  lineItems:      (LineItemInput & { id: string })[];
  subtotal:       number;
  taxRate:        number;
  taxAmount:      number;
  discountAmount: number;
  total:          number;
  currency:       string;
  notes?:         string;
  clientId?:      string;
  createdAt:      string;
  updatedAt:      string;
}

/* ── Prisma input alias ─────────────────────────────────────────────────────── */
export type InvoiceCreateInput = Prisma.InvoiceCreateInput;
export type InvoiceUpdateInput = Prisma.InvoiceUpdateInput;