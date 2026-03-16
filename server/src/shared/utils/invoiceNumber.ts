// src/shared/utils/invoiceNumber.ts

import { db } from "../database";

/**
 * Generates the next invoice number for an organisation.
 * Format: INV-{YEAR}-{NNNN}  e.g.  INV-2025-0042
 *
 * Runs in a serialisable transaction to prevent duplicate numbers
 * under concurrent requests.
 */
export async function generateInvoiceNumber(organizationId: string): Promise<string> {
  return db.$transaction(async (tx) => {
    const year = new Date().getFullYear();
    const prefix = `INV-${year}-`;

    // Find the highest existing number for this org in the current year
    const last = await tx.invoice.findFirst({
      where: {
        organizationId,
        invoiceNumber: { startsWith: prefix },
      },
      orderBy: { invoiceNumber: "desc" },
      select:  { invoiceNumber: true },
    });

    let seq = 1;
    if (last?.invoiceNumber) {
      const parts = last.invoiceNumber.split("-");
      const lastSeq = parseInt(parts[parts.length - 1], 10);
      if (!isNaN(lastSeq)) seq = lastSeq + 1;
    }

    return `${prefix}${String(seq).padStart(4, "0")}`;
  });
}