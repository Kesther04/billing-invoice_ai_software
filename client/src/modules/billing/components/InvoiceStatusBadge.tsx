import type { InvoiceStatus } from "../types";

interface Props {
  status: InvoiceStatus;
  size?: "sm" | "md";
}

const config: Record<InvoiceStatus, { label: string; classes: string }> = {
  draft:     { label: "Draft",     classes: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  pending:   { label: "Pending",   classes: "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  paid:      { label: "Paid",      classes: "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  overdue:   { label: "Overdue",   classes: "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  cancelled: { label: "Cancelled", classes: "bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-500" },
};

const dot: Record<InvoiceStatus, string> = {
  draft:     "bg-zinc-400",
  pending:   "bg-amber-500",
  paid:      "bg-emerald-500",
  overdue:   "bg-red-500",
  cancelled: "bg-zinc-400",
};

export default function InvoiceStatusBadge({ status, size = "md" }: Props) {
  const { label, classes } = config[status];
  const px = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";
  return (
    <span className={`inline-flex items-center gap-1.5 font-medium rounded-full ${px} ${classes}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot[status]}`} />
      {label}
    </span>
  );
}