import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mic, 
  SendHorizontal,
  CircleStop,
  Sparkles
} from "lucide-react";

interface Props {
  dark: boolean;
  value: string;
  onChange: (v: string) => void;
  onGenerate: (prompt: string) => void;
  isGenerating: boolean;
  error: string | null;
}
const EXAMPLES = [
  "Invoice John Doe at john@gmail.com for web development $1,500 and logo design $300. Due in 14 days.",
  "Bill Sarah Johnson at sarah@techcorp.com for 5 hours of consulting at $170/hr. Due in 7 days.",
  "Create invoice for TechStartup Inc at billing@techstartup.com, $12,000 SEO retainer. Due in 30 days.",
];

export default function InvoicePromptInput({
  dark, value, onChange, onGenerate, isGenerating, error,
}: Props) {
  const [focused, setFocused] = useState(false);
  const [hint, setHint] = useState(0);
  const [isListening, setIsListening] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const id = setInterval(() => setHint((h) => (h + 1) % EXAMPLES.length), 3500);
    return () => clearInterval(id);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            // Append final text to existing value
            onChange(value + (value ? ' ' : '') + event.results[i][0].transcript);
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [value, onChange]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey) && value.trim()) {
      e.preventDefault();
      onGenerate(value.trim());
    }
  };

  const bg = dark ? "bg-[#0f1117]" : "bg-white";
  const border = focused
    ? "border-emerald-500 ring-2 ring-emerald-500/10"
    : dark ? "border-zinc-800" : "border-zinc-200";

  return (
    <div className="w-full max-w-3xl mx-auto px-4">
      {/* Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
          <Sparkles size={14} className="text-emerald-500" />
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-500">
            TraqBill AI Assistant
          </span>
        </div>
        <h1 className={`text-3xl md:text-4xl font-bold tracking-tight mb-3 ${dark ? "text-white" : "text-zinc-900"}`}>
          What are we billing for?
        </h1>
        <p className={`text-base ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
          Type or speak naturally to generate a professional invoice.
        </p>
      </div>

      {/* Input Container */}
      <div className={`relative rounded-3xl border transition-all duration-500 ${bg} ${border} shadow-2xl`}>
        <div className="relative p-2">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKey}
            rows={5}
            className={`w-full resize-none bg-transparent px-6 pt-6 pb-16 text-lg outline-none leading-relaxed transition-all ${
              dark ? "text-white placeholder:text-zinc-700" : "text-zinc-900 placeholder:text-zinc-300"
            }`}
          />

          {/* Animated placeholder */}
          {!value && !isListening && (
            <div className="absolute top-8 left-8 pointer-events-none">
              <AnimatePresence mode="wait">
                <motion.p
                  key={hint}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className={`text-lg italic ${dark ? "text-zinc-700" : "text-zinc-400"}`}
                >
                  {EXAMPLES[hint]}
                </motion.p>
              </AnimatePresence>
            </div>
          )}

          {/* Listening Indicator Overlay */}
          {isListening && (
            <div className="absolute top-8 left-8 flex items-center gap-2 pointer-events-none">
              <span className="flex gap-1">
                <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-emerald-500 rounded-full" />
                <motion.span animate={{ height: [8, 16, 8] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }} className="w-1 bg-emerald-500 rounded-full" />
                <motion.span animate={{ height: [4, 12, 4] }} transition={{ repeat: Infinity, duration: 0.5, delay: 0.2 }} className="w-1 bg-emerald-500 rounded-full" />
              </span>
              <span className="text-emerald-500 text-sm font-medium animate-pulse">Listening...</span>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className={`flex items-center justify-between px-4 py-3 rounded-b-3xl border-t ${
          dark ? "border-zinc-800/50 bg-zinc-900/30" : "border-zinc-100 bg-zinc-50/50"
        }`}>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleListening}
              className={`group relative flex items-center gap-2 px-4 py-2 rounded-2xl transition-all ${
                isListening 
                  ? "bg-red-500 text-white" 
                  : dark ? "bg-zinc-800 text-zinc-400 hover:text-white" : "bg-zinc-200/50 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              {isListening ? (
                <>
                  <CircleStop size={18} />
                  <span className="text-sm font-semibold">Stop</span>
                </>
              ) : (
                <>
                  <Mic size={18} className="group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold">Voice</span>
                </>
              )}
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className={`hidden md:block text-[10px] font-bold tracking-widest uppercase ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
              {isGenerating ? "Processing" : "⌘ + Enter"}
            </span>

            <button
              onClick={() => value.trim() && onGenerate(value.trim())}
              disabled={!value.trim() || isGenerating}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-sm font-bold transition-all ${
                value.trim() && !isGenerating
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20"
                  : dark ? "bg-zinc-800 text-zinc-600" : "bg-zinc-100 text-zinc-300"
              }`}
            >
              {isGenerating ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Generate</span>
                  <SendHorizontal size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 text-center">
            <p className="text-sm text-red-500 font-medium bg-red-500/10 inline-block px-4 py-2 rounded-full border border-red-500/20">
              {error}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Examples Grid */}
      <div className="mt-12">
        <p className={`text-[10px] font-bold tracking-[0.2em] uppercase text-center mb-6 ${dark ? "text-zinc-600" : "text-zinc-400"}`}>
          Try these prompts
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => onChange(ex)}
              className={`text-xs text-left px-5 py-4 rounded-2xl border transition-all duration-300 group ${
                dark
                  ? "border-zinc-800 text-zinc-400 hover:border-emerald-500/50 hover:bg-zinc-900/50"
                  : "border-zinc-200 text-zinc-500 hover:border-emerald-200 hover:bg-emerald-50/30 shadow-sm"
              }`}
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium group-hover:text-emerald-500 transition-colors">Example {i + 1}</span>
                <span className="opacity-70">{ex}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}