import type { Request, Response } from "express";
import { getRevenueAnalytics } from "./analytics.service";

/**
 * GET /analytics/revenue
 * Returns the full RevenueAnalytics payload for the authenticated org.
 * Frontend calls this on dashboard mount and on manual refresh.
 */
export async function getRevenueAnalyticsHandler(
  req: Request,
  res: Response
): Promise<void> {
  const organizationId = req.user?.organizationId;

  if (!organizationId) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const analytics = await getRevenueAnalytics(organizationId);
    res.status(200).json(analytics);
  } catch (err) {
    console.error("[analytics.controller]", err);
    res.status(500).json({ message: "Failed to load analytics" });
  }
}