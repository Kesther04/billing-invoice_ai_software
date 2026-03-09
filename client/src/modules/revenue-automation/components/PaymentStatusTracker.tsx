import { motion } from "framer-motion";
import { TrendingUp, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import type { PaymentLink } from "../types";

interface Props {
  dark: boolean;
  links: PaymentLink[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export default function PaymentStatusTracker({ dark, links }: Props) {
  const paid = links.filter((l) => l.status === "paid");
  const pending = links.filter((l) => l.status === "pending" || l.status === "unpaid");
  const failed = links.filter((l) => l.status === "failed");

  const totalPaid = paid.reduce((s, l) => s + l.amount, 0);
  const totalPending = pending.reduce((s, l) => s + l.amount, 0);

  const stats = [
    { label: "Collected", value: fmt(totalPaid), sub: `${paid.length} invoices`, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Outstanding", value: fmt(totalPending), sub: `${pending.length} invoices`, icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Failed", value: String(failed.length), sub: "need attention", icon: AlertCircle, color: "text-red-400", bg: "bg-red-400/10" },
    { label: "Collection Rate", value: links.length ? `${Math.round((paid.length / links.length) * 100)}%` : "—", sub: "of sent links", icon: TrendingUp, color: "text-sky-400", bg: "bg-sky-400/10" },
  ];

  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const rowBg = dark ? "border-slate-800 bg-slate-900/40" : "border-slate-100 bg-slate-50";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <h3 className={`text-sm font-semibold mb-4 ${dark ? "text-slate-200" : "text-slate-800"}`}>Payment Status</h3>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`p-3 rounded-xl border ${rowBg}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <div className={`p-1.5 rounded-lg ${s.bg}`}>
                  <Icon className={`h-3.5 w-3.5 ${s.color}`} />
                </div>
                <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{s.label}</span>
              </div>
              <div className={`text-lg font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>{s.value}</div>
              <div className={`text-xs mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{s.sub}</div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress bar */}
      {links.length > 0 && (
        <div>
          <div className={`flex justify-between text-xs mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            <span>Collection progress</span>
            <span>{Math.round((paid.length / links.length) * 100)}%</span>
          </div>
          <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(paid.length / links.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
            />
          </div>
        </div>
      )}
    </div>
  );
}