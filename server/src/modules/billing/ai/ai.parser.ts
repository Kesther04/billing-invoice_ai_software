// src/modules/billing/ai/ai.parser.ts

import { nanoid } from "nanoid";
import type { RawAIInvoicePayload, ParsedInvoiceFromAI } from "./ai.types";
import type { LineItemInput } from "../invoices/invoice.types";

/**
 * Converts the raw JSON payload returned by OpenAI's function-call into
 * a clean ParsedInvoiceFromAI that the ai.service can persist.
 *
 * Also returns a confidence score (0–1) based on how many fields were
 * successfully extracted.
 */
export function parseAIPayload(raw: RawAIInvoicePayload): {
  parsed: ParsedInvoiceFromAI;
  confidence: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let filledFields = 0;
  const totalFields = 6; // client, service, amount, currency, tax, due

  // ── Client party ────────────────────────────────────────────────────────────
  const to = {
    name:    raw.client_name    ?? "Client",
    email:   raw.client_email,
    company: raw.client_company,
  };
  if (raw.client_name)    filledFields++;
  if (!raw.client_email)  suggestions.push("Add a client email so reminders can be sent");
  if (!raw.client_company) suggestions.push("Consider adding a company name for formal invoices");

  // ── Line items ──────────────────────────────────────────────────────────────
  let lineItems: LineItemInput[];

  if (raw.line_items && raw.line_items.length > 0) {
    lineItems = raw.line_items.map((li) => ({
      id:          nanoid(),
      description: li.description,
      quantity:    li.quantity,
      unitPrice:   li.unit_price,
    }));
    filledFields++;
  } else if (raw.amount && raw.service_description) {
    // Single lump-sum — wrap in one line item
    lineItems = [
      {
        id:          nanoid(),
        description: raw.service_description,
        quantity:    raw.quantity ?? 1,
        unitPrice:   raw.unit_price ?? raw.amount,
      },
    ];
    filledFields++;
  } else if (raw.amount) {
    lineItems = [
      {
        id:          nanoid(),
        description: "Professional Services",
        quantity:    1,
        unitPrice:   raw.amount,
      },
    ];
    suggestions.push("Add a description for the service rendered");
  } else {
    lineItems = [];
    suggestions.push("No amount was detected — please add line items manually");
  }

  // ── Dates ────────────────────────────────────────────────────────────────────
  const today = new Date();
  const dueDays = raw.due_days ?? 30;
  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + dueDays);
  filledFields++;

  // ── Currency / tax ───────────────────────────────────────────────────────────
  const currency = raw.currency ?? "USD";
  const taxRate  = raw.tax_rate ?? 0;
  if (raw.currency) filledFields++;
  if (raw.tax_rate !== undefined) filledFields++;

  const parsed: ParsedInvoiceFromAI = {
    to,
    from: undefined,           // populated by ai.service with org/user data
    issueDate: today.toISOString().split("T")[0],
    dueDate:   dueDate.toISOString().split("T")[0],
    lineItems,
    taxRate,
    discountAmount: 0,
    currency,
    notes: raw.notes,
  };

  const confidence = Math.min(filledFields / totalFields, 1);

  return { parsed, confidence, suggestions };
}