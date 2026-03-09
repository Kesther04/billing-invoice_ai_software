import React from "react";
import { motion } from "framer-motion";
import { BarChart2, RefreshCw } from "lucide-react";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { useRevenueAnalytics } from "../hooks/useRevenueAnalytics";
import RevenueOverviewCard from "../components/RevenueOverviewCard";
import RevenueTrendChart from "../components/RevenueTrendChart";
import PendingPaymentsCard from "../components/PendingPaymentsCard";
import TopClientsCard from "../components/TopClientsCard";
import AIInsightsSummary from "../components/AIInsightsSummary";
import { t } from "../../../shared/utils/themeClasses";

function Skeleton({ dark, className = "" }: { dark: boolean; className?: string }) {
  return (
    <div className={`rounded-2xl animate-pulse ${dark ? "bg-slate-800" : "bg-slate-100"} ${className}`} />
  );
}

export default function DashboardPage() {
  const { dark } = useTheme();
  const { data, loading, refresh } = useRevenueAnalytics();

  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")!) : null;
  const firstName = user?.name?.split(" ")[0] ?? "there";

  return (
    <div className={`min-h-screen transition-colors ${t.bg(dark)}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-gradient-to-b from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/25">
                <BarChart2 className="h-5 w-5 text-white" />
              </div>
              <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>
                Revenue Intelligence
              </h1>
            </div>
            <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Good morning, {firstName}. Here's your revenue snapshot.
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={refresh}
            disabled={loading}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${dark ? "border-slate-700 text-slate-300 hover:border-slate-600" : "border-slate-200 text-slate-600 hover:border-slate-300"} ${loading ? "opacity-50" : ""}`}
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </motion.button>
        </motion.div>

        {loading || !data ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} dark={dark} className="h-28" />)}
            </div>
            <Skeleton dark={dark} className="h-72" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Skeleton dark={dark} className="h-64" />
              <Skeleton dark={dark} className="h-64" />
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Overview stats */}
            <RevenueOverviewCard dark={dark} overview={data.overview} />

            {/* Trend chart */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <RevenueTrendChart dark={dark} data={data.trend} />
            </motion.div>

            {/* Mid row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <PendingPaymentsCard dark={dark} payments={data.pending} />
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
                <TopClientsCard dark={dark} clients={data.topClients} />
              </motion.div>
            </div>

            {/* AI Insights */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <AIInsightsSummary dark={dark} insights={data.insights} />
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}