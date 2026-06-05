import { nanoid } from "nanoid";
import type { RawAIInvoicePayload, ParsedInvoiceFromAI, GenerateInvoiceRequest } from "./ai.types";
import type { LineItemInput } from "../invoices/invoice.types";

export function parseAIPayload(
  raw: RawAIInvoicePayload,
  fromParty: GenerateInvoiceRequest["fromParty"]  // ← receive from caller
): {
  parsed: ParsedInvoiceFromAI;
  confidence: number;
  suggestions: string[];
} {
  const suggestions: string[] = [];
  let filledFields = 0;
  const totalFields = 6;

  // ── To (client) ──────────────────────────────────────────────────────────────
  const to = {
    name:    raw.client_name    ?? "Client",
    email:   raw.client_email   ?? undefined,
    company: raw.client_company ?? undefined,
    address: raw.client_address ?? undefined,  // ← new
    phone:   raw.client_phone   ?? undefined,  // ← new
  };
  if (raw.client_name)     filledFields++;
  if (!raw.client_email)   suggestions.push("Add a client email so reminders can be sent");
  if (!raw.client_company) suggestions.push("Consider adding a company name for formal invoices");

  // ── From (sender — from auth middleware) ─────────────────────────────────────
  const from = {
    name:    fromParty.name,
    email:   fromParty.email,
    company: fromParty.organizationName,
  };

  // ── Line items ───────────────────────────────────────────────────────────────
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
    lineItems = [{
      id:          nanoid(),
      description: raw.service_description,
      quantity:    raw.quantity ?? 1,
      unitPrice:   raw.unit_price ?? raw.amount,
    }];
    filledFields++;
  } else if (raw.amount) {
    lineItems = [{
      id:          nanoid(),
      description: "Professional Services",
      quantity:    1,
      unitPrice:   raw.amount,
    }];
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
  if (raw.currency)              filledFields++;
  if (raw.tax_rate !== undefined) filledFields++;

  const parsed: ParsedInvoiceFromAI = {
    to,
    from,                                        // ← now populated from auth
    issueDate: today.toISOString().split("T")[0],
    dueDate:   dueDate.toISOString().split("T")[0],
    lineItems,
    taxRate,
    discountAmount: 0,
    currency,
    notes: raw.notes ?? undefined,
  };

  const confidence = Math.min(filledFields / totalFields, 1);
  return { parsed, confidence, suggestions };
}