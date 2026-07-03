/**
 * analytics.ai.ts — AI-narrated dashboard summaries
 *
 * DEFERRED: Layer 2+ feature. Implementing this requires:
 * - Enough invoice history to generate meaningful observations
 * - Prompt templates that translate aggregates into plain-language insights
 * - An Anthropic API call per dashboard refresh (rate limit + cost consideration)
 *
 * When implemented, generateInsights() will:
 * 1. Receive the computed RevenueOverview + PendingPayments
 * 2. Build a structured prompt summarising the numbers
 * 3. Call the Claude API and parse the response into typed Insight[]
 * 4. Cache the result for ~1 hour so every dashboard refresh doesn't hit the LLM
 *
 * Example insights it will produce:
 * - "5 invoices overdue — $15,200 at risk"
 * - "Best month yet — 23% MoM growth"
 * - "Upsell opportunity: Acme Corp pays in 3 days avg"
 * - "Payment speed improving since reminders were enabled"
 */

import type { Insight, RevenueOverview, PendingPayment } from "./analytics.types";

// Placeholder — replace with real LLM implementation in Layer 2
export async function generateInsights(
  _overview: RevenueOverview,
  _pending: PendingPayment[],
  _organizationId: string
): Promise<Insight[]> {
  // TODO Layer 2:
  // const prompt = buildInsightPrompt(_overview, _pending);
  // const response = await anthropic.messages.create({ ... });
  // return parseInsightResponse(response);
  return [];
}