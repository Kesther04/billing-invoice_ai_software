import { useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import type { RevenueDataPoint } from "../types";

interface Props {
  dark: boolean;
  data: RevenueDataPoint[];
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-US", { notation: "compact", style: "currency", currency: "USD", maximumFractionDigits: 1 }).format(n);

const RANGES = [
  { label: "7d",  days: 7 },
  { label: "14d", days: 14 },
  { label: "30d", days: 30 },
];

function CustomTooltip({ active, payload, label, dark }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`rounded-xl p-3 shadow-xl border text-xs ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
      <p className={`font-semibold mb-2 ${dark ? "text-slate-300" : "text-slate-700"}`}>{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className={dark ? "text-slate-400" : "text-slate-500"}>{p.name}:</span>
          <span className="font-medium" style={{ color: p.color }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

export default function RevenueTrendChart({ dark, data }: Props) {
  const [range, setRange] = useState(30);
  const sliced = data.slice(-range);

  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const gridColor = dark ? "#1e2430" : "#f1f5f9";
  const axisColor = dark ? "#475569" : "#94a3b8";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>Revenue Trend</h3>
          <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Invoiced vs. collected</p>
        </div>
        <div className={`flex items-center rounded-lg p-0.5 gap-0.5 ${dark ? "bg-slate-900" : "bg-slate-100"}`}>
          {RANGES.map((r) => (
            <button
              key={r.label}
              onClick={() => setRange(r.days)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                range === r.days
                  ? "bg-emerald-500 text-white shadow-sm"
                  : dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        key={range}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ height: 220 }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sliced} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="gradInvoiced" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#14b8a6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCollected" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#10b981" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={gridColor} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: axisColor, fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval={Math.floor(sliced.length / 5)}
            />
            <YAxis tick={{ fill: axisColor, fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={fmt} />
            <Tooltip content={<CustomTooltip dark={dark} />} />
            <Area type="monotone" dataKey="invoiced"  name="Invoiced"  stroke="#14b8a6" strokeWidth={2} fill="url(#gradInvoiced)"  dot={false} />
            <Area type="monotone" dataKey="collected" name="Collected" stroke="#10b981" strokeWidth={2} fill="url(#gradCollected)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}