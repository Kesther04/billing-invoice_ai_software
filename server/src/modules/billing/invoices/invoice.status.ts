// src/modules/billing/invoices/invoice.status.ts

import type { InvoiceStatus } from "./invoice.types";

/**
 * Valid state transitions.
 * Prevents illegal moves (e.g. "paid" → "draft").
 */
const TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft:     ["pending", "cancelled"],
  pending:   ["paid", "overdue", "cancelled"],
  overdue:   ["paid", "cancelled"],
  paid:      [],             // terminal — no transitions allowed
  cancelled: [],             // terminal
};

export function canTransition(from: InvoiceStatus, to: InvoiceStatus): boolean {
  if (from === to) return true;
  return TRANSITIONS[from].includes(to);
}

export function assertTransition(from: InvoiceStatus, to: InvoiceStatus): void {
  if (!canTransition(from, to)) {
    const err = new Error(
      `Cannot transition invoice from "${from}" to "${to}"`
    ) as any;
    err.status = 422;
    throw err;
  }
}