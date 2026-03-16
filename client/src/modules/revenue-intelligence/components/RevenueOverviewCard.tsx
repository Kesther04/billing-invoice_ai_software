import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, DollarSign, Clock, AlertTriangle, CheckCircle2 } from "lucide-react";
import type { RevenueOverview } from "../types";

interface Props {
  dark: boolean;
  overview: RevenueOverview;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

export default function RevenueOverviewCard({ dark, overview }: Props) {
  const stats = [
    {
      label: "Total Revenue",
      value: fmt(overview.totalRevenue),
      sub: `+${overview.growthPercent}% this month`,
      icon: DollarSign,
      positive: true,
      gradient: "from-emerald-900 to-emerald-800",
      gradientLight: "from-emerald-50 to-white",
      iconBg: "bg-emerald-500/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-50",
      subColor: "text-emerald-300",
      dark: true as const,
    },
    {
      label: "Collected This Month",
      value: fmt(overview.collectedThisMonth),
      sub: "This billing cycle",
      icon: CheckCircle2,
      positive: true,
      gradient: dark ? "from-slate-800 to-slate-900" : "from-white to-slate-50",
      iconBg: "bg-sky-500/10",
      iconColor: "text-sky-400",
      valueColor: "",
      subColor: "",
    },
    {
      label: "Pending",
      value: fmt(overview.pendingRevenue),
      sub: "Awaiting payment",
      icon: Clock,
      positive: null,
      gradient: dark ? "from-slate-800 to-slate-900" : "from-white to-slate-50",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      valueColor: "",
      subColor: "",
    },
    {
      label: "Overdue",
      value: fmt(overview.overdueRevenue),
      sub: "Needs follow-up",
      icon: AlertTriangle,
      positive: false,
      gradient: dark ? "from-slate-800 to-slate-900" : "from-white to-slate-50",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-400",
      valueColor: "",
      subColor: "",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        const isHero = i === 0;
        return (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`relative overflow-hidden rounded-2xl p-5 bg-gradient-to-b shadow-sm border ${
              isHero
                ? `${dark ? "from-emerald-950 to-emerald-900 border-emerald-800" : "from-emerald-700 to-emerald-600 border-emerald-600"}`
                : `${dark ? "from-[#0f1117] to-[#0f1117] border-slate-800" : "from-white to-slate-50 border-slate-200"}`
            }`}
          >
            {isHero && (
              <svg className="absolute inset-0 h-full w-full opacity-10" viewBox="0 0 200 200">
                {[40, 70, 100].map((r, j) => (
                  <circle key={j} cx="180" cy="30" r={r} fill="none" stroke="currentColor" strokeOpacity="0.5" />
                ))}
              </svg>
            )}
            <div className="relative">
              <div className={`inline-flex p-2 rounded-xl mb-3 ${s.iconBg}`}>
                <Icon className={`h-4 w-4 ${s.iconColor}`} />
              </div>
              <div className={`text-2xl font-bold tracking-tight mb-0.5 ${isHero ? "text-white" : dark ? "text-slate-100" : "text-slate-900"}`}>
                {s.value}
              </div>
              <div className={`text-xs ${isHero ? "text-emerald-300" : dark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</div>
              <div className={`text-xs mt-1 flex items-center gap-1 ${
                s.positive === true ? "text-emerald-400" :
                s.positive === false ? "text-red-400" :
                isHero ? "text-emerald-300" : dark ? "text-slate-500" : "text-slate-400"
              }`}>
                {s.positive === true && <TrendingUp className="h-3 w-3" />}
                {s.positive === false && <TrendingDown className="h-3 w-3" />}
                {s.sub}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}