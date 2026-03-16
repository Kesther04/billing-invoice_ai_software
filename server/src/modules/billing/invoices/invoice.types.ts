// src/modules/billing/invoices/invoice.types.ts

// import type { Invoice as PrismaInvoice, LineItem as PrismaLineItem } from "@prisma/client";

// ─── Status / Source enums (mirror Prisma enums as plain strings) ─────────────

export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";
export type InvoiceSource = "manual" | "ai";

// ─── Party ────────────────────────────────────────────────────────────────────

export interface InvoiceParty {
  name?: string;
  email?: string;
  address?: string;
  phone?: string;
  company?: string;
}

// ─── Line items ───────────────────────────────────────────────────────────────

export interface LineItemInput {
  id?: string;           // optional — generated if missing
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface LineItemDTO {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// ─── Create / Update payloads ────────────────────────────────────────────────

export interface CreateInvoiceInput {
  invoiceNumber?: string;  // auto-generated if missing
  status?: InvoiceStatus;
  source?: InvoiceSource;
  from: InvoiceParty;
  to: InvoiceParty;
  issueDate: string;       // ISO date string "YYYY-MM-DD"
  dueDate: string;
  lineItems: LineItemInput[];
  taxRate?: number;
  discountAmount?: number;
  currency?: string;
  notes?: string;
  clientId?: string;

  // AI metadata — set internally by ai.service, not from HTTP body
  aiPrompt?: string;
  aiConfidence?: number;
  aiSuggestions?: string[];
}

export interface UpdateInvoiceInput {
  invoiceNumber?: string;
  status?: InvoiceStatus;
  from?: InvoiceParty;
  to?: InvoiceParty;
  issueDate?: string;
  dueDate?: string;
  lineItems?: LineItemInput[];
  taxRate?: number;
  discountAmount?: number;
  currency?: string;
  notes?: string;
  clientId?: string;
}

// ─── Response DTO (safe to return to frontend) ───────────────────────────────

export interface InvoiceDTO {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  source: InvoiceSource;
  from: InvoiceParty;
  to: InvoiceParty;
  issueDate: string;
  dueDate: string;
  lineItems: LineItemDTO[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string;
  clientId?: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── List filters ─────────────────────────────────────────────────────────────

export interface InvoiceListFilters {
  status?: InvoiceStatus;
  clientId?: string;
  search?: string;         // searches invoiceNumber, to-party name/company
  from?: string;           // ISO date
  to?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedInvoices {
  data: InvoiceDTO[];
  total: number;
  page: number;
  limit: number;
}