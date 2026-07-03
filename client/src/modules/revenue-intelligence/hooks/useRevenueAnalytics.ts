import { useState, useEffect } from "react";
import type { RevenueAnalytics } from "../types";
import { buildMockAnalytics, dashboardServices } from "../api";
import { useAuth } from "../../auth/context/AuthContext";

export function useRevenueAnalytics() {
  const { loading: authLoading, accessToken } = useAuth();

  const [data, setData] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);

    try {
      const d = await dashboardServices.fetchRevenueAnalytics();
      setData(d);
    } catch (err: any) {
      console.error(err);

      // Optional fallback while backend is under development
      await new Promise((r) => setTimeout(r, 600));
      setData(buildMockAnalytics());

      // Or if you don't want mock data:
      // setError(err?.response?.data?.message ?? "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Wait until AuthProvider finishes restoring the session
    if (authLoading) return;

    // User is not authenticated
    if (!accessToken) {
      setLoading(false);
      return;
    }

    load();
  }, [authLoading, accessToken]);

  return {
    data,
    loading,
    error,
    refresh: load,
  };
}