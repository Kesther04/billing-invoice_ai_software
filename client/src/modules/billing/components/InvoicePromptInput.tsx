import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  dark: boolean;
  value: string;
  onChange: (v: string) => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  error: string | null;
}

const EXAMPLES = [
  "Invoice Acme Corp $3,200 for website redesign, due in 30 days",
  "Bill Sarah Johnson $850 for 5 hours of consulting at $170/hr",
  "Create invoice for TechStartup Inc — $12,000 for 3-month SEO retainer",
  "Invoice $450 to Marcus Lee for logo design project",
];

export default function InvoicePromptInput({
  dark, value, onChange, onGenerate, isGenerating, error,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % EXAMPLES.length), 3500);
    return () => clearInterval(id);
  }, []);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim()) {
      e.preventDefault();
      onGenerate(value.trim());
    }
  };

  const bg = dark ? "bg-[#0f1117]" : "bg-white";
  const border = focused
    ? "border-emerald-500 ring-2 ring-emerald-500/20"
    : dark
    ? "border-zinc-700"
    : "border-zinc-200";

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 mb-4">
          <span className={`text-2xl ${dark ? "text-emerald-400" : "text-emerald-600"}`}>✦</span>
          <span
            className={`text-xs font-semibold tracking-[0.2em] uppercase ${
              dark ? "text-emerald-400" : "text-emerald-600"
            }`}
          >
            AI Invoice Generator
          </span>
        </div>
        <h1
          className={`text-3xl font-bold tracking-tight mb-2 ${
            dark ? "text-white" : "text-zinc-900"
          }`}
        >
          Describe your invoice
        </h1>
        <p className={`text-sm italic ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
          Write naturally and let our AI structure it for you
        </p>
      </div>

      {/* Prompt box */}
      <div
        className={`relative rounded-2xl border transition-all duration-200 ${bg} ${border}`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          rows={4}
          placeholder=""
          className={`w-full resize-none rounded-2xl px-5 pt-5 pb-16 text-base bg-transparent outline-none leading-relaxed ${
            dark ? "text-white placeholder:text-zinc-600" : "text-zinc-900 placeholder:text-zinc-400"
          }`}
        />

        {/* Animated placeholder */}
        {!value && (
          <div className="absolute top-5 left-5 pointer-events-none ">
            <AnimatePresence mode="wait">
              <motion.p
                key={hint}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.35 }}
                className={`text-base leading-relaxed ${
                  dark ? "text-zinc-600" : "text-zinc-400"
                }`}
              >
                {EXAMPLES[hint]}
              </motion.p>
            </AnimatePresence>
          </div>
        )}

        {/* Bottom bar */}
        <div
          className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 rounded-b-2xl ${
            dark ? "border-t border-zinc-800" : "border-t border-zinc-100"
          }`}
        >
          <span
            className={`text-xs ${dark ? "text-zinc-600" : "text-zinc-400"}`}
          >
            ⌘ + Enter to generate
          </span>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => value.trim() && onGenerate(value.trim())}
            disabled={!value.trim() || isGenerating}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              value.trim() && !isGenerating
                ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25"
                : dark
                ? "bg-zinc-800 text-zinc-600 cursor-not-allowed"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            }`}
          >
            {isGenerating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Generating…
              </>
            ) : (
              <>
                <span>✦</span>
                Generate Invoice
              </>
            )}
          </motion.button>
        </div>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-red-500 text-center"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Quick examples */}
      <div className="mt-6">
        <p
          className={`text-xs text-center mb-3 ${
            dark ? "text-zinc-600" : "text-zinc-400"
          }`}
        >
          Quick examples
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => onChange(ex)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                dark
                  ? "border-zinc-700 text-zinc-400 hover:border-emerald-500 hover:text-emerald-400"
                  : "border-zinc-200 text-zinc-500 hover:border-emerald-300 hover:text-emerald-600"
              }`}
            >
              {ex.split(" ").slice(0, 4).join(" ")}…
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}