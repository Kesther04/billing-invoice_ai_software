import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { useInvoiceAI } from "../hooks/useInvoiceAI";
import { invoiceService } from "../api";
import type { Invoice, LineItem } from "../types";
import InvoicePromptInput from "../components/InvoicePromptInput";
import InvoicePreview from "../components/InvoicePreview";
import InvoiceEditor from "../components/InvoiceEditor";
import PromptHistoryList from "../components/PromptHistoryList";

type LocalStep = "describe" | "preview" | "edit";

const STEPS = ["Describe", "Preview", "Edit"] as const;

/* Sensible blank-ish defaults for fields the AI parser doesn't fill in,
   so a draft is never missing required pieces of the Invoice shape. */
function withDefaults(draft: Partial<Invoice>): Partial<Invoice> {
  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 14);
  return {
    status: "draft",
    issueDate: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    currency: "USD",
    taxRate: 0,
    discountAmount: 0,
    lineItems: [],
    ...draft,
  };
}

export default function AiInvoicePage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { state, setPrompt, generate, loadHistory } = useInvoiceAI();

  const [step, setStep] = useState<LocalStep>("describe");
  const [draft, setDraft] = useState<Partial<Invoice> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const stepIndex = step === "describe" ? 0 : step === "preview" ? 1 : 2;

  const handleGenerate = async (prompt: string) => {
    const result = await generate(prompt);
    if (result) {
      setDraft(withDefaults(result));
      setStep("preview");
    }
  };

  const handleReuse = (prompt: string) => {
    setPrompt(prompt);
    setStep("describe");
  };

  const updateInvoice = (updates: Partial<Invoice>) => {
    setDraft((d) => ({ ...(d ?? {}), ...updates }));
  };

  const updateLineItem = (id: string, updates: Partial<LineItem>) => {
    setDraft((d) => {
      if (!d) return d;
      const lineItems = (d.lineItems ?? []).map((li) =>
        li.id === id
          ? { ...li, ...updates, total: (updates.quantity ?? li.quantity) * (updates.unitPrice ?? li.unitPrice) }
          : li
      );
      const subtotal = lineItems.reduce((s, li) => s + li.total, 0);
      const taxAmount = subtotal * ((d.taxRate ?? 0) / 100);
      return { ...d, lineItems, subtotal, taxAmount, total: subtotal + taxAmount - (d.discountAmount ?? 0) };
    });
  };

  const addLineItem = () => {
    setDraft((d) => ({
      ...(d ?? {}),
      lineItems: [...(d?.lineItems ?? []), { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }],
    }));
  };

  const removeLineItem = (id: string) => {
    setDraft((d) => {
      if (!d) return d;
      const lineItems = (d.lineItems ?? []).filter((li) => li.id !== id);
      const subtotal = lineItems.reduce((s, li) => s + li.total, 0);
      const taxAmount = subtotal * ((d.taxRate ?? 0) / 100);
      return { ...d, lineItems, subtotal, taxAmount, total: subtotal + taxAmount - (d.discountAmount ?? 0) };
    });
  };

  /* Saving always goes through invoiceService — same path the manual
     form uses. By the time we get here, "AI-ness" no longer matters;
     this is just an invoice payload to persist. */
  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    try {
      const saved = await invoiceService.create(draft);
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate(`/billing/invoices/${saved.id}`);
      }, 900);
    } catch {
      setIsSaving(false);
    }
  };

  const reset = () => {
    setDraft(null);
    setStep("describe");
  };

  const bg = dark ? "bg-[#080a0f]" : "bg-zinc-50";
  const stepActive = "text-emerald-500 font-semibold";
  const stepDone = dark ? "text-zinc-400" : "text-zinc-500";
  const stepInactive = dark ? "text-zinc-700" : "text-zinc-300";

  return (
    <div className={`min-h-screen ${bg} transition-colors`}>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <React.Fragment key={s}>
              <span
                className={`text-xs font-medium transition-colors ${
                  i === stepIndex ? stepActive : i < stepIndex ? stepDone : stepInactive
                }`}
              >
                {i < stepIndex ? "✓ " : `${i + 1}. `}{s}
              </span>
              {i < STEPS.length - 1 && (
                <span className={`text-xs ${dark ? "text-zinc-800" : "text-zinc-300"}`}>
                  /
                </span>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Saved toast */}
        <AnimatePresence>
          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-emerald-500 text-white text-sm font-medium px-5 py-2.5 rounded-full shadow-xl"
            >
              ✓ Invoice saved successfully
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step content */}
        <AnimatePresence mode="wait">
          {step === "describe" && (
            <motion.div
              key="describe"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicePromptInput
                dark={dark}
                value={state.prompt}
                onChange={setPrompt}
                onGenerate={handleGenerate}
                isGenerating={state.isGenerating}
                error={state.error}
              />

              {/* Generating overlay */}
              <AnimatePresence>
                {state.isGenerating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="mt-10 flex flex-col items-center gap-3"
                  >
                    <div className="relative w-10 h-10">
                      <span className="absolute inset-0 rounded-full border-2 border-emerald-500/30 animate-ping" />
                      <span className="absolute inset-0 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
                    </div>
                    <p className={`text-sm ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                      AI is building your invoice…
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Prompt history */}
              {!state.isGenerating && (
                <div className="mt-12">
                  <PromptHistoryList dark={dark} runs={state.history} onReuse={handleReuse} />
                </div>
              )}
            </motion.div>
          )}

          {step === "preview" && draft && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicePreview
                dark={dark}
                invoice={draft}
                onEdit={() => setStep("edit")}
                onSave={handleSave}
                onReset={reset}
                isSaving={isSaving}
              />
            </motion.div>
          )}

          {step === "edit" && draft && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoiceEditor
                dark={dark}
                invoice={draft}
                onUpdate={updateInvoice}
                onUpdateLineItem={updateLineItem}
                onAddLineItem={addLineItem}
                onRemoveLineItem={removeLineItem}
                onPreview={() => setStep("preview")}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}