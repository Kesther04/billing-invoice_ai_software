import React from "react";
import { motion } from "framer-motion";
import type { Invoice, LineItem } from "../types";
import InvoiceLineItems from "./InvoiceLineItems";

interface Props {
  dark: boolean;
  invoice: Partial<Invoice>;
  onUpdate: (updates: Partial<Invoice>) => void;
  onUpdateLineItem: (id: string, updates: Partial<LineItem>) => void;
  onAddLineItem: () => void;
  onRemoveLineItem: (id: string) => void;
  onPreview: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

function Field({
  label,
  dark,
  children,
}: {
  label: string;
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
          dark ? "text-zinc-500" : "text-zinc-400"
        }`}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  dark,
  type = "text",
  placeholder = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  dark: boolean;
  type?: string;
  placeholder?: string;
}) {
  const base = `w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30`;
  const theme = dark
    ? "bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
    : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400";
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${base} ${theme}`}
    />
  );
}

function Textarea({
  value,
  onChange,
  dark,
  rows = 3,
  placeholder = "",
}: {
  value: string;
  onChange: (v: string) => void;
  dark: boolean;
  rows?: number;
  placeholder?: string;
}) {
  const base = `w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors resize-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30`;
  const theme = dark
    ? "bg-zinc-900 border-zinc-700 text-zinc-200 placeholder:text-zinc-600"
    : "bg-zinc-50 border-zinc-200 text-zinc-800 placeholder:text-zinc-400";
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`${base} ${theme}`}
    />
  );
}

const STATUSES = ["draft", "pending", "paid", "overdue", "cancelled"] as const;

export default function InvoiceEditor({
  dark,
  invoice,
  onUpdate,
  onUpdateLineItem,
  onAddLineItem,
  onRemoveLineItem,
  onPreview,
  onSave,
  isSaving,
}: Props) {
  const section = `rounded-2xl border p-6 mb-4 ${
    dark ? "bg-[#0f1117] border-zinc-800" : "bg-white border-zinc-200"
  }`;
  const heading = `text-sm font-semibold mb-4 ${dark ? "text-zinc-300" : "text-zinc-700"}`;
  const divider = `border-t my-6 ${dark ? "border-zinc-800" : "border-zinc-100"}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-3xl mx-auto"
    >
      {/* Actions */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={onPreview}
          className={`text-sm flex items-center gap-1.5 ${
            dark ? "text-zinc-500 hover:text-zinc-300" : "text-zinc-400 hover:text-zinc-700"
          } transition-colors`}
        >
          ← Preview
        </button>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={onSave}
          disabled={isSaving}
          className="px-5 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save Invoice"}
        </motion.button>
      </div>

      {/* Meta */}
      <div className={section}>
        <p className={heading}>Invoice Details</p>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Invoice Number" dark={dark}>
            <Input
              value={invoice.invoiceNumber ?? ""}
              onChange={(v) => onUpdate({ invoiceNumber: v })}
              dark={dark}
              placeholder="INV-001"
            />
          </Field>
          <Field label="Status" dark={dark}>
            <select
              value={invoice.status ?? "draft"}
              onChange={(e) => onUpdate({ status: e.target.value as Invoice["status"] })}
              className={`w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors focus:border-emerald-500 ${
                dark
                  ? "bg-zinc-900 border-zinc-700 text-zinc-200"
                  : "bg-zinc-50 border-zinc-200 text-zinc-800"
              }`}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Issue Date" dark={dark}>
            <Input
              type="date"
              value={invoice.issueDate ?? ""}
              onChange={(v) => onUpdate({ issueDate: v })}
              dark={dark}
            />
          </Field>
          <Field label="Due Date" dark={dark}>
            <Input
              type="date"
              value={invoice.dueDate ?? ""}
              onChange={(v) => onUpdate({ dueDate: v })}
              dark={dark}
            />
          </Field>
          <Field label="Currency" dark={dark}>
            <Input
              value={invoice.currency ?? "USD"}
              onChange={(v) => onUpdate({ currency: v })}
              dark={dark}
              placeholder="USD"
            />
          </Field>
          <Field label="Tax Rate (%)" dark={dark}>
            <Input
              type="number"
              value={invoice.taxRate ?? 0}
              onChange={(v) => onUpdate({ taxRate: parseFloat(v) || 0 })}
              dark={dark}
            />
          </Field>
        </div>
      </div>

      {/* Parties */}
      <div className={section}>
        <div className="grid grid-cols-2 gap-8">
          {/* From */}
          <div>
            <p className={heading}>From</p>
            <div className="space-y-3">
              <Field label="Name" dark={dark}>
                <Input value={invoice.from?.name ?? ""} onChange={(v) => onUpdate({ from: { ...invoice.from, name: v } })} dark={dark} placeholder="Your Name" />
              </Field>
              <Field label="Company" dark={dark}>
                <Input value={invoice.from?.company ?? ""} onChange={(v) => onUpdate({ from: { ...invoice.from, company: v } })} dark={dark} placeholder="Your Company" />
              </Field>
              <Field label="Email" dark={dark}>
                <Input type="email" value={invoice.from?.email ?? ""} onChange={(v) => onUpdate({ from: { ...invoice.from, email: v } })} dark={dark} placeholder="you@company.com" />
              </Field>
              <Field label="Address" dark={dark}>
                <Textarea value={invoice.from?.address ?? ""} onChange={(v) => onUpdate({ from: { ...invoice.from, address: v } })} dark={dark} rows={2} placeholder="Street, City, State ZIP" />
              </Field>
            </div>
          </div>

          {/* To */}
          <div>
            <p className={heading}>Bill To</p>
            <div className="space-y-3">
              <Field label="Name" dark={dark}>
                <Input value={invoice.to?.name ?? ""} onChange={(v) => onUpdate({ to: { ...invoice.to, name: v } })} dark={dark} placeholder="Client Name" />
              </Field>
              <Field label="Company" dark={dark}>
                <Input value={invoice.to?.company ?? ""} onChange={(v) => onUpdate({ to: { ...invoice.to, company: v } })} dark={dark} placeholder="Client Company" />
              </Field>
              <Field label="Email" dark={dark}>
                <Input type="email" value={invoice.to?.email ?? ""} onChange={(v) => onUpdate({ to: { ...invoice.to, email: v } })} dark={dark} placeholder="client@email.com" />
              </Field>
              <Field label="Address" dark={dark}>
                <Textarea value={invoice.to?.address ?? ""} onChange={(v) => onUpdate({ to: { ...invoice.to, address: v } })} dark={dark} rows={2} placeholder="Street, City, State ZIP" />
              </Field>
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className={section}>
        <p className={heading}>Line Items</p>
        <InvoiceLineItems
          dark={dark}
          items={invoice.lineItems ?? []}
          editable
          onUpdate={onUpdateLineItem}
          onAdd={onAddLineItem}
          onRemove={onRemoveLineItem}
        />

        <div className={divider} />

        {/* Totals */}
        <div className="flex justify-end">
          <div className="w-60 space-y-2">
            <div className="flex justify-between text-sm">
              <span className={dark ? "text-zinc-400" : "text-zinc-500"}>Subtotal</span>
              <span className={dark ? "text-zinc-300" : "text-zinc-700"}>${(invoice.subtotal ?? 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm items-center">
              <span className={dark ? "text-zinc-400" : "text-zinc-500"}>Tax ({invoice.taxRate ?? 0}%)</span>
              <span className={dark ? "text-zinc-300" : "text-zinc-700"}>${(invoice.taxAmount ?? 0).toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-sm font-bold pt-2 border-t ${dark ? "border-zinc-700 text-white" : "border-zinc-200 text-zinc-900"}`}>
              <span>Total</span>
              <span>${(invoice.total ?? 0).toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className={section}>
        <p className={heading}>Notes</p>
        <Textarea
          value={invoice.notes ?? ""}
          onChange={(v) => onUpdate({ notes: v })}
          dark={dark}
          rows={3}
          placeholder="Payment terms, thank you message, or any additional information…"
        />
      </div>
    </motion.div>
  );
}