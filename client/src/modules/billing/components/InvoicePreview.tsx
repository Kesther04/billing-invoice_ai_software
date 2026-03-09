import { motion } from "framer-motion";
import type { Invoice } from "../types";
import InvoiceLineItems from "./InvoiceLineItems";
import InvoiceStatusBadge from "./InvoiceStatusBadge";

interface Props {
  dark: boolean;
  invoice: Partial<Invoice>;
  onEdit: () => void;
  onSave: () => void;
  onReset: () => void;
  isSaving?: boolean;
}

const fmt = (n = 0, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

function SummaryRow({
  label,
  value,
  bold,
  dark,
}: {
  label: string;
  value: string;
  bold?: boolean;
  dark: boolean;
}) {
  return (
    <div className={`flex justify-between items-center py-1.5 ${bold ? "pt-3 mt-1 border-t " + (dark ? "border-zinc-700" : "border-zinc-200") : ""}`}>
      <span
        className={`text-sm ${bold ? "font-semibold " + (dark ? "text-white" : "text-zinc-900") : dark ? "text-zinc-400" : "text-zinc-500"}`}
      >
        {label}
      </span>
      <span
        className={`text-sm ${bold ? "font-bold text-lg " + (dark ? "text-white" : "text-zinc-900") : dark ? "text-zinc-300" : "text-zinc-700"}`}
      >
        {value}
      </span>
    </div>
  );
}

export default function InvoicePreview({ dark, invoice, onEdit, onSave, onReset, isSaving }: Props) {
  const card = dark ? "bg-[#0f1117] border-zinc-800" : "bg-white border-zinc-200";
  const muted = dark ? "text-zinc-500" : "text-zinc-400";
  const label = `text-xs font-semibold uppercase tracking-wider mb-1 ${muted}`;
  const value = `text-sm font-medium ${dark ? "text-zinc-200" : "text-zinc-800"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Actions bar */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onReset}
          className={`text-sm flex items-center gap-1.5 ${dark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-700"} transition-colors`}
        >
          ← Back
        </button>
        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onEdit}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              dark
                ? "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                : "border-zinc-200 text-zinc-600 hover:border-zinc-400"
            }`}
          >
            Edit
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onSave}
            disabled={isSaving}
            className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save Invoice"}
          </motion.button>
        </div>
      </div>

      {/* Invoice card */}
      <div className={`rounded-2xl border p-8 ${card}`}>
        {/* Top row */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${muted}`}>Invoice</div>
            <h2 className={`text-2xl font-bold ${dark ? "text-white" : "text-zinc-900"}`}>
              {invoice.invoiceNumber ?? "—"}
            </h2>
          </div>
          <InvoiceStatusBadge status={invoice.status ?? "draft"} />
        </div>

        {/* From / To */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <p className={label}>From</p>
            <p className={value}>{invoice.from?.name ?? "—"}</p>
            {invoice.from?.company && <p className={`text-sm ${muted}`}>{invoice.from.company}</p>}
            {invoice.from?.email && <p className={`text-sm ${muted}`}>{invoice.from.email}</p>}
            {invoice.from?.address && <p className={`text-sm ${muted}`}>{invoice.from.address}</p>}
          </div>
          <div>
            <p className={label}>Bill To</p>
            <p className={value}>{invoice.to?.name ?? "—"}</p>
            {invoice.to?.company && <p className={`text-sm ${muted}`}>{invoice.to.company}</p>}
            {invoice.to?.email && <p className={`text-sm ${muted}`}>{invoice.to.email}</p>}
            {invoice.to?.address && <p className={`text-sm ${muted}`}>{invoice.to.address}</p>}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div>
            <p className={label}>Issue Date</p>
            <p className={value}>{invoice.issueDate ?? "—"}</p>
          </div>
          <div>
            <p className={label}>Due Date</p>
            <p className={value}>{invoice.dueDate ?? "—"}</p>
          </div>
          <div>
            <p className={label}>Currency</p>
            <p className={value}>{invoice.currency ?? "USD"}</p>
          </div>
        </div>

        {/* Divider */}
        <div className={`border-t mb-6 ${dark ? "border-zinc-800" : "border-zinc-100"}`} />

        {/* Line items */}
        <InvoiceLineItems
          dark={dark}
          items={invoice.lineItems ?? []}
          editable={false}
        />

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-64">
            <SummaryRow label="Subtotal" value={fmt(invoice.subtotal, invoice.currency)} dark={dark} />
            <SummaryRow label={`Tax (${invoice.taxRate ?? 0}%)`} value={fmt(invoice.taxAmount, invoice.currency)} dark={dark} />
            {(invoice.discountAmount ?? 0) > 0 && (
              <SummaryRow label="Discount" value={`-${fmt(invoice.discountAmount, invoice.currency)}`} dark={dark} />
            )}
            <SummaryRow label="Total" value={fmt(invoice.total, invoice.currency)} bold dark={dark} />
          </div>
        </div>

        {/* Notes */}
        {invoice.notes && (
          <div className={`mt-8 pt-6 border-t ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
            <p className={label}>Notes</p>
            <p className={`text-sm mt-1 ${dark ? "text-zinc-400" : "text-zinc-500"}`}>{invoice.notes}</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}