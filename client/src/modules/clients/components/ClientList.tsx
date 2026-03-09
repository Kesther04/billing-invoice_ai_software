import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, UserPlus, MoreHorizontal, Edit2, Trash2 } from "lucide-react";
import type { Client } from "../types";

interface Props {
  dark: boolean;
  clients: Client[];
  onAdd: () => void;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onSelect: (client: Client) => void;
  selectedId?: string;
}

const fmt = (n: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(n);

function Avatar({ name, dark }: { name: string; dark: boolean }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  const hue = (name.charCodeAt(0) * 37) % 360;
  return (
    <div
      className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow"
      style={{ background: `hsl(${hue}, 50%, ${dark ? "38%" : "48%"})` }}
    >
      {initials}
    </div>
  );
}

export default function ClientList({ dark, clients, onAdd, onEdit, onDelete, onSelect, selectedId }: Props) {
  const [query, setQuery] = useState("");
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.email.toLowerCase().includes(query.toLowerCase()) || (c.company ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const inputCls = `flex-1 bg-transparent text-sm outline-none ${dark ? "text-slate-200 placeholder:text-slate-600" : "text-slate-800 placeholder:text-slate-400"}`;

  return (
    <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 border-b ${dark ? "border-slate-800" : "border-slate-100"}`}>
        <div className={`flex items-center gap-2 flex-1 px-3 py-2 rounded-xl border ${dark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
          <Search className={`h-4 w-4 shrink-0 ${dark ? "text-slate-600" : "text-slate-400"}`} />
          <input className={inputCls} placeholder="Search clients…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={onAdd}
          className="ml-3 flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-colors shrink-0"
        >
          <UserPlus className="h-3.5 w-3.5" /> Add Client
        </motion.button>
      </div>

      {/* Count */}
      <div className={`px-5 py-2.5 text-xs ${dark ? "text-slate-600 border-b border-slate-800/50" : "text-slate-400 border-b border-slate-100"}`}>
        {filtered.length} client{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* List */}
      <div className="divide-y" style={{ borderColor: dark ? "#1e2430" : "#f1f5f9" }}>
        <AnimatePresence initial={false}>
          {filtered.map((client) => {
            const isSelected = client.id === selectedId;
            const payRate = client.totalBilled > 0 ? client.totalPaid / client.totalBilled : 0;
            return (
              <motion.div
                key={client.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => { onSelect(client); setOpenMenu(null); }}
                className={`relative flex items-center gap-3 px-5 py-3.5 cursor-pointer transition-colors ${
                  isSelected
                    ? dark ? "bg-emerald-950/40" : "bg-emerald-50"
                    : dark ? "hover:bg-slate-900/50" : "hover:bg-slate-50"
                }`}
              >
                {isSelected && <div className="absolute left-0 top-2 bottom-2 w-0.5 rounded-full bg-emerald-500" />}
                <Avatar name={client.name} dark={dark} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-semibold truncate ${dark ? "text-slate-200" : "text-slate-800"}`}>{client.name}</p>
                  <p className={`text-xs truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{client.company ? `${client.company} · ` : ""}{client.email}</p>
                </div>
                <div className="text-right shrink-0 mr-2">
                  <p className={`text-sm font-bold ${dark ? "text-slate-200" : "text-slate-800"}`}>{fmt(client.totalBilled)}</p>
                  <p className={`text-xs ${payRate >= 0.9 ? "text-emerald-500" : payRate >= 0.7 ? "text-amber-500" : "text-red-400"}`}>
                    {Math.round(payRate * 100)}% paid
                  </p>
                </div>

                {/* Menu */}
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setOpenMenu(openMenu === client.id ? null : client.id)}
                    className={`p-1.5 rounded-lg transition-colors ${dark ? "text-slate-600 hover:text-slate-300 hover:bg-white/5" : "text-slate-300 hover:text-slate-600 hover:bg-slate-100"}`}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                  <AnimatePresence>
                    {openMenu === client.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -4 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`absolute right-0 top-8 z-20 rounded-xl border shadow-xl w-36 overflow-hidden ${dark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}
                      >
                        <button
                          onClick={() => { onEdit(client); setOpenMenu(null); }}
                          className={`flex items-center gap-2 w-full px-3 py-2.5 text-xs transition-colors ${dark ? "text-slate-300 hover:bg-white/5" : "text-slate-600 hover:bg-slate-50"}`}
                        >
                          <Edit2 className="h-3.5 w-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => { onDelete(client.id); setOpenMenu(null); }}
                          className="flex items-center gap-2 w-full px-3 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className={`text-center py-12 text-sm ${dark ? "text-slate-600" : "text-slate-400"}`}>
            {query ? "No clients match your search" : "No clients yet — add your first one!"}
          </div>
        )}
      </div>
    </div>
  );
}