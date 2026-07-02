import prisma from "../../../config/prisma";
import type { CreateInvoiceBody, InvoiceDTO, UpdateInvoiceBody } from "./invoice.types";
import { resolveStatus } from "./invoice.status";
import { nanoid } from "nanoid";
import { Prisma } from "../../../generated/client";

/* ── Serializer — maps Prisma row + line items to InvoiceDTO ─────────────────
   fromParty/toParty are stored as Json in Prisma, cast here.
   Field names map: DB fromParty/toParty → frontend from/to            ──────── */
function toDTO(invoice: {
  id: string;
  invoiceNumber: string;
  status: string;
  source: string;
  fromParty: unknown;
  toParty: unknown;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes: string | null;
  clientId: string | null;
  createdAt: Date;
  updatedAt: Date;
  lineItems: {
    id: string;
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
}): InvoiceDTO {
  const status = resolveStatus(
    invoice.status as InvoiceDTO["status"],
    invoice.dueDate
  );

  return {
    id:             invoice.id,
    invoiceNumber:  invoice.invoiceNumber,
    status,
    source:         invoice.source as InvoiceDTO["source"],
    from:           invoice.fromParty as InvoiceDTO["from"],
    to:             invoice.toParty   as InvoiceDTO["to"],
    issueDate:      invoice.issueDate.toISOString().split("T")[0],
    dueDate:        invoice.dueDate.toISOString().split("T")[0],
    lineItems:      invoice.lineItems,
    subtotal:       invoice.subtotal,
    taxRate:        invoice.taxRate,
    taxAmount:      invoice.taxAmount,
    discountAmount: invoice.discountAmount,
    total:          invoice.total,
    currency:       invoice.currency,
    notes:          invoice.notes ?? undefined,
    clientId:       invoice.clientId ?? undefined,
    createdAt:      invoice.createdAt.toISOString(),
    updatedAt:      invoice.updatedAt.toISOString(),
  };
}

const INCLUDE_LINE_ITEMS = { lineItems: true } as const;

/* ── Generate a sequential invoice number ────────────────────────────────────
   Format: INV-{YEAR}-{6-char nanoid}. Simple and collision-resistant enough
   for MVP; replace with a DB sequence if strict sequential numbering matters. */
function generateInvoiceNumber(): string {
  const year = new Date().getFullYear();
  return `INV-${year}-${nanoid(6).toUpperCase()}`;
}

/* ── Create ─────────────────────────────────────────────────────────────────── */
export async function createInvoice(
  body: CreateInvoiceBody,
  organizationId: string,
  createdById?: string
): Promise<InvoiceDTO> {
  const invoice = await prisma.invoice.create({
    data: {
      invoiceNumber:  body.invoiceNumber ?? generateInvoiceNumber(),
      status:         body.status ?? "draft",
      source:         body.source ?? "manual",
      fromParty:      body.from as object,
      toParty:        body.to   as object,
      issueDate:      new Date(body.issueDate),
      dueDate:        new Date(body.dueDate),
      subtotal:       body.subtotal,
      taxRate:        body.taxRate,
      taxAmount:      body.taxAmount,
      discountAmount: body.discountAmount,
      total:          body.total,
      currency:       body.currency ?? "USD",
      notes:          body.notes,
      aiPrompt:       body.aiPrompt,
      aiConfidence:   body.aiConfidence,

      ...(body.promptRunId ? { promptRunId: body.promptRunId } : {}),

      organization:   { connect: { id: organizationId } },
      ...(body.clientId    ? { client:    { connect: { id: body.clientId    } } } : {}),
      ...(createdById      ? { createdBy: { connect: { id: createdById      } } } : {}),

      lineItems: {
        create: body.lineItems.map((li) => ({
          description: li.description,
          quantity:    li.quantity,
          unitPrice:   li.unitPrice,
          total:       li.total,
        })),
      },

    } as Prisma.InvoiceCreateInput,
    include: INCLUDE_LINE_ITEMS,
  });

  return toDTO(invoice);
}

/* ── List ────────────────────────────────────────────────────────────────────── */
export async function listInvoices(
  organizationId: string,
  filters?: {
    status?: string;
    clientId?: string;
  }
): Promise<InvoiceDTO[]> {
  const invoices = await prisma.invoice.findMany({
    where: {
      organizationId,
      ...(filters?.status   ? { status:   filters.status   as any } : {}),
      ...(filters?.clientId ? { clientId: filters.clientId }        : {}),
    },
    include: INCLUDE_LINE_ITEMS,
    orderBy: { createdAt: "desc" },
  });

  return invoices.map(toDTO);
}

/* ── Get one ─────────────────────────────────────────────────────────────────── */
export async function getInvoice(
  id: string,
  organizationId: string
): Promise<InvoiceDTO | null> {
  const invoice = await prisma.invoice.findFirst({
    where:   { id, organizationId },
    include: INCLUDE_LINE_ITEMS,
  });

  return invoice ? toDTO(invoice) : null;
}

/* ── Update ─────────────────────────────────────────────────────────────────── */
export async function updateInvoice(
  id: string,
  organizationId: string,
  body: UpdateInvoiceBody
): Promise<InvoiceDTO | null> {
  // Confirm invoice belongs to this org before updating
  const existing = await prisma.invoice.findFirst({ where: { id, organizationId } });
  if (!existing) return null;

  const invoice = await prisma.invoice.update({
    where: { id },
    data: {
      ...(body.status        ? { status:         body.status as any }    : {}),
      ...(body.from          ? { fromParty:       body.from as object }  : {}),
      ...(body.to            ? { toParty:         body.to   as object }  : {}),
      ...(body.issueDate     ? { issueDate:       new Date(body.issueDate) } : {}),
      ...(body.dueDate       ? { dueDate:         new Date(body.dueDate)   } : {}),
      ...(body.subtotal      !== undefined ? { subtotal:       body.subtotal }       : {}),
      ...(body.taxRate       !== undefined ? { taxRate:        body.taxRate }        : {}),
      ...(body.taxAmount     !== undefined ? { taxAmount:      body.taxAmount }      : {}),
      ...(body.discountAmount !== undefined ? { discountAmount: body.discountAmount } : {}),
      ...(body.total         !== undefined ? { total:          body.total }          : {}),
      ...(body.currency      ? { currency:        body.currency }         : {}),
      ...(body.notes         !== undefined ? { notes:          body.notes }          : {}),
      ...(body.clientId      ? { client: { connect: { id: body.clientId } } }       : {}),
      // Replace all line items on update
      ...(body.lineItems ? {
        lineItems: {
          deleteMany: {},
          create: body.lineItems.map((li) => ({
            description: li.description,
            quantity:    li.quantity,
            unitPrice:   li.unitPrice,
            total:       li.total,
          })),
        },
      } : {}),
    },
    include: INCLUDE_LINE_ITEMS,
  });

  return toDTO(invoice);
}

/* ── Delete ─────────────────────────────────────────────────────────────────── */
export async function deleteInvoice(
  id: string,
  organizationId: string
): Promise<boolean> {
  const existing = await prisma.invoice.findFirst({ where: { id, organizationId } });
  if (!existing) return false;

  await prisma.invoice.delete({ where: { id } });
  return true;
}

/* ── Mark as sent (status: draft → pending) ─────────────────────────────────── */
export async function markSent(
  id: string,
  organizationId: string
): Promise<InvoiceDTO | null> {
  const existing = await prisma.invoice.findFirst({ where: { id, organizationId } });
  if (!existing || existing.status !== "draft") return null;

  const invoice = await prisma.invoice.update({
    where:   { id },
    data:    { status: "pending" },
    include: INCLUDE_LINE_ITEMS,
  });

  return toDTO(invoice);
}