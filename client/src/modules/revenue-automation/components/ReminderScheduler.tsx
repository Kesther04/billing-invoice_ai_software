import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import type { ReminderRule, ReminderTemplate } from "../types";

interface Props {
  dark: boolean;
  rules: ReminderRule[];
  templates: ReminderTemplate[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<ReminderRule>) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const TRIGGERS = [
  { value: "before_due", label: "Before due date" },
  { value: "on_due",     label: "On due date" },
  { value: "after_due",  label: "After due date" },
  { value: "manual",     label: "Manual" },
] as const;

const CHANNELS = [
  { value: "email",     label: "Email" },
  { value: "sms",       label: "SMS" },
  { value: "whatsapp",  label: "WhatsApp" },
] as const;

function Toggle({ enabled, onChange, dark }: { enabled: boolean; onChange: () => void; dark: boolean }) {
  return (
    <button
      onClick={onChange}
      className={`relative flex h-5 w-9 items-center rounded-full transition-colors duration-200 ${enabled ? "bg-emerald-500" : dark ? "bg-slate-700" : "bg-slate-200"}`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`h-3.5 w-3.5 rounded-full bg-white shadow-sm ${enabled ? "ml-auto mr-0.5" : "ml-0.5"}`}
      />
    </button>
  );
}

export default function ReminderScheduler({ dark, rules, templates, onToggle, onUpdate, onAdd, onRemove }: Props) {
  const cardBg = dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200";
  const rowBg = dark ? "border-slate-800 hover:bg-slate-900/60" : "border-slate-100 hover:bg-slate-50";
  const selectCls = `text-xs rounded-lg px-2 py-1.5 outline-none border transition-colors focus:border-emerald-500 ${dark ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`;

  return (
    <div className={`rounded-2xl border p-6 ${cardBg}`}>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className={`text-sm font-semibold ${dark ? "text-slate-200" : "text-slate-800"}`}>Reminder Schedule</h3>
          <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Configure when reminders fire</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${dark ? "border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-400" : "border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"}`}
        >
          <Plus className="h-3.5 w-3.5" /> Add Rule
        </motion.button>
      </div>

      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {rules.map((rule) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`overflow-hidden rounded-xl border transition-colors ${rowBg} ${rule.enabled ? "" : "opacity-50"}`}
            >
              <div className="flex items-center gap-3 p-3">
                <Toggle enabled={rule.enabled} onChange={() => onToggle(rule.id)} dark={dark} />

                <div className="flex flex-wrap items-center gap-2 flex-1 min-w-0">
                  <select
                    value={rule.trigger}
                    onChange={(e) => onUpdate(rule.id, { trigger: e.target.value as ReminderRule["trigger"] })}
                    className={selectCls}
                  >
                    {TRIGGERS.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>

                  {rule.trigger !== "on_due" && rule.trigger !== "manual" && (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={rule.daysOffset}
                        min={0}
                        onChange={(e) => onUpdate(rule.id, { daysOffset: parseInt(e.target.value) || 0 })}
                        className={`w-12 text-xs rounded-lg px-2 py-1.5 outline-none border text-center focus:border-emerald-500 ${dark ? "bg-slate-800 border-slate-700 text-slate-200" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                      />
                      <span className={`text-xs ${dark ? "text-slate-500" : "text-slate-400"}`}>days</span>
                    </div>
                  )}

                  <select
                    value={rule.channel}
                    onChange={(e) => onUpdate(rule.id, { channel: e.target.value as ReminderRule["channel"] })}
                    className={selectCls}
                  >
                    {CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>

                  <select
                    value={rule.templateId}
                    onChange={(e) => onUpdate(rule.id, { templateId: e.target.value })}
                    className={selectCls}
                  >
                    {templates.map((tpl) => <option key={tpl.id} value={tpl.id}>{tpl.name}</option>)}
                  </select>
                </div>

                <button
                  onClick={() => onRemove(rule.id)}
                  className={`shrink-0 p-1.5 rounded-lg transition-colors ${dark ? "text-slate-600 hover:text-red-400 hover:bg-red-400/10" : "text-slate-300 hover:text-red-400 hover:bg-red-50"}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}