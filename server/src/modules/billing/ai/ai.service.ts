import Groq from "groq-sdk";
import { env } from "../../../config/env";
import { SYSTEM_PROMPT, buildUserMessage } from "./ai.prompt";
import { parseAIResponse, ParseError } from "./ai.parser";
import * as aiRepository from "./ai.repository";
import type { GenerateInvoiceResponse, PromptRunDTO } from "./ai.types";

const client = new Groq({
  apiKey: env.GROQ_API_KEY!,
});

/**
 * Generates a structured invoice draft from a natural language prompt.
 * Persists the PromptRun (success or failure) for history.
 * Returns the draft + promptRunId — never saves an Invoice itself.
 */
export async function generateInvoiceDraft(params: {
  prompt: string;
  organizationId: string;
  createdById?: string;
}): Promise<GenerateInvoiceResponse> {
  const { prompt, organizationId, createdById } = params;

  let rawResponse: string;

  try {
    const message = await client.chat.completions.create({
      model:      env.GROQ_MODEL ?? "openai/gpt-oss-20b",
      temperature: 0.0,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      messages:   [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: buildUserMessage(prompt) }
      ],
    });

    rawResponse = message.choices[0].message.content ?? "";
  } catch (err) {
    // LLM call itself failed — persist the error run and re-throw
    const message = err instanceof Error ? err.message : "LLM call failed";
    await aiRepository.createErrorRun({
      prompt,
      error: message,
      organizationId,
      createdById,
    });
    throw new Error("Failed to reach the AI service. Please try again.");
  }

  let draft;
  try {
    draft = parseAIResponse(rawResponse);
  } catch (err) {
    const message = err instanceof ParseError
      ? err.message
      : "AI returned an unexpected response format.";

    await aiRepository.createErrorRun({
      prompt,
      error: message,
      organizationId,
      createdById,
    });
    throw new Error(message);
  }

  // Persist the successful run
  const run = await aiRepository.createSuccessRun({
    prompt,
    draft,
    organizationId,
    createdById,
  });

  return {
    draft,
    promptRunId: run.id,
  };
}

/**
 * Returns the prompt history for an org — used by the AI Billing page's
 * history panel. Non-critical: failure here should never block the UI.
 */
export async function getPromptHistory(
  organizationId: string,
  limit = 20
): Promise<PromptRunDTO[]> {
  return aiRepository.listPromptHistory(organizationId, limit);
}