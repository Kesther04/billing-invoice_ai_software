import type { ParsedInvoiceDraft } from "./ai.types";

export class ParseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ParseError";
  }
}

/**
 * Strips markdown code fences if the LLM wrapped the JSON in them,
 * then parses and validates the structure.
 */
export function parseAIResponse(raw: string): ParsedInvoiceDraft {
  // Strip ```json ... ``` or ``` ... ``` fences
  const cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new ParseError(
      "AI returned a response that couldn't be parsed as JSON. Try rephrasing your prompt."
    );
  }

  // Validate required fields
  if (!parsed.lineItems || !Array.isArray(parsed.lineItems)) {
    throw new ParseError(
      "AI couldn't identify any line items in your prompt. Try being more specific about what work was done."
    );
  }

  if ((parsed.lineItems as unknown[]).length === 0) {
    throw new ParseError(
      "AI found no billable items in your prompt. Describe the work and amount to be invoiced."
    );
  }

  // Normalise nulls to undefined to match frontend Partial<Invoice> expectations
  const normalize = (val: unknown) => (val === null ? undefined : val);

  const lineItems = (parsed.lineItems as Record<string, unknown>[]).map((li) => ({
    description: String(li.description ?? ""),
    quantity:    Number(li.quantity ?? 1),
    unitPrice:   Number(li.unitPrice ?? 0),
    total:       Number(li.total ?? 0),
  }));

  const subtotal       = Number(parsed.subtotal ?? 0);
  const taxRate        = Number(parsed.taxRate ?? 0);
  const taxAmount      = Number(parsed.taxAmount ?? 0);
  const discountAmount = Number(parsed.discountAmount ?? 0);
  const total          = Number(parsed.total ?? subtotal + taxAmount - discountAmount);

  const fromParty = (parsed.fromParty ?? {}) as Record<string, unknown>;
  const toParty   = (parsed.toParty ?? {})   as Record<string, unknown>;

  return {
    fromParty: {
      name:    normalize(fromParty.name)    as string | undefined,
      email:   normalize(fromParty.email)   as string | undefined,
      company: normalize(fromParty.company) as string | undefined,
      address: normalize(fromParty.address) as string | undefined,
    },
    toParty: {
      name:    normalize(toParty.name)    as string | undefined,
      email:   normalize(toParty.email)   as string | undefined,
      company: normalize(toParty.company) as string | undefined,
      address: normalize(toParty.address) as string | undefined,
    },
    lineItems,
    subtotal,
    taxRate,
    taxAmount,
    discountAmount,
    total,
    currency:      String(parsed.currency ?? "USD"),
    issueDate:     normalize(parsed.issueDate)   as string | undefined,
    dueDate:       normalize(parsed.dueDate)     as string | undefined,
    notes:         normalize(parsed.notes)       as string | undefined,
    aiConfidence:  Number(parsed.aiConfidence ?? 0.8),
  };
}