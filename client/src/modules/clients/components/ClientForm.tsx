import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserPlus, Save } from "lucide-react";
import type { Client, ClientFormData } from "../types";

interface Props {
  dark: boolean;
  initial?: Partial<Client>;
  onSave: (data: ClientFormData) => Promise<void>;
  onCancel: () => void;
  isSaving?: boolean;
}

const CURRENCIES = ["USD", "EUR", "GBP", "CAD", "AUD", "NGN"];

const empty: ClientFormData = {
  name: "", email: "", phone: "", company: "", address: "",
  currency: "USD", lastInvoiceDate: undefined, tags: [], notes: "",
};

export default function ClientForm({ dark, initial, onSave, onCancel, isSaving }: Props) {
  const [form, setForm] = useState<ClientFormData>({ ...empty, ...initial });

  useEffect(() => { setForm({ ...empty, ...initial }); }, [initial]);

  const set = (k: keyof ClientFormData, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    await onSave(form);
  };

  const inputCls = `w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 ${dark ? "bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"}`;
  const labelCls = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`;
  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border p-6 ${cardBg}`}
    >
      <div className="flex items-center gap-2.5 mb-6">
        <div className="p-2 rounded-lg bg-emerald-500/10">
          <UserPlus className="h-4 w-4 text-emerald-500" />
        </div>
        <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>
          {initial?.id ? "Edit Client" : "Add New Client"}
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Name *</label>
          <input className={inputCls} placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Email *</label>
          <input type="email" className={inputCls} placeholder="client@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Company</label>
          <input className={inputCls} placeholder="Company name" value={form.company ?? ""} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Phone</label>
          <input className={inputCls} placeholder="+1 555 000 0000" value={form.phone ?? ""} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className={labelCls}>Currency</label>
          <select className={inputCls} value={form.currency} onChange={(e) => set("currency", e.target.value)}>
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className={labelCls}>Address</label>
          <input className={inputCls} placeholder="Street, City, ZIP" value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} />
        </div>
      </div>

      <div className="mb-5">
        <label className={labelCls}>Notes</label>
        <textarea rows={2} className={inputCls + " resize-none"} placeholder="Internal notes about this client…" value={form.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
      </div>

      <div className="flex gap-2">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!form.name || !form.email || isSaving}
          className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-60"
        >
          <Save className="h-3.5 w-3.5" />
          {isSaving ? "Saving…" : "Save Client"}
        </motion.button>
        <button onClick={onCancel} className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
          Cancel
        </button>
      </div>
    </motion.div>
  );
}