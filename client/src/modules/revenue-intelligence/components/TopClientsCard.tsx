import React from "react";
import { motion } from "framer-motion";
import type { TopClient } from "../types";

interface Props {
  dark: boolean;
  clients: TopClient[];
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function Avatar({ name, dark }: { name: string; dark: boolean }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const hue = (name.charCodeAt(0) * 37) % 360;
  return (
    <div
      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow"
      style={{ background: `hsl(${hue}, 55%, ${dark ? "35%" : "45%"})` }}
    >
      {initials}
    </div>
  );
}

export default function TopClientsCard({ dark, clients }: Props) {
  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const rowBorder = dark ? "border-slate-800" : "border-slate-100";
  const track = dark ? "bg-slate-800" : "bg-slate-100";

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <h3 className={`text-sm font-semibold mb-4 ${dark ? "text-slate-200" : "text-slate-800"}`}>Top Clients</h3>

      <div className="space-y-0">
        {clients.map((c, i) => (
          <motion.div
            key={c.clientId}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.07 }}
            className={`flex items-center gap-3 py-3 border-b last:border-b-0 ${rowBorder}`}
          >
            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-xs w-4 text-right ${dark ? "text-slate-600" : "text-slate-300"}`}>{i + 1}</span>
              <Avatar name={c.clientName} dark={dark} />
            </div>
            <div className="flex-1 min-w-0">
              <p className={`text-xs font-semibold truncate ${dark ? "text-slate-300" : "text-slate-700"}`}>{c.clientName}</p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${track}`}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${c.paymentRate * 100}%` }}
                    transition={{ delay: i * 0.07 + 0.3, duration: 0.6, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
                  />
                </div>
                <span className={`text-xs shrink-0 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  {Math.round(c.paymentRate * 100)}%
                </span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className={`text-sm font-bold ${dark ? "text-slate-200" : "text-slate-800"}`}>{fmt(c.totalBilled)}</p>
              <p className={`text-xs ${dark ? "text-slate-600" : "text-slate-400"}`}>{c.invoiceCount} invoices</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}