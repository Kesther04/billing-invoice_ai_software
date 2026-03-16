// src/modules/billing/invoices/invoice.service.ts

import { nanoid } from "nanoid";
import { invoiceRepository } from "./invoice.repository";
import { generateInvoiceNumber } from "../../../shared/utils/invoiceNumber";
import { calculateTotals } from "../../../shared/utils/calculateTotals";
import type {
  CreateInvoiceInput,
  UpdateInvoiceInput,
  InvoiceDTO,
  InvoiceListFilters,
  PaginatedInvoices,
  LineItemDTO,
  InvoiceParty,
} from "./invoice.types";

// ─── Mapper ────────────────────────────────────────────────────────────────────

function toDTO(prismaInvoice: any): InvoiceDTO {
  return {
    id:             prismaInvoice.id,
    invoiceNumber:  prismaInvoice.invoiceNumber,
    status:         prismaInvoice.status,
    source:         prismaInvoice.source,
    from:           prismaInvoice.fromParty as InvoiceParty,
    to:             prismaInvoice.toParty   as InvoiceParty,
    issueDate:      prismaInvoice.issueDate.toISOString().split("T")[0],
    dueDate:        prismaInvoice.dueDate.toISOString().split("T")[0],
    lineItems:      prismaInvoice.lineItems.map((li: any): LineItemDTO => ({
      id:          li.id,
      description: li.description,
      quantity:    li.quantity,
      unitPrice:   li.unitPrice,
      total:       li.total,
    })),
    subtotal:       prismaInvoice.subtotal,
    taxRate:        prismaInvoice.taxRate,
    taxAmount:      prismaInvoice.taxAmount,
    discountAmount: prismaInvoice.discountAmount,
    total:          prismaInvoice.total,
    currency:       prismaInvoice.currency,
    notes:          prismaInvoice.notes ?? undefined,
    clientId:       prismaInvoice.clientId ?? undefined,
    organizationId: prismaInvoice.organizationId,
    createdAt:      prismaInvoice.createdAt.toISOString(),
    updatedAt:      prismaInvoice.updatedAt.toISOString(),
  };
}

// ─── Service ───────────────────────────────────────────────────────────────────

export const invoiceService = {
  /**
   * Create a new invoice — works for BOTH manual and AI-generated invoices.
   * ai.service calls this after generation; the invoice controller calls it
   * for manual creation. The `source` field distinguishes them.
   */
  async create(params: {
    organizationId: string;
    createdById?:   string;
    input:          CreateInvoiceInput & {
      source?:        "manual" | "ai";
      aiPrompt?:      string;
      aiConfidence?:  number;
      aiSuggestions?: string[];
    };
  }): Promise<InvoiceDTO> {
    const { organizationId, createdById, input } = params;

    // ── Resolve invoice number ──────────────────────────────────────────────
    const invoiceNumber =
      input.invoiceNumber?.trim() ||
      (await generateInvoiceNumber(organizationId));

    // ── Build line items with guaranteed IDs ────────────────────────────────
    const lineItems = (input.lineItems ?? []).map((li) => ({
      description: li.description,
      quantity:    li.quantity,
      unitPrice:   li.unitPrice,
      total:       li.quantity * li.unitPrice,
    }));

    // ── Calculate totals ────────────────────────────────────────────────────
    const { subtotal, taxAmount, total } = calculateTotals({
      lineItems,
      taxRate:        input.taxRate ?? 0,
      discountAmount: input.discountAmount ?? 0,
    });

    // ── Persist ─────────────────────────────────────────────────────────────
    const record = await invoiceRepository.create({
      invoiceNumber,
      status:         input.status ?? "draft",
      source:         input.source ?? "manual",
      fromParty:      input.from as object,
      toParty:        input.to   as object,
      issueDate:      new Date(input.issueDate),
      dueDate:        new Date(input.dueDate),
      subtotal,
      taxRate:        input.taxRate        ?? 0,
      taxAmount,
      discountAmount: input.discountAmount ?? 0,
      total,
      currency:       input.currency ?? "USD",
      notes:          input.notes,
      organizationId,
      clientId:       input.clientId,
      createdById,
      aiPrompt:       input.aiPrompt,
      aiConfidence:   input.aiConfidence,
      aiSuggestions:  input.aiSuggestions
                        ? JSON.parse(JSON.stringify(input.aiSuggestions))
                        : undefined,
      lineItems,
    });

    return toDTO(record);
  },

  // ── Read ─────────────────────────────────────────────────────────────────────

  async getById(id: string, organizationId: string): Promise<InvoiceDTO> {
    const record = await invoiceRepository.findById(id, organizationId);
    if (!record) {
      const err = new Error("Invoice not found") as any;
      err.status = 404;
      throw err;
    }
    return toDTO(record);
  },

  async list(
    organizationId: string,
    filters: InvoiceListFilters
  ): Promise<PaginatedInvoices> {
    const { data, total } = await invoiceRepository.findMany(organizationId, filters);
    return {
      data:  data.map(toDTO),
      total,
      page:  filters.page  ?? 1,
      limit: filters.limit ?? 20,
    };
  },

  // ── Update ───────────────────────────────────────────────────────────────────

  async update(
    id: string,
    organizationId: string,
    input: UpdateInvoiceInput
  ): Promise<InvoiceDTO> {
    // Ensure the invoice exists and belongs to this org
    const existing = await invoiceRepository.findById(id, organizationId);
    if (!existing) {
      const err = new Error("Invoice not found") as any;
      err.status = 404;
      throw err;
    }

    // Recalculate totals if line items or rates changed
    let financials: {
      subtotal?: number;
      taxAmount?: number;
      total?: number;
    } = {};

    let dbLineItems:
      | Array<{ description: string; quantity: number; unitPrice: number; total: number }>
      | undefined;

    if (input.lineItems) {
      dbLineItems = input.lineItems.map((li) => ({
        description: li.description,
        quantity:    li.quantity,
        unitPrice:   li.unitPrice,
        total:       li.quantity * li.unitPrice,
      }));

      const taxRate        = input.taxRate        ?? existing.taxRate;
      const discountAmount = input.discountAmount ?? existing.discountAmount;

      const totals = calculateTotals({ lineItems: dbLineItems, taxRate, discountAmount });
      financials = totals;
    }

    const record = await invoiceRepository.update(
      id,
      organizationId,
      {
        ...(input.invoiceNumber && { invoiceNumber: input.invoiceNumber }),
        ...(input.status        && { status:        input.status }),
        ...(input.from          && { fromParty:      input.from as object }),
        ...(input.to            && { toParty:        input.to   as object }),
        ...(input.issueDate     && { issueDate:      new Date(input.issueDate) }),
        ...(input.dueDate       && { dueDate:        new Date(input.dueDate) }),
        ...(input.currency      && { currency:       input.currency }),
        ...(input.notes !== undefined && { notes:    input.notes }),
        ...(input.taxRate       !== undefined && { taxRate:        input.taxRate }),
        ...(input.discountAmount !== undefined && { discountAmount: input.discountAmount }),
        ...financials,
        ...(input.clientId !== undefined && { clientId: input.clientId }),
      },
      dbLineItems
    );

    return toDTO(record);
  },

  // ── Delete ───────────────────────────────────────────────────────────────────

  async delete(id: string, organizationId: string): Promise<void> {
    const existing = await invoiceRepository.findById(id, organizationId);
    if (!existing) {
      const err = new Error("Invoice not found") as any;
      err.status = 404;
      throw err;
    }
    await invoiceRepository.delete(id, organizationId);
  },

  // ── Summary ──────────────────────────────────────────────────────────────────

  async getStatusSummary(organizationId: string) {
    return invoiceRepository.getStatusSummary(organizationId);
  },
};