type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

/* Valid transitions from each status.
   Keeps the service from having to reason about this inline. */
const VALID_TRANSITIONS: Record<InvoiceStatus, InvoiceStatus[]> = {
  draft:     ["pending", "cancelled"],
  pending:   ["paid", "overdue", "cancelled"],
  overdue:   ["paid", "cancelled"],
  paid:      [],                              // terminal — no further transitions
  cancelled: [],                              // terminal
};

export function isValidTransition(
  from: InvoiceStatus,
  to: InvoiceStatus
): boolean {
  return VALID_TRANSITIONS[from]?.includes(to) ?? false;
}

/**
 * Computes the effective status for an invoice based on its due date.
 * Called on read to auto-detect overdue invoices without a background job.
 * Only upgrades "pending" → "overdue"; never modifies paid/cancelled.
 */
export function resolveStatus(
  status: InvoiceStatus,
  dueDate: Date
): InvoiceStatus {
  if (status === "pending" && dueDate < new Date()) {
    return "overdue";
  }
  return status;
}

export function isTerminal(status: InvoiceStatus): boolean {
  return status === "paid" || status === "cancelled";
}