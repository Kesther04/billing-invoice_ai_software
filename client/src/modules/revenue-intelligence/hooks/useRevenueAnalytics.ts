import { useState, useEffect } from "react";
import type { RevenueAnalytics } from "../types";
import { buildMockAnalytics, dashboardServices } from "../api";

export function useRevenueAnalytics() {
  const [data, setData] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await dashboardServices.fetchRevenueAnalytics();
      setData(d);
    } catch {
      // Fall back to mock
      await new Promise((r) => setTimeout(r, 600));
      setData(buildMockAnalytics());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return { data, loading, error, refresh: load };
}