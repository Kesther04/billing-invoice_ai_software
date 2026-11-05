import { motion, AnimatePresence } from "framer-motion";
import type { LineItem } from "../types";
import { formatCurrency, DEFAULT_CURRENCY } from "../../../shared/utils/formatCurrency";

interface Props {
  dark: boolean;
  items: LineItem[];
  currency?: string;
  editable?: boolean;
  onUpdate?: (id: string, updates: Partial<LineItem>) => void;
  onAdd?: () => void;
  onRemove?: (id: string) => void;
}

const fmt = (n: number, currency: string = DEFAULT_CURRENCY) => formatCurrency(n, currency);

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
  dark, items, currency = DEFAULT_CURRENCY, editable = false, onUpdate, onAdd, onRemove,
}: Props) {
  const headerCls = `text-xs font-semibold uppercase tracking-wider pb-2 ${
    dark ? "text-zinc-500" : "text-zinc-400"
  }`;
  const rowBorder = dark ? "border-zinc-800" : "border-zinc-100";
  const valueCls = `text-sm ${dark ? "text-zinc-200" : "text-zinc-800"}`;
  const mutedCls = dark ? "text-zinc-500" : "text-zinc-400";

  return (
    <div className="w-full">
      {/* Header — table columns only, hidden on small screens */}
      <div className={`hidden sm:grid grid-cols-12 gap-3 border-b pb-2 ${rowBorder}`}>
        <div className={`col-span-6 ${headerCls}`}>Description</div>
        <div className={`col-span-2 text-right ${headerCls}`}>Qty</div>
        <div className={`col-span-2 text-right ${headerCls}`}>Unit Price</div>
        <div className={`col-span-2 text-right ${headerCls}`}>Total</div>
      </div>

      {/* Rows */}
      <AnimatePresence initial={false}>
        {items.map((item) => {
          const lineTotal = !item.total ? item.unitPrice * item.quantity : item.total;
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className={`group border-b ${rowBorder} py-3`}
            >
              {/* ── Small screens: stacked card ── */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-start gap-2">
                  {editable && onRemove && (
                    <button
                      onClick={() => onRemove(item.id)}
                      className="text-red-400 hover:text-red-500 transition-opacity shrink-0 text-xs mt-1"
                    >
                      ✕
                    </button>
                  )}
                  {editable && onUpdate ? (
                    <div className="flex-1 min-w-0">
                      <EditableCell
                        value={item.description}
                        onChange={(v) => onUpdate(item.id, { description: v })}
                        dark={dark}
                        placeholder="Item description"
                      />
                    </div>
                  ) : (
                    <span className={`${valueCls} flex-1 min-w-0 break-words`}>{item.description}</span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 pl-0">
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider mb-0.5 ${mutedCls}`}>Qty</div>
                    {editable && onUpdate ? (
                      <EditableCell
                        value={item.quantity}
                        onChange={(v) => onUpdate(item.id, { quantity: parseFloat(v) || 0 })}
                        type="number"
                        dark={dark}
                        align="left"
                      />
                    ) : (
                      <span className={valueCls}>{item.quantity}</span>
                    )}
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider mb-0.5 ${mutedCls}`}>Unit Price</div>
                    {editable && onUpdate ? (
                      <EditableCell
                        value={item.unitPrice}
                        onChange={(v) => onUpdate(item.id, { unitPrice: parseFloat(v) || 0 })}
                        type="number"
                        dark={dark}
                        align="left"
                      />
                    ) : (
                      <span className={`${valueCls} break-words`}>{fmt(item.unitPrice, currency)}</span>
                    )}
                  </div>
                  <div>
                    <div className={`text-[10px] uppercase tracking-wider mb-0.5 ${mutedCls}`}>Total</div>
                    <span className={`font-medium ${valueCls} break-words`}>{fmt(lineTotal, currency)}</span>
                  </div>
                </div>
              </div>

              {/* ── sm and up: table row ── */}
              <div className="hidden sm:grid grid-cols-12 gap-3 items-center">
                <div className="col-span-6 flex items-center gap-2 min-w-0">
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
                    <span className={`${valueCls} truncate`}>{item.description}</span>
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
                    <span className={`${valueCls} truncate block`}>{fmt(item.unitPrice, currency)}</span>
                  )}
                </div>
                <div className={`col-span-2 text-right font-medium truncate ${valueCls}`}>
                  {fmt(lineTotal, currency)}
                </div>
              </div>
            </motion.div>
          );
        })}
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