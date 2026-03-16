// src/shared/utils/calculateTotals.ts

interface LineItemLike {
  quantity:  number;
  unitPrice: number;
  total?:    number;
}

interface TotalsInput {
  lineItems:      LineItemLike[];
  taxRate:        number;    // percentage, e.g. 10 = 10%
  discountAmount: number;
}

interface Totals {
  subtotal:  number;
  taxAmount: number;
  total:     number;
}

/**
 * Canonical totals calculator used by both invoice.service and ai.service.
 * Rounds to 2 decimal places to avoid floating-point drift.
 */
export function calculateTotals(input: TotalsInput): Totals {
  const subtotal = round(
    input.lineItems.reduce(
      (sum, li) => sum + (li.total ?? li.quantity * li.unitPrice),
      0
    )
  );

  const taxAmount = round(subtotal * (input.taxRate / 100));
  const total     = round(subtotal + taxAmount - input.discountAmount);

  return { subtotal, taxAmount, total };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}