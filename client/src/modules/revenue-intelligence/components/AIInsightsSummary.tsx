import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Sparkles, TrendingUp, Info } from "lucide-react";
import type { AIInsight } from "../types";

interface Props {
  dark: boolean;
  insights: AIInsight[];
}

const typeConfig = {
  warning:     { icon: AlertTriangle, color: "text-amber-400", bg: "bg-amber-400/10", border: "border-amber-400/20" },
  celebration: { icon: Sparkles,      color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  opportunity: { icon: TrendingUp,    color: "text-sky-400",    bg: "bg-sky-400/10",    border: "border-sky-400/20" },
  info:        { icon: Info,           color: "text-slate-400",  bg: "bg-slate-400/10",  border: "border-slate-400/20" },
};

export default function AIInsightsSummary({ dark, insights }: Props) {
  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className="p-2 rounded-lg bg-gradient-to-b from-emerald-500/20 to-teal-500/10">
          <Sparkles className="h-4 w-4 text-emerald-400" />
        </div>
        <div>
          <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>AI Insights</h3>
          <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>Smart observations from your data</p>
        </div>
      </div>

      <div className="space-y-3">
        {insights.map((ins, i) => {
          const cfg = typeConfig[ins.type];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={ins.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`rounded-xl p-4 border ${cfg.bg} ${cfg.border}`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 shrink-0 p-1.5 rounded-lg ${cfg.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-xs font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>{ins.title}</p>
                    {ins.metric && (
                      <span className={`text-xs font-bold shrink-0 ${cfg.color}`}>{ins.metric}</span>
                    )}
                  </div>
                  <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-500"}`}>{ins.body}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}