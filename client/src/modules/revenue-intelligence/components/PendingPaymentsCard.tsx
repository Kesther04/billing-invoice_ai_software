import { motion } from "framer-motion";
import { AlertTriangle, Clock, CalendarCheck } from "lucide-react";
import type { PendingPayment } from "../types";

interface Props {
  dark: boolean;
  payments: PendingPayment[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const statusConfig = {
  overdue:   { label: (d: number) => `${d}d overdue`,  color: "text-red-400",   bg: "bg-red-400/10",   icon: AlertTriangle },
  due_today: { label: () => "Due today",               color: "text-amber-400", bg: "bg-amber-400/10", icon: Clock },
  upcoming:  { label: (d: number) => `Due in ${Math.abs(d)}d`, color: "text-sky-400", bg: "bg-sky-400/10", icon: CalendarCheck },
};

export default function PendingPaymentsCard({ dark, payments }: Props) {
  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const rowBorder = dark ? "border-slate-800" : "border-slate-100";

  const total = payments.reduce((s, p) => s + p.amount, 0);
  const overdue = payments.filter((p) => p.status === "overdue");

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>Pending Payments</h3>
          <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
            {fmt(total)} outstanding · {overdue.length} overdue
          </p>
        </div>
        {overdue.length > 0 && (
          <span className="flex items-center gap-1 text-xs font-medium text-red-400 bg-red-400/10 px-2.5 py-1 rounded-full">
            <AlertTriangle className="h-3 w-3" />
            {overdue.length} overdue
          </span>
        )}
      </div>

      <div className="space-y-0">
        {payments.map((p, i) => {
          const cfg = statusConfig[p.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={p.invoiceId}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-3 py-3 border-b last:border-b-0 ${rowBorder}`}
            >
              <div className={`p-1.5 rounded-lg shrink-0 ${cfg.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${cfg.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-semibold truncate ${dark ? "text-slate-300" : "text-slate-700"}`}>{p.clientName}</p>
                <p className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>{p.invoiceNumber}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-bold ${dark ? "text-slate-200" : "text-slate-800"}`}>{fmt(p.amount)}</p>
                <p className={`text-xs ${cfg.color}`}>{cfg.label(p.daysOverdue)}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}