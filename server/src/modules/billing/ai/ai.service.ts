import Groq from "groq-sdk";
import { env } from "../../../config/env";
import { INVOICE_SYSTEM_PROMPT } from "./ai.prompt";
import { parseAIPayload } from "./ai.parser";
import type { GenerateInvoiceRequest, GenerateInvoiceResponse, RawAIInvoicePayload } from "./ai.types";
import type { ParsedInvoiceFromAI } from "./ai.types";
import type { InvoiceDTO } from "../invoices/invoice.types.ts";
import { invoiceService } from "../invoices/invoice.service";

// ─── Groq client (lazy singleton) ─────────────────────────────────────────────

let _groq: Groq | null = null;

function getGroq(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: env.GROQ_API_KEY.trim() });
  }
  return _groq;
}

export const aiService = {
  async generateFromPrompt(req: GenerateInvoiceRequest): Promise<GenerateInvoiceResponse> {
    const sanitizedPrompt = sanitizePrompt(req.prompt);

    try {
      const completion = await withRetry(() =>
        getGroq().chat.completions.create({
          model: env.GROQ_MODEL ?? "llama-3.3-70b-versatile",
          temperature: 0.1,
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: INVOICE_SYSTEM_PROMPT },
            {
              role: "user",
              content: `Extract invoice data from this request: "${sanitizedPrompt}". Return a single JSON object.`,
            },
          ],
        })
      );

      const text = completion.choices[0]?.message?.content ?? "";
      if (!text) throw new Error("Groq returned an empty response.");

      const cleanJson = extractJSON(text);

      let rawPayload: RawAIInvoicePayload;
      try {
        rawPayload = JSON.parse(cleanJson) as RawAIInvoicePayload;
      } catch (e) {
        console.error("Failed to parse Groq JSON. Raw text was:", text);
        throw new Error("AI returned a format that couldn't be parsed as JSON.");
      }

      const { parsed, confidence, suggestions } = parseAIPayload(rawPayload);
      return { invoice: parsed, confidence, suggestions };
    } catch (error: any) {
      console.error("Groq Error Detail:", error);
      throw new Error(`AI Generation Failed: ${error.message}`);
    }
  },

  async saveGeneratedInvoice(params: {
    parsed: ParsedInvoiceFromAI;
    prompt: string;
    confidence: number;
    suggestions: string[];
    organizationId: string;
    createdById: string;
    fromParty: {
      name: string;
      email: string;
      address?: string;
    };
  }): Promise<InvoiceDTO> {
    const { parsed, prompt, confidence, suggestions, organizationId, createdById } = params;
    const { to, from, issueDate, dueDate, lineItems, ...rest } = parsed;

    if (!to) throw new Error("AI response missing recipient (to)");
    if (!from) throw new Error("AI response missing sender (from)");
    if (!issueDate) throw new Error("AI response missing issue date");
    if (!dueDate) throw new Error("AI response missing due date");

    return invoiceService.create({
      organizationId,
      createdById,
      input: {
        ...rest,
        from,
        to,
        issueDate,
        dueDate,
        lineItems,
        source: "ai",
        aiPrompt: prompt,
        aiConfidence: confidence,
        aiSuggestions: suggestions,
      },
    });
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractJSON(content: string): string {
  const match = content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (match && match[1]) return match[1].trim();
  return content.trim();
}

function sanitizePrompt(input: string): string {
  return input
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 1000);
}

// ─── Retry helper ─────────────────────────────────────────────────────────────

const RETRYABLE_CODES = ["503", "429", "500"];
const MAX_RETRIES = 3;

async function withRetry<T>(fn: () => Promise<T>): Promise<T> {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (error: any) {
      const msg: string = error?.message ?? "";
      const isRetryable = RETRYABLE_CODES.some((code) => msg.includes(code));

      if (isRetryable && attempt < MAX_RETRIES - 1) {
        const delay = 1000 * Math.pow(2, attempt);
        console.warn(
          `Groq ${msg.match(/\d{3}/)?.[0] ?? "error"} — retrying in ${delay}ms (attempt ${attempt + 1}/${MAX_RETRIES})`
        );
        await new Promise((res) => setTimeout(res, delay));
        continue;
      }

      throw error;
    }
  }
  throw new Error("Unreachable");
}