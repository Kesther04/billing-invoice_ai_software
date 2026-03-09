import { motion } from "framer-motion";
import { Mail, MessageSquare, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { ReminderLogEntry } from "../types";

interface Props {
  dark: boolean;
  log: ReminderLogEntry[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const statusIcon = {
  sent:      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  failed:    <XCircle className="h-3.5 w-3.5 text-red-400" />,
  scheduled: <Clock className="h-3.5 w-3.5 text-sky-400" />,
  skipped:   <XCircle className="h-3.5 w-3.5 text-slate-400" />,
};

const channelIcon = {
  email:     <Mail className="h-3.5 w-3.5" />,
  sms:       <MessageSquare className="h-3.5 w-3.5" />,
  whatsapp:  <MessageSquare className="h-3.5 w-3.5" />,
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function ReminderLog({ dark, log }: Props) {
  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const rowBorder = dark ? "border-slate-800/60" : "border-slate-100";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center justify-between mb-5">
        <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>Activity Log</h3>
        <span className={`text-xs px-2.5 py-1 rounded-full ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
          {log.length} events
        </span>
      </div>

      {log.length === 0 ? (
        <div className={`text-center py-8 text-sm ${dark ? "text-slate-600" : "text-slate-400"}`}>No activity yet</div>
      ) : (
        <div className="space-y-0">
          {log.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-start gap-3 py-3 border-b last:border-b-0 ${rowBorder}`}
            >
              {/* Channel icon */}
              <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                {channelIcon[entry.channel]}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{entry.clientName}</span>
                  <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>·</span>
                  <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{entry.invoiceNumber}</span>
                  <span className={`text-xs font-medium ${dark ? "text-slate-400" : "text-slate-600"}`}>{fmt(entry.amount)}</span>
                </div>
                <p className={`text-xs truncate ${dark ? "text-slate-600" : "text-slate-400"}`}>{entry.subject}</p>
              </div>

              {/* Status + time */}
              <div className="flex flex-col items-end gap-1 shrink-0">
                <div className="flex items-center gap-1">
                  {statusIcon[entry.status]}
                  <span className={`text-xs capitalize ${entry.status === "sent" ? "text-emerald-500" : entry.status === "failed" ? "text-red-400" : dark ? "text-slate-400" : "text-slate-500"}`}>
                    {entry.status}
                  </span>
                </div>
                <span className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>{timeAgo(entry.sentAt)}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}