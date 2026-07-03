import * as analyticsRepository from "./analytics.repository";
import { generateInsights } from "./analytics.ai";
import type { RevenueAnalytics } from "./analytics.types";

/**
 * Assembles the full dashboard analytics response.
 *
 * Layer 1: overview + pending are real SQL aggregates.
 * Layer 2+: trend, topClients, insights return [] until implemented.
 *
 * All repository calls run in parallel where possible to keep
 * dashboard load time minimal.
 */
export async function getRevenueAnalytics(
  organizationId: string
): Promise<RevenueAnalytics> {
  const [overview, pending, trend, topClients] = await Promise.all([
    analyticsRepository.getRevenueOverview(organizationId),
    analyticsRepository.getPendingPayments(organizationId),
    analyticsRepository.getRevenueTrend(organizationId),
    analyticsRepository.getTopClients(organizationId),
  ]);

  // AI insights are non-blocking — if they fail, the dashboard still loads.
  // Returns [] at Layer 1 since generateInsights is stubbed.
  const insights = await generateInsights(overview, pending, organizationId).catch(
    () => []
  );

  return {
    overview,
    pending,
    trend,
    topClients,
    insights,
  };
}