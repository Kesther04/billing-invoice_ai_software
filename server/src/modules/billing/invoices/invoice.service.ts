import * as invoiceRepository from "./invoice.repository";
import { isValidTransition, isTerminal } from "./invoice.status";
import type {
  CreateInvoiceBody,
  InvoiceDTO,
  UpdateInvoiceBody,
} from "./invoice.types";

/* ── Create invoice ─────────────────────────────────────────────────────────── */
export async function createInvoice(
  body: CreateInvoiceBody,
  organizationId: string,
  createdById?: string
): Promise<InvoiceDTO> {
  validateCreateBody(body);
  return invoiceRepository.createInvoice(body, organizationId, createdById);
}

/* ── List invoices ───────────────────────────────────────────────────────────── */
export async function listInvoices(
  organizationId: string,
  filters?: { status?: string; clientId?: string }
): Promise<InvoiceDTO[]> {
  return invoiceRepository.listInvoices(organizationId, filters);
}

/* ── Get single invoice ──────────────────────────────────────────────────────── */
export async function getInvoice(
  id: string,
  organizationId: string
): Promise<InvoiceDTO> {
  const invoice = await invoiceRepository.getInvoice(id, organizationId);
  if (!invoice) throw new NotFoundError("Invoice not found");
  return invoice;
}

/* ── Update invoice ──────────────────────────────────────────────────────────── */
export async function updateInvoice(
  id: string,
  organizationId: string,
  body: UpdateInvoiceBody
): Promise<InvoiceDTO> {
  const existing = await invoiceRepository.getInvoice(id, organizationId);
  if (!existing) throw new NotFoundError("Invoice not found");

  if (isTerminal(existing.status)) {
    throw new ValidationError(
      `Invoice is ${existing.status} and cannot be modified`
    );
  }

  // Validate status transition if status is being changed
  if (body.status && body.status !== existing.status) {
    if (!isValidTransition(existing.status, body.status)) {
      throw new ValidationError(
        `Cannot transition invoice from "${existing.status}" to "${body.status}"`
      );
    }
  }

  const updated = await invoiceRepository.updateInvoice(id, organizationId, body);
  if (!updated) throw new NotFoundError("Invoice not found");
  return updated;
}

/* ── Delete invoice ──────────────────────────────────────────────────────────── */
export async function deleteInvoice(
  id: string,
  organizationId: string
): Promise<void> {
  const existing = await invoiceRepository.getInvoice(id, organizationId);
  if (!existing) throw new NotFoundError("Invoice not found");

  if (isTerminal(existing.status)) {
    throw new ValidationError(
      `Cannot delete a ${existing.status} invoice`
    );
  }

  await invoiceRepository.deleteInvoice(id, organizationId);
}

/* ── Send invoice ────────────────────────────────────────────────────────────── *
   Marks the invoice as sent (draft → pending), generates a Paystack
   payment link, and emails it to the client.
   Paystack link generation and email sending are stubbed for Layer 1 —
   the status transition and response are real, the side effects are TODO.  */
export async function sendInvoice(
  id: string,
  organizationId: string
): Promise<InvoiceDTO> {
  const existing = await invoiceRepository.getInvoice(id, organizationId);
  if (!existing) throw new NotFoundError("Invoice not found");

  if (existing.status !== "draft") {
    throw new ValidationError(
      `Only draft invoices can be sent. This invoice is "${existing.status}"`
    );
  }

  // TODO Layer 2: generate Paystack payment link and attach to invoice
  // const paymentLink = await paystackService.createPaymentLink(existing);

  // TODO Layer 2: send email to existing.to.email with invoice + payment link
  // await emailService.sendInvoice(existing, paymentLink);

  const sent = await invoiceRepository.markSent(id, organizationId);
  if (!sent) throw new NotFoundError("Invoice not found");
  return sent;
}

/* ── Validation helpers ──────────────────────────────────────────────────────── */
function validateCreateBody(body: CreateInvoiceBody): void {
  if (!body.from) throw new ValidationError("from (sender) is required");
  if (!body.to)   throw new ValidationError("to (recipient) is required");
  if (!body.issueDate) throw new ValidationError("issueDate is required");
  if (!body.dueDate)   throw new ValidationError("dueDate is required");
  if (!body.lineItems || body.lineItems.length === 0) {
    throw new ValidationError("At least one line item is required");
  }
  if (new Date(body.dueDate) < new Date(body.issueDate)) {
    throw new ValidationError("dueDate cannot be before issueDate");
  }
}

/* ── Typed errors ────────────────────────────────────────────────────────────── */
export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}