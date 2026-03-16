// src/modules/billing/ai/ai.service.ts

import OpenAI from "openai";
import { env } from "../../../config/env";
import { INVOICE_SYSTEM_PROMPT, EXTRACT_INVOICE_FUNCTION } from "./ai.prompt";
import { parseAIPayload } from "./ai.parser";
import type { GenerateInvoiceRequest, GenerateInvoiceResponse, RawAIInvoicePayload } from "./ai.types";
import type { ParsedInvoiceFromAI } from "./ai.types";
import type { InvoiceDTO } from "../invoices/invoice.types.ts";
import { invoiceService } from "../invoices/invoice.service";

// ─── OpenAI client (lazy singleton) ──────────────────────────────────────────

let _openai: OpenAI | null = null;

function getOpenAI(): OpenAI {
  if (!_openai) {
    _openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return _openai;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const aiService = {
  /**
   * Generate invoice data from a natural-language prompt.
   * Returns the parsed data WITHOUT persisting it — the frontend
   * previews the result and decides when to call saveGeneratedInvoice.
   */
  async generateFromPrompt(
    req: GenerateInvoiceRequest
  ): Promise<GenerateInvoiceResponse> {
    const sanitizedPrompt = sanitizePrompt(req.prompt);

    const completion = await getOpenAI().chat.completions.create({
      model:      env.OPENAI_MODEL ?? "gpt-4o-mini",
      max_tokens: 800,
      messages: [
        { role: "system",  content: INVOICE_SYSTEM_PROMPT },
        { role: "user",    content: sanitizedPrompt },
      ],
      tools: [
        {
          type:     "function",
          function: EXTRACT_INVOICE_FUNCTION,
        },
      ],
      tool_choice: { type: "function", function: { name: "extract_invoice_data" } },
    });

    const toolCall = completion.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall || toolCall.function.name !== "extract_invoice_data") {
      throw new Error("AI did not return expected function call");
    }

    let rawPayload: RawAIInvoicePayload;
    try {
      rawPayload = JSON.parse(toolCall.function.arguments) as RawAIInvoicePayload;
    } catch {
      throw new Error("Failed to parse AI response JSON");
    }

    const { parsed, confidence, suggestions } = parseAIPayload(rawPayload);

    return {
      invoice:     parsed,
      confidence,
      suggestions,
    };
  },

  /**
   * Persist an AI-generated invoice into the database.
   * Called after the user confirms/edits the preview.
   *
   * Merges the AI result with persisted org/user sender details,
   * attaches AI metadata, then delegates to invoice.service.create.
   */
  async saveGeneratedInvoice(params: {
    parsed:        ParsedInvoiceFromAI;
    prompt:        string;
    confidence:    number;
    suggestions:   string[];
    organizationId: string;
    createdById:   string;
    fromParty: {
      name:    string;
      email:   string;
      address?: string;
    };
  }): Promise<InvoiceDTO> {
    const {
      parsed,
      prompt,
      confidence,
      suggestions,
      organizationId,
      createdById,
      fromParty,
    } = params;

    return invoiceService.create({
      organizationId,
      createdById,
      input: {
        ...parsed,
        source:       "ai",
        from:         fromParty,
        aiPrompt:     prompt,
        aiConfidence: confidence,
        aiSuggestions: suggestions,
        // issueDate / dueDate / lineItems / taxRate / currency all come from parsed
      },
    });
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Basic prompt sanitisation — strips control characters and limits length
 * to protect against prompt injection and runaway costs.
 */
function sanitizePrompt(input: string): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, " ") // strip control chars
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1000);
}