import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { useInvoiceAI } from "../hooks/useInvoiceAI";
import InvoicePromptInput from "../components/InvoicePromptInput";
import InvoicePreview from "../components/InvoicePreview";
import InvoiceEditor from "../components/InvoiceEditor";

const STEPS = ["Describe", "Preview", "Edit"] as const;

export default function CreateInvoicePage() {
  const { dark } = useTheme();
  const {
    state,
    setPrompt,
    generate,
    updateInvoice,
    updateLineItem,
    addLineItem,
    removeLineItem,
    goToEdit,
    goToPreview,
    reset,
    save,
  } = useInvoiceAI();

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const stepIndex = state.step === "prompt" ? 0 : state.step === "preview" ? 1 : 2;

  const handleSave = async () => {
    setIsSaving(true);
    await save();
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
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
          {state.step === "prompt" && (
            <motion.div
              key="prompt"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicePromptInput
                dark={dark}
                value={state.prompt}
                onChange={setPrompt}
                onGenerate={generate}
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
            </motion.div>
          )}

          {state.step === "preview" && state.invoice && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicePreview
                dark={dark}
                invoice={state.invoice}
                onEdit={goToEdit}
                onSave={handleSave}
                onReset={reset}
                isSaving={isSaving}
              />
            </motion.div>
          )}

          {state.step === "edit" && state.invoice && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoiceEditor
                dark={dark}
                invoice={state.invoice}
                onUpdate={updateInvoice}
                onUpdateLineItem={updateLineItem}
                onAddLineItem={addLineItem}
                onRemoveLineItem={removeLineItem}
                onPreview={goToPreview}
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