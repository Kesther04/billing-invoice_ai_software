// src/modules/billing/invoices/invoice.repository.ts

import { db } from "../../../shared/database";
import type { InvoiceStatus, InvoiceSource, InvoiceListFilters } from "./invoice.types";
import type { Prisma } from "../../../generated/client";

// Full include shape used everywhere
const INVOICE_INCLUDE = {
  lineItems: true,
} satisfies Prisma.InvoiceInclude;

export const invoiceRepository = {
  // ── Create ──────────────────────────────────────────────────────────────────

  async create(data: {
    invoiceNumber:  string;
    status:         InvoiceStatus;
    source:         InvoiceSource;
    fromParty:      Prisma.InputJsonValue;
    toParty:        Prisma.InputJsonValue;
    issueDate:      Date;
    dueDate:        Date;
    subtotal:       number;
    taxRate:        number;
    taxAmount:      number;
    discountAmount: number;
    total:          number;
    currency:       string;
    notes?:         string;
    organizationId: string;
    clientId?:      string;
    createdById?:   string;
    aiPrompt?:      string;
    aiConfidence?:  number;
    aiSuggestions?: Prisma.InputJsonValue;
    lineItems: Array<{
      description: string;
      quantity:    number;
      unitPrice:   number;
      total:       number;
    }>;
  }) {
    const { lineItems, ...invoiceData } = data;

    return db.invoice.create({
      data: {
        ...invoiceData,
        lineItems: {
          create: lineItems,
        },
      },
      include: INVOICE_INCLUDE,
    });
  },

  // ── Find one ─────────────────────────────────────────────────────────────────

  async findById(id: string, organizationId: string) {
    return db.invoice.findFirst({
      where:   { id, organizationId },
      include: INVOICE_INCLUDE,
    });
  },

  // ── List with filters ────────────────────────────────────────────────────────

  async findMany(organizationId: string, filters: InvoiceListFilters) {
    const {
      status,
      clientId,
      search,
      from,
      to,
      page  = 1,
      limit = 20,
    } = filters;

    const where: Prisma.InvoiceWhereInput = {
      organizationId,
      ...(status   && { status }),
      ...(clientId && { clientId }),
      ...(from     && { issueDate: { gte: new Date(from) } }),
      ...(to       && { dueDate:   { lte: new Date(to) } }),
      ...(search && {
        OR: [
          { invoiceNumber: { contains: search, mode: "insensitive" } },
          // JSON field search — works on Postgres jsonb
          {
            toParty: {
              path:       ["name"],
              string_contains: search,
            },
          },
          {
            toParty: {
              path:       ["company"],
              string_contains: search,
            },
          },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      db.invoice.findMany({
        where,
        include:  INVOICE_INCLUDE,
        orderBy:  { createdAt: "desc" },
        skip:     (page - 1) * limit,
        take:     limit,
      }),
      db.invoice.count({ where }),
    ]);

    return { data, total };
  },

  // ── Update ───────────────────────────────────────────────────────────────────

  async update(
    id: string,
    organizationId: string,
    data: {
      invoiceNumber?:  string;
      status?:         InvoiceStatus;
      fromParty?:      Prisma.InputJsonValue;
      toParty?:        Prisma.InputJsonValue;
      issueDate?:      Date;
      dueDate?:        Date;
      subtotal?:       number;
      taxRate?:        number;
      taxAmount?:      number;
      discountAmount?: number;
      total?:          number;
      currency?:       string;
      notes?:          string;
      clientId?:       string;
    },
    lineItems?: Array<{
      description: string;
      quantity:    number;
      unitPrice:   number;
      total:       number;
    }>
  ) {
    // When line items are provided, delete existing and recreate
    // (cleanest strategy for a small set of items)
    return db.$transaction(async (tx) => {
      if (lineItems) {
        await tx.lineItem.deleteMany({ where: { invoiceId: id } });
      }

      return tx.invoice.update({
        where: { id, organizationId },
        data: {
          ...data,
          updatedAt: new Date(),
          ...(lineItems && {
            lineItems: {
              create: lineItems,
            },
          }),
        },
        include: INVOICE_INCLUDE,
      });
    });
  },

  // ── Delete ───────────────────────────────────────────────────────────────────

  async delete(id: string, organizationId: string) {
    return db.invoice.delete({
      where: { id, organizationId },
    });
  },

  // ── Status summary ───────────────────────────────────────────────────────────

  async getStatusSummary(organizationId: string) {
    const rows = await db.invoice.groupBy({
      by:      ["status"],
      where:   { organizationId },
      _count:  { _all: true },
      _sum:    { total: true },
    });

    return rows.map((r) => ({
      status: r.status,
      count:  r._count._all,
      total:  r._sum.total ?? 0,
    }));
  },
};