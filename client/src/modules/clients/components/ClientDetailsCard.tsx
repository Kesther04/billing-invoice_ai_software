import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Building2, FileText, Edit2 } from "lucide-react";
import type { Client } from "../types";

interface Props {
  dark: boolean;
  client: Client;
  onEdit: (client: Client) => void;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function StatBox({ label, value, dark, accent = false }: { label: string; value: string; dark: boolean; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-3.5 border ${dark ? "border-slate-800 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
      <p className={`text-xs mb-1 ${dark ? "text-slate-500" : "text-slate-400"}`}>{label}</p>
      <p className={`text-lg font-bold ${accent ? "text-emerald-500" : dark ? "text-slate-100" : "text-slate-900"}`}>{value}</p>
    </div>
  );
}

export default function ClientDetailsCard({ dark, client, onEdit }: Props) {
  const payRate = client.totalBilled > 0 ? client.totalPaid / client.totalBilled : 0;
  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";

  return (
    <motion.div
      key={client.id}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className={`rounded-2xl border p-6 ${cardBg}`}
    >
      {/* Top */}
      <div className="flex items-start justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow"
            style={{ background: `hsl(${(client.name.charCodeAt(0) * 37) % 360}, 50%, 45%)` }}
          >
            {client.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
          </div>
          <div>
            <h3 className={`text-base font-bold ${dark ? "text-slate-100" : "text-slate-900"}`}>{client.name}</h3>
            {client.company && <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{client.company}</p>}
          </div>
        </div>
        <button
          onClick={() => onEdit(client)}
          className={`p-2 rounded-xl border transition-colors ${dark ? "border-slate-700 text-slate-400 hover:text-slate-200 hover:border-slate-600" : "border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300"}`}
        >
          <Edit2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Contact */}
      <div className="space-y-2 mb-5">
        {[
          { icon: Mail, value: client.email },
          client.phone && { icon: Phone, value: client.phone },
          client.company && { icon: Building2, value: client.company },
          client.address && { icon: MapPin, value: client.address },
        ].filter(Boolean).map((item: any, i) => {
          const Icon = item.icon;
          return (
            <div key={i} className={`flex items-center gap-2.5 text-sm ${dark ? "text-slate-400" : "text-slate-600"}`}>
              <Icon className={`h-3.5 w-3.5 shrink-0 ${dark ? "text-slate-600" : "text-slate-400"}`} />
              <span className="truncate">{item.value}</span>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <StatBox label="Total Billed" value={fmt(client.totalBilled)} dark={dark} />
        <StatBox label="Total Paid" value={fmt(client.totalPaid)} dark={dark} accent />
        <StatBox label="Invoices" value={String(client.invoiceCount)} dark={dark} />
        <StatBox label="Pay Rate" value={`${Math.round(payRate * 100)}%`} dark={dark} accent={payRate >= 0.8} />
      </div>

      {/* Payment rate bar */}
      <div className="mb-4">
        <div className={`flex justify-between text-xs mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
          <span>Payment rate</span>
          <span className={payRate >= 0.8 ? "text-emerald-500" : "text-amber-500"}>{Math.round(payRate * 100)}%</span>
        </div>
        <div className={`h-2 rounded-full overflow-hidden ${dark ? "bg-slate-800" : "bg-slate-100"}`}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${payRate * 100}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className={`h-full rounded-full ${payRate >= 0.8 ? "bg-gradient-to-r from-emerald-500 to-teal-400" : "bg-gradient-to-r from-amber-400 to-orange-400"}`}
          />
        </div>
      </div>

      {/* Notes */}
      {client.notes && (
        <div className={`rounded-xl p-3.5 border ${dark ? "border-slate-800 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}>
          <div className="flex items-center gap-1.5 mb-1.5">
            <FileText className={`h-3.5 w-3.5 ${dark ? "text-slate-600" : "text-slate-400"}`} />
            <span className={`text-xs font-semibold uppercase tracking-wider ${dark ? "text-slate-600" : "text-slate-400"}`}>Notes</span>
          </div>
          <p className={`text-xs leading-relaxed ${dark ? "text-slate-400" : "text-slate-600"}`}>{client.notes}</p>
        </div>
      )}

      {/* Tags */}
      {client.tags && client.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {client.tags.map((tag) => (
            <span key={tag} className={`text-xs px-2 py-0.5 rounded-full ${dark ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500"}`}>{tag}</span>
          ))}
        </div>
      )}
    </motion.div>
  );
}