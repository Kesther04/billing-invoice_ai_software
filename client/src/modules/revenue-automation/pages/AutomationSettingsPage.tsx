import { motion } from "framer-motion";
import { RefreshCw, Zap } from "lucide-react";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { useRevenueAutomation } from "../hooks/useRevenueAutomation";
import PaymentLinkGenerator from "../components/PaymentLinkGenerator";
import PaymentStatusTracker from "../components/PaymentStatusTracker";
import ReminderScheduler from "../components/ReminderScheduler";
import ReminderLog from "../components/ReminderLog";
import ReminderTemplateEditor from "../components/ReminderTemplateEditor";
import { t } from "../../../shared/utils/themeClasses";

export default function AutomationSettingsPage() {
  const { dark } = useTheme();
  const {
    settings,
    links,
    log,
    generatingLink,
    editingTemplate,
    setEditingTemplate,
    toggleAutomation,
    toggleRule,
    updateRule,
    addRule,
    removeRule,
    generateLink,
    saveTemplate,
  } = useRevenueAutomation();

  return (
    <div className={`min-h-screen transition-colors ${t.bg(dark)}`}>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <div className="p-2 rounded-xl bg-gradient-to-b from-teal-500 to-emerald-600 shadow-lg shadow-emerald-600/25">
                <RefreshCw className="h-5 w-5 text-white" />
              </div>
              <h1 className={`text-2xl font-bold tracking-tight ${dark ? "text-slate-100" : "text-slate-900"}`}>
                Revenue Automation
              </h1>
            </div>
            <p className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>
              Payment links, automated reminders and collection tracking — all in one place.
            </p>
          </div>

          {/* Global toggle */}
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${dark ? "bg-[#0f1117] border-slate-800" : "bg-white border-slate-200"}`}>
            <div className="flex items-center gap-1.5">
              <Zap className={`h-4 w-4 ${settings.enabled ? "text-emerald-500" : dark ? "text-slate-600" : "text-slate-300"}`} />
              <span className={`text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
                Automation {settings.enabled ? "ON" : "OFF"}
              </span>
            </div>
            <button
              onClick={toggleAutomation}
              className={`relative flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${settings.enabled ? "bg-emerald-500" : dark ? "bg-slate-700" : "bg-slate-200"}`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
                className={`h-4 w-4 rounded-full bg-white shadow-sm ${settings.enabled ? "ml-auto mr-1" : "ml-1"}`}
              />
            </button>
          </div>
        </motion.div>

        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <PaymentLinkGenerator
              dark={dark}
              links={links}
              generatingLink={generatingLink}
              onGenerate={generateLink}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <PaymentStatusTracker dark={dark} links={links} />
          </motion.div>
        </div>

        {/* Scheduler */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-5">
          <ReminderScheduler
            dark={dark}
            rules={settings.rules}
            templates={settings.templates}
            onToggle={toggleRule}
            onUpdate={updateRule}
            onAdd={addRule}
            onRemove={removeRule}
          />
        </motion.div>

        {/* Bottom row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <ReminderTemplateEditor
              dark={dark}
              templates={settings.templates}
              editingTemplate={editingTemplate}
              onEdit={setEditingTemplate}
              onSave={saveTemplate}
            />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <ReminderLog dark={dark} log={log} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}