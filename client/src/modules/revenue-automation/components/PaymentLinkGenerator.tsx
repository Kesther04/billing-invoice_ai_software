import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link2, Copy, Check, ExternalLink, Loader2 } from "lucide-react";
import type { PaymentLink } from "../types";

interface Props {
  dark: boolean;
  links: PaymentLink[];
  generatingLink: boolean;
  onGenerate: (invoiceId: string, invoiceNumber: string, clientName: string, amount: number) => void;
}

const statusConfig = {
  unpaid:   { label: "Unpaid",   cls: "text-amber-500 bg-amber-500/10" },
  pending:  { label: "Pending",  cls: "text-sky-400 bg-sky-400/10" },
  paid:     { label: "Paid",     cls: "text-emerald-500 bg-emerald-500/10" },
  failed:   { label: "Failed",   cls: "text-red-400 bg-red-400/10" },
  refunded: { label: "Refunded", cls: "text-slate-400 bg-slate-400/10" },
};

const fmt = (n: number, c = "USD") => new Intl.NumberFormat("en-US", { style: "currency", currency: c }).format(n);

function CopyButton({ text, dark }: { text: string; dark: boolean }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button
      onClick={copy}
      className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export default function PaymentLinkGenerator({ dark, links, generatingLink, onGenerate }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ invoiceId: "", invoiceNumber: "", clientName: "", amount: "" });

  const handleSubmit = () => {
    if (!form.invoiceNumber || !form.clientName || !form.amount) return;
    onGenerate(
      form.invoiceId || `inv-${Date.now()}`,
      form.invoiceNumber,
      form.clientName,
      parseFloat(form.amount) || 0,
    );
    setShowForm(false);
    setForm({ invoiceId: "", invoiceNumber: "", clientName: "", amount: "" });
  };

  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const inputCls = `w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 ${dark ? "bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"}`;

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-emerald-500/10">
            <Link2 className="h-4 w-4 text-emerald-500" />
          </div>
          <div>
            <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>Payment Links</h3>
            <p className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>{links.length} links generated</p>
          </div>
        </div>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => setShowForm((v) => !v)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg shadow-emerald-600/20"
        >
          + New Link
        </motion.button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className={`rounded-xl p-4 mb-4 border ${dark ? "bg-slate-900/50 border-slate-800" : "bg-slate-50 border-slate-200"}`}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputCls} placeholder="Invoice #" value={form.invoiceNumber} onChange={(e) => setForm((f) => ({ ...f, invoiceNumber: e.target.value }))} />
                <input className={inputCls} placeholder="Client Name" value={form.clientName} onChange={(e) => setForm((f) => ({ ...f, clientName: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputCls} type="number" placeholder="Amount (USD)" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
                <input className={inputCls} placeholder="Invoice ID (optional)" value={form.invoiceId} onChange={(e) => setForm((f) => ({ ...f, invoiceId: e.target.value }))} />
              </div>
              <div className="flex gap-2">
                <button onClick={handleSubmit} disabled={generatingLink} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors disabled:opacity-60">
                  {generatingLink ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Link2 className="h-3.5 w-3.5" />}
                  {generatingLink ? "Generating…" : "Generate"}
                </button>
                <button onClick={() => setShowForm(false)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Links list */}
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {links.map((link) => {
            const s = statusConfig[link.status];
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${dark ? "border-slate-800 bg-slate-900/40" : "border-slate-100 bg-slate-50"}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{link.invoiceNumber}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.cls}`}>{s.label}</span>
                  </div>
                  <p className={`text-xs truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{link.clientName} · {fmt(link.amount, link.currency)}</p>
                  <p className={`text-xs truncate font-mono mt-0.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>{link.url}</p>
                </div>
                <div className="flex items-center gap-0.5 shrink-0">
                  <CopyButton text={link.url} dark={dark} />
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-lg transition-colors ${dark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-100 text-slate-500"}`}>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}