import type { Prisma } from "../../../generated/client";

/* ── Request shape from the frontend ───────────────────────────────────────── */
export interface GenerateInvoiceRequest {
  prompt: string;
}

/* ── What the parser returns — a structured draft matching the frontend
   Invoice shape, before it's been saved to the DB ──────────────────────────── */
export interface ParsedInvoiceDraft {
  invoiceNumber?: string;
  fromParty: {
    name?: string;
    email?: string;
    company?: string;
    address?: string;
  };
  toParty: {
    name?: string;
    email?: string;
    company?: string;
    address?: string;
  };
  issueDate?: string;       // ISO date string
  dueDate?: string;         // ISO date string
  lineItems: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string;
  aiConfidence?: number;
}

/* ── What the generate endpoint returns to the frontend ─────────────────────── */
export interface GenerateInvoiceResponse {
  draft: ParsedInvoiceDraft;
  promptRunId: string;      // so the frontend can link the saved invoice back
}

/* ── PromptRun as returned from the DB (serialized for the API) ─────────────── */
export interface PromptRunDTO {
  id: string;
  prompt: string;
  status: "success" | "error";
  draft?: ParsedInvoiceDraft;
  error?: string;
  createdAt: string;
}

/* ── Prisma create input alias ───────────────────────────────────────────────── */
export type PromptRunCreateInput = Prisma.PromptRunCreateInput;