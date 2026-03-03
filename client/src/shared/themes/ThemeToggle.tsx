import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

/* ══════════════════════════════════════════
   THEME TOGGLE
══════════════════════════════════════════ */
export default function ThemeToggle({
  dark,
  onToggle,
}: {
  dark: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle dark mode"
      className={`relative flex h-7 w-14 items-center rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:ring-offset-2 ${
        dark
          ? "bg-slate-700 focus:ring-offset-[#0F1117]"
          : "bg-slate-200 focus:ring-offset-white"
      }`}
    >
      <Sun
        className={`absolute left-1.5 h-3.5 w-3.5 transition-opacity duration-200 ${
          dark ? "opacity-30 text-slate-400" : "opacity-100 text-amber-500"
        }`}
      />
      <Moon
        className={`absolute right-1.5 h-3.5 w-3.5 transition-opacity duration-200 ${
          dark ? "opacity-100 text-slate-200" : "opacity-30 text-slate-400"
        }`}
      />
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 500, damping: 35 }}
        className={`h-5 w-5 rounded-full shadow-md ${
          dark ? "bg-slate-200 ml-auto" : "bg-white ml-0"
        }`}
      />
    </button>
  );
}