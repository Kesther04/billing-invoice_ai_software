import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { LineItem } from "../types";

interface Props {
  dark: boolean;
  items: LineItem[];
  editable?: boolean;
  onUpdate?: (id: string, updates: Partial<LineItem>) => void;
  onAdd?: () => void;
  onRemove?: (id: string) => void;
}

const fmt = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

function EditableCell({
  value,
  onChange,
  type = "text",
  dark,
  align = "left",
  placeholder = "",
}: {
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  dark: boolean;
  align?: "left" | "right";
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full bg-transparent outline-none border-b border-transparent focus:border-indigo-500 pb-0.5 transition-colors text-sm ${
        align === "right" ? "text-right" : "text-left"
      } ${dark ? "text-zinc-200 placeholder:text-zinc-600" : "text-zinc-800 placeholder:text-zinc-400"}`}
    />
  );
}

export default function InvoiceLineItems({
  dark, items, editable = false, onUpdate, onAdd, onRemove,
}: Props) {
  const headerCls = `text-xs font-semibold uppercase tracking-wider pb-2 ${
    dark ? "text-zinc-500" : "text-zinc-400"
  }`;
  const rowBorder = dark ? "border-zinc-800" : "border-zinc-100";
  const valueCls = `text-sm ${dark ? "text-zinc-200" : "text-zinc-800"}`;

  return (
    <div className="w-full">
      {/* Header */}
      <div className={`grid grid-cols-12 gap-3 border-b pb-2 ${rowBorder}`}>
        <div className={`col-span-6 ${headerCls}`}>Description</div>
        <div className={`col-span-2 text-right ${headerCls}`}>Qty</div>
        <div className={`col-span-2 text-right ${headerCls}`}>Unit Price</div>
        <div className={`col-span-2 text-right ${headerCls}`}>Total</div>
      </div>

      {/* Rows */}
      <AnimatePresence initial={false}>
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className={`group grid grid-cols-12 gap-3 py-3 border-b ${rowBorder} items-center`}
          >
            <div className="col-span-6 flex items-center gap-2">
              {editable && onRemove && (
                <button
                  onClick={() => onRemove(item.id)}
                  className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity shrink-0 text-xs"
                >
                  ✕
                </button>
              )}
              {editable && onUpdate ? (
                <EditableCell
                  value={item.description}
                  onChange={(v) => onUpdate(item.id, { description: v })}
                  dark={dark}
                  placeholder="Item description"
                />
              ) : (
                <span className={valueCls}>{item.description}</span>
              )}
            </div>
            <div className="col-span-2 text-right">
              {editable && onUpdate ? (
                <EditableCell
                  value={item.quantity}
                  onChange={(v) => onUpdate(item.id, { quantity: parseFloat(v) || 0 })}
                  type="number"
                  dark={dark}
                  align="right"
                />
              ) : (
                <span className={valueCls}>{item.quantity}</span>
              )}
            </div>
            <div className="col-span-2 text-right">
              {editable && onUpdate ? (
                <EditableCell
                  value={item.unitPrice}
                  onChange={(v) => onUpdate(item.id, { unitPrice: parseFloat(v) || 0 })}
                  type="number"
                  dark={dark}
                  align="right"
                />
              ) : (
                <span className={valueCls}>{fmt(item.unitPrice)}</span>
              )}
            </div>
            <div className={`col-span-2 text-right font-medium ${valueCls}`}>
              {fmt(item.total)}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add row */}
      {editable && onAdd && (
        <button
          onClick={onAdd}
          className={`mt-3 text-xs font-medium flex items-center gap-1.5 transition-colors ${
            dark ? "text-zinc-500 hover:text-indigo-400" : "text-zinc-400 hover:text-indigo-600"
          }`}
        >
          <span className="text-base leading-none">+</span> Add line item
        </button>
      )}
    </div>
  );
}