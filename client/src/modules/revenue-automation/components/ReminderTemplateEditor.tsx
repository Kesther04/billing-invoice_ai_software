import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Plus, Edit2, Check } from "lucide-react";
import type { ReminderTemplate } from "../types";

interface Props {
  dark: boolean;
  templates: ReminderTemplate[];
  editingTemplate: ReminderTemplate | null;
  onEdit: (tpl: ReminderTemplate | null) => void;
  onSave: (tpl: Partial<ReminderTemplate>) => void;
}

const VARS = ["{{clientName}}", "{{invoiceNumber}}", "{{amount}}", "{{dueDate}}", "{{paymentLink}}"];

export default function ReminderTemplateEditor({ dark, templates, editingTemplate, onEdit, onSave }: Props) {
  const [form, setForm] = useState<Partial<ReminderTemplate>>({});

  useEffect(() => {
    if (editingTemplate) setForm(editingTemplate);
    else setForm({ channel: "email", name: "", subject: "", body: "" });
  }, [editingTemplate]);

  const handleSave = () => {
    if (!form.name || !form.body) return;
    onSave({ ...form });
  };

  const insertVar = (v: string) => {
    setForm((f) => ({ ...f, body: (f.body ?? "") + v }));
  };

  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const inputCls = `w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 ${dark ? "bg-slate-900 border-slate-700 text-slate-200 placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400"}`;
  const labelCls = `block text-xs font-semibold uppercase tracking-wider mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`;

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-teal-500/10">
            <FileText className="h-4 w-4 text-teal-500" />
          </div>
          <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>Message Templates</h3>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onEdit(null)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${dark ? "border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400" : "border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"}`}
        >
          <Plus className="h-3.5 w-3.5" /> New
        </motion.button>
      </div>

      {/* Template list */}
      <div className="space-y-2 mb-4">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${dark ? "border-slate-800 bg-slate-900/30" : "border-slate-100 bg-slate-50"}`}
          >
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold ${dark ? "text-slate-300" : "text-slate-700"}`}>{tpl.name}</span>
                {tpl.isDefault && <span className="text-xs px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-500 font-medium">Default</span>}
              </div>
              <p className={`text-xs mt-0.5 capitalize ${dark ? "text-slate-500" : "text-slate-400"}`}>{tpl.channel}</p>
            </div>
            <button
              onClick={() => onEdit(tpl)}
              className={`p-1.5 rounded-lg transition-colors ${dark ? "text-slate-500 hover:text-slate-300 hover:bg-white/5" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"}`}
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Editor */}
      <AnimatePresence>
        {(editingTemplate !== undefined) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className={`rounded-xl p-4 border ${dark ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-slate-50"}`}>
              <p className={`text-xs font-semibold mb-3 ${dark ? "text-slate-300" : "text-slate-700"}`}>
                {editingTemplate ? `Edit: ${editingTemplate.name}` : "New Template"}
              </p>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelCls}>Name</label>
                    <input className={inputCls} placeholder="Template name" value={form.name ?? ""} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className={labelCls}>Channel</label>
                    <select className={inputCls} value={form.channel ?? "email"} onChange={(e) => setForm((f) => ({ ...f, channel: e.target.value as ReminderTemplate["channel"] }))}>
                      <option value="email">Email</option>
                      <option value="sms">SMS</option>
                      <option value="whatsapp">WhatsApp</option>
                    </select>
                  </div>
                </div>

                {form.channel === "email" && (
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input className={inputCls} placeholder="Email subject line" value={form.subject ?? ""} onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))} />
                  </div>
                )}

                <div>
                  <label className={labelCls}>Body</label>
                  <textarea rows={5} className={inputCls + " resize-none"} placeholder="Message body…" value={form.body ?? ""} onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))} />
                </div>

                {/* Variable chips */}
                <div>
                  <p className={`text-xs mb-1.5 ${dark ? "text-slate-600" : "text-slate-400"}`}>Insert variables:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {VARS.map((v) => (
                      <button key={v} onClick={() => insertVar(v)} className={`text-xs px-2 py-1 rounded-lg font-mono transition-colors ${dark ? "bg-slate-800 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10" : "bg-slate-100 text-slate-500 hover:text-emerald-600 hover:bg-emerald-50"}`}>
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-1">
                  <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors">
                    <Check className="h-3.5 w-3.5" /> Save Template
                  </button>
                  <button onClick={() => onEdit(undefined as unknown as null)} className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"}`}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}