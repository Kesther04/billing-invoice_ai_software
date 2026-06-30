import { motion } from "framer-motion";
import type { PromptRun } from "../types";

interface Props {
  dark: boolean;
  runs: PromptRun[];
  onReuse: (prompt: string) => void;
}

function relTime(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (d < 1) return "Just now";
  if (d < 60) return `${d}m ago`;
  const h = Math.floor(d / 60);
  if (h < 24) return `${h}h ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function PromptHistoryList({ dark, runs, onReuse }: Props) {
  const card = dark ? "bg-[#0f1117] border-zinc-800" : "bg-white border-zinc-200";
  const muted = dark ? "text-zinc-500" : "text-zinc-400";

  if (runs.length === 0) {
    return (
      <div className={`rounded-2xl border p-8 text-center ${card}`}>
        <p className={`text-sm ${muted}`}>No prompts yet — your history will show up here once you generate an invoice.</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${card}`}>
      <div className={`px-5 py-3 border-b text-xs font-semibold uppercase tracking-wider ${dark ? "border-zinc-800 text-zinc-500" : "border-zinc-100 text-zinc-400"}`}>
        Recent Prompts
      </div>
      <div className="max-h-80 overflow-y-auto">
        {runs.map((run, i) => (
          <motion.button
            key={run.id}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            onClick={() => onReuse(run.prompt)}
            className={`w-full text-left flex items-start gap-3 px-5 py-3.5 border-b last:border-b-0 transition-colors ${
              dark ? "border-zinc-800/70 hover:bg-emerald-950/20" : "border-zinc-100 hover:bg-emerald-50/50"
            }`}
          >
            <span
              className={`mt-1 w-1.5 h-1.5 rounded-full shrink-0 ${
                run.status === "success" ? "bg-emerald-500" : "bg-red-400"
              }`}
            />
            <div className="flex-1 min-w-0">
              <p className={`text-sm truncate ${dark ? "text-zinc-300" : "text-zinc-700"}`}>{run.prompt}</p>
              <p className={`text-xs mt-0.5 ${muted}`}>
                {relTime(run.createdAt)}
                {run.status === "error" && run.error ? ` · ${run.error}` : ""}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}