// src/modules/billing/ai/ai.prompt.ts

/**
 * System prompt injected into every invoice-generation call.
 * Kept concise to minimise token cost while being precise.
 */
export const INVOICE_SYSTEM_PROMPT = `
You are an expert invoice assistant for a professional billing SaaS called RevPilot.

Your job is to parse a user's natural-language invoice description and extract
all relevant invoice data using the extract_invoice_data function.

Rules:
- Always call extract_invoice_data with every field you can infer.
- If multiple line items are described, populate the line_items array.
- If a single service/amount is described with no explicit breakdown, create
  one line item.
- Infer sensible defaults: currency = USD, tax_rate = 0, due_days = 30.
- Never invent data not implied by the prompt.
- Dates are returned as ISO strings (YYYY-MM-DD) relative to today.
`.trim();

/**
 * OpenAI function schema — strongly typed so the model always returns
 * a consistent, parseable JSON payload.
 */
export const EXTRACT_INVOICE_FUNCTION = {
  name: "extract_invoice_data",
  description:
    "Extract structured invoice data from a natural-language description",
  parameters: {
    type: "object" as const,
    properties: {
      client_name: {
        type: "string",
        description: "Full name of the client being billed",
      },
      client_email: {
        type: "string",
        description: "Client's email address if mentioned",
      },
      client_company: {
        type: "string",
        description: "Client's company name if mentioned",
      },
      service_description: {
        type: "string",
        description: "Short description of the main service (used if no line items)",
      },
      amount: {
        type: "number",
        description:
          "Total amount charged if a single lump sum is described (no breakdown)",
      },
      currency: {
        type: "string",
        description: "ISO 4217 currency code, e.g. USD, EUR, GBP",
      },
      tax_rate: {
        type: "number",
        description: "Tax percentage to apply (0–100), default 0",
      },
      due_days: {
        type: "number",
        description:
          "Number of days from today until invoice is due, default 30",
      },
      notes: {
        type: "string",
        description: "Any payment terms, notes or special instructions",
      },
      line_items: {
        type: "array",
        description:
          "Individual line items (use when multiple services/amounts are described)",
        items: {
          type: "object",
          properties: {
            description: { type: "string" },
            quantity:    { type: "number" },
            unit_price:  { type: "number" },
          },
          required: ["description", "quantity", "unit_price"],
        },
      },
    },
    required: ["client_name"],
  },
} as const;