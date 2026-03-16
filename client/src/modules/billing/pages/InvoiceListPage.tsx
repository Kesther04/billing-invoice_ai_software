import React, { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nanoid } from "nanoid";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { aiBillingService } from "../api";
import type { Invoice, InvoiceStatus, LineItem } from "../types";
import InvoiceEditor from "../components/InvoiceEditor";
import InvoicePreview from "../components/InvoicePreview";
import InvoiceStatusBadge from "../components/InvoiceStatusBadge";

/* ─────────────────────────────────────────────────────────────────
   TYPES  — view names mirror CreateInvoicePage's "step" concept
───────────────────────────────────────────────────────────────── */
type ViewName = "list" | "preview" | "edit" | "create";

interface ListViewState  { name: "list" }
interface PreviewState   { name: "preview";  invoice: Invoice }
interface EditState      { name: "edit";     invoice: Invoice }
interface CreateState    { name: "create";   invoice: Invoice }
type ViewState = ListViewState | PreviewState | EditState | CreateState;

/* ─────────────────────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────────────────────── */
const MOCK_INVOICES: Invoice[] = [
  {
    id: "inv-001", invoiceNumber: "INV-2041", status: "paid",
    from: { name: "Your Business", email: "hello@yourbusiness.com", address: "123 Business Ave, NY 10001" },
    to:   { name: "Acme Corp", email: "billing@acmecorp.com", company: "Acme Corp" },
    issueDate: "2025-02-01", dueDate: "2025-03-01",
    lineItems: [{ id: "l1", description: "Website Redesign", quantity: 1, unitPrice: 3200, total: 3200 }],
    subtotal: 3200, taxRate: 10, taxAmount: 320, discountAmount: 0, total: 3520,
    currency: "USD", notes: "Thank you for your business!",
    createdAt: "2025-02-01T10:00:00Z", updatedAt: "2025-02-01T10:00:00Z",
  },
  {
    id: "inv-002", invoiceNumber: "INV-2042", status: "pending",
    from: { name: "Your Business", email: "hello@yourbusiness.com", address: "123 Business Ave, NY 10001" },
    to:   { name: "Sarah Johnson", email: "sarah@email.com" },
    issueDate: "2025-02-10", dueDate: "2025-04-10",
    lineItems: [{ id: "l2", description: "5hrs Consulting @ $170/hr", quantity: 5, unitPrice: 170, total: 850 }],
    subtotal: 850, taxRate: 10, taxAmount: 85, discountAmount: 0, total: 935,
    currency: "USD",
    createdAt: "2025-02-10T09:00:00Z", updatedAt: "2025-02-10T09:00:00Z",
  },
  {
    id: "inv-003", invoiceNumber: "INV-2043", status: "overdue",
    from: { name: "Your Business", email: "hello@yourbusiness.com", address: "123 Business Ave, NY 10001" },
    to:   { name: "TechStartup Inc", email: "billing@techstartup.io", company: "TechStartup Inc" },
    issueDate: "2025-01-15", dueDate: "2025-02-15",
    lineItems: [{ id: "l3", description: "3-Month SEO Retainer", quantity: 3, unitPrice: 4000, total: 12000 }],
    subtotal: 12000, taxRate: 10, taxAmount: 1200, discountAmount: 0, total: 13200,
    currency: "USD",
    createdAt: "2025-01-15T08:00:00Z", updatedAt: "2025-01-15T08:00:00Z",
  },
  {
    id: "inv-004", invoiceNumber: "INV-2044", status: "draft",
    from: { name: "Your Business", email: "hello@yourbusiness.com", address: "123 Business Ave, NY 10001" },
    to:   { name: "Marcus Lee", email: "marcus@marcuslee.dev" },
    issueDate: "2025-02-20", dueDate: "2025-03-20",
    lineItems: [{ id: "l4", description: "Logo Design Package", quantity: 1, unitPrice: 450, total: 450 }],
    subtotal: 450, taxRate: 0, taxAmount: 0, discountAmount: 0, total: 450,
    currency: "USD",
    createdAt: "2025-02-20T11:00:00Z", updatedAt: "2025-02-20T11:00:00Z",
  },
  {
    id: "inv-005", invoiceNumber: "INV-2045", status: "paid",
    from: { name: "Your Business", email: "hello@yourbusiness.com", address: "123 Business Ave, NY 10001" },
    to:   { name: "Bright Agency", email: "hello@brightagency.co", company: "Bright Agency" },
    issueDate: "2025-01-20", dueDate: "2025-02-20",
    lineItems: [
      { id: "l5a", description: "Brand Strategy", quantity: 1, unitPrice: 3500, total: 3500 },
      { id: "l5b", description: "Social Media Kit", quantity: 1, unitPrice: 1200, total: 1200 },
    ],
    subtotal: 4700, taxRate: 10, taxAmount: 470, discountAmount: 200, total: 4970,
    currency: "USD",
    createdAt: "2025-01-20T14:00:00Z", updatedAt: "2025-01-20T14:00:00Z",
  },
  {
    id: "inv-006", invoiceNumber: "INV-2046", status: "pending",
    from: { name: "Your Business", email: "hello@yourbusiness.com", address: "123 Business Ave, NY 10001" },
    to:   { name: "Vertex Solutions", email: "finance@vertex.io", company: "Vertex Solutions" },
    issueDate: "2025-02-25", dueDate: "2025-04-01",
    lineItems: [
      { id: "l6a", description: "UI/UX Audit", quantity: 1, unitPrice: 2800, total: 2800 },
      { id: "l6b", description: "Wireframes – 20 screens", quantity: 20, unitPrice: 75, total: 1500 },
    ],
    subtotal: 4300, taxRate: 10, taxAmount: 430, discountAmount: 0, total: 4730,
    currency: "USD",
    createdAt: "2025-02-25T09:00:00Z", updatedAt: "2025-02-25T09:00:00Z",
  },
];

/* ─────────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────────── */
const fmt = (n = 0, c = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: c, maximumFractionDigits: 0 }).format(n);

function relDate(iso: string) {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 30) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function makeFreshInvoice(): Invoice {
  const today = new Date();
  const due   = new Date(today);
  due.setDate(due.getDate() + 30);
  return {
    id: nanoid(),
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    status: "draft",
    from: { name: "", email: "", address: "" },
    to:   { name: "", email: "", company: "", address: "" },
    issueDate: today.toISOString().split("T")[0],
    dueDate:   due.toISOString().split("T")[0],
    lineItems: [{ id: nanoid(), description: "", quantity: 1, unitPrice: 0, total: 0 }],
    subtotal: 0, taxRate: 10, taxAmount: 0, discountAmount: 0, total: 0,
    currency: "USD", notes: "",
    createdAt: today.toISOString(), updatedAt: today.toISOString(),
  };
}

function recalc(inv: Invoice): Invoice {
  const subtotal  = inv.lineItems.reduce((s, li) => s + li.total, 0);
  const taxAmount = subtotal * (inv.taxRate / 100);
  return { ...inv, subtotal, taxAmount, total: subtotal + taxAmount - inv.discountAmount };
}

/* Step indicator labels — same visual pattern as CreateInvoicePage */
// const STEP_MAP: Record<ViewName, string> = {
//   list:    "All Invoices",
//   preview: "Preview",
//   edit:    "Edit",
//   create:  "New Invoice",
// };

const FILTER_TABS: { value: InvoiceStatus | "all"; label: string }[] = [
  { value: "all",       label: "All" },
  { value: "draft",     label: "Draft" },
  { value: "pending",   label: "Pending" },
  { value: "paid",      label: "Paid" },
  { value: "overdue",   label: "Overdue" },
  { value: "cancelled", label: "Cancelled" },
];

/* ─────────────────────────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────────────────────────── */
export default function InvoiceListPage() {
  const { dark } = useTheme();

  /* ── state ─────────────────────────────────────────────────── */
  const [invoices, setInvoices]         = useState<Invoice[]>(MOCK_INVOICES);
  const [view, setView]                 = useState<ViewState>({ name: "list" });
  const [query, setQuery]               = useState("");
  const [activeFilter, setActiveFilter] = useState<InvoiceStatus | "all">("all");
  const [isSaving, setIsSaving]         = useState(false);
  const [saved, setSaved]               = useState(false);

  /* ── load from API (falls back to mock on error) ───────────── */
  useEffect(() => {
    aiBillingService.listInvoices().then(setInvoices).catch(() => {});
  }, []);

  /* ── derived ────────────────────────────────────────────────── */
  const filtered = useMemo(() =>
    invoices.filter((inv) => {
      const q = query.toLowerCase();
      const matchQ = !q
        || inv.invoiceNumber.toLowerCase().includes(q)
        || (inv.to.name ?? "").toLowerCase().includes(q)
        || (inv.to.company ?? "").toLowerCase().includes(q);
      return matchQ && (activeFilter === "all" || inv.status === activeFilter);
    }),
  [invoices, query, activeFilter]);

  /* ── active invoice helper ──────────────────────────────────── */
  const activeInvoice: Invoice | null =
    view.name === "preview" || view.name === "edit" || view.name === "create"
      ? (view as PreviewState | EditState | CreateState).invoice
      : null;

  /* ── invoice mutation ───────────────────────────────────────── */
  const patchActive = useCallback((updates: Partial<Invoice>) => {
    setView((v) => {
      if (v.name !== "edit" && v.name !== "create") return v;
      return { ...v, invoice: recalc({ ...v.invoice, ...updates }) };
    });
  }, []);

  const patchLineItem = useCallback((id: string, updates: Partial<LineItem>) => {
    setView((v) => {
      if (v.name !== "edit" && v.name !== "create") return v;
      const lineItems = v.invoice.lineItems.map((li) =>
        li.id === id
          ? { ...li, ...updates, total: (updates.quantity ?? li.quantity) * (updates.unitPrice ?? li.unitPrice) }
          : li
      );
      return { ...v, invoice: recalc({ ...v.invoice, lineItems }) };
    });
  }, []);

  const addLineItem = useCallback(() => {
    setView((v) => {
      if (v.name !== "edit" && v.name !== "create") return v;
      return {
        ...v,
        invoice: {
          ...v.invoice,
          lineItems: [
            ...v.invoice.lineItems,
            { id: nanoid(), description: "", quantity: 1, unitPrice: 0, total: 0 },
          ],
        },
      };
    });
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setView((v) => {
      if (v.name !== "edit" && v.name !== "create") return v;
      return { ...v, invoice: recalc({ ...v.invoice, lineItems: v.invoice.lineItems.filter((li) => li.id !== id) }) };
    });
  }, []);

  /* ── save ───────────────────────────────────────────────────── */
  const handleSave = useCallback(async () => {
    if (!activeInvoice) return;
    setIsSaving(true);
    try {
      let result: Invoice;
      if (view.name === "create") {
        result = await aiBillingService.createInvoice(activeInvoice).catch(() => activeInvoice as Invoice);
        setInvoices((prev) => [result, ...prev]);
      } else {
        result = await aiBillingService.updateInvoice(activeInvoice.id, activeInvoice).catch(() => activeInvoice);
        setInvoices((prev) => prev.map((i) => (i.id === result.id ? result : i)));
      }
      setView({ name: "preview", invoice: result });
    } finally {
      setIsSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
  }, [activeInvoice, view.name]);

  /* ── step indicator logic — same pattern as CreateInvoicePage ── */
  const steps: { name: ViewName; label: string }[] = view.name === "list"
    ? [{ name: "list", label: "All Invoices" }]
    : view.name === "create"
    ? [
        { name: "list",   label: "All Invoices" },
        { name: "create", label: "New Invoice"   },
      ]
    : [
        { name: "list",    label: "All Invoices" },
        { name: "preview", label: "Preview"      },
        ...(view.name === "edit" ? [{ name: "edit" as ViewName, label: "Edit" }] : []),
      ];

  /* ── theme shortcuts ────────────────────────────────────────── */
  const bg     = dark ? "bg-[#080a0f]" : "bg-zinc-50";
  const card   = dark ? "bg-[#0f1117] border-zinc-800" : "bg-white border-zinc-200";
  const muted  = dark ? "text-zinc-500" : "text-zinc-400";
  const strong = dark ? "text-zinc-100" : "text-zinc-900";

  const stepActive   = "text-emerald-500 font-semibold";
  const stepDone     = dark ? "text-zinc-400" : "text-zinc-500";
  const stepInactive = dark ? "text-zinc-700" : "text-zinc-300";

  /* ─────────────────────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────────────────────── */
  return (
    <div className={`min-h-screen ${bg} transition-colors`}>
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* ── Step indicator — identical pattern to CreateInvoicePage ── */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {steps.map((s, i) => {
            const isCurrent = s.name === view.name;
            const isPast    = i < steps.findIndex((x) => x.name === view.name);
            return (
              <React.Fragment key={s.name}>
                <button
                  onClick={() => {
                    if (s.name === "list") setView({ name: "list" });
                    else if (s.name === "preview" && activeInvoice) setView({ name: "preview", invoice: activeInvoice });
                  }}
                  className={`text-xs font-medium transition-colors ${
                    isCurrent ? stepActive : isPast ? stepDone : stepInactive
                  } ${(s.name === "list" || (s.name === "preview" && activeInvoice)) ? "cursor-pointer hover:text-emerald-400" : "cursor-default"}`}
                >
                  {isPast ? "✓ " : `${i + 1}. `}{s.label}
                </button>
                {i < steps.length - 1 && (
                  <span className={`text-xs ${dark ? "text-zinc-800" : "text-zinc-300"}`}>/</span>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ── Saved toast — identical to CreateInvoicePage ── */}
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

        {/* ── Step content — AnimatePresence mirrors CreateInvoicePage ── */}
        <AnimatePresence mode="wait">

          {/* ════════════ VIEW: LIST ════════════ */}
          {view.name === "list" && (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header — same ✦ mark + subtitle style as InvoicePromptInput */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className={`text-2xl ${dark ? "text-emerald-400" : "text-emerald-600"}`}>✦</span>
                  <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
                    Billing
                  </span>
                </div>
                <h1 className={`text-3xl font-bold tracking-tight mb-2 ${dark ? "text-white" : "text-zinc-900"}`}>
                  Your Invoices
                </h1>
                <p className={`text-sm italic ${muted}`}>
                  {invoices.length} total · click any invoice to view or edit
                </p>
              </div>

              {/* ── Create new invoice button — same style as Generate button ── */}
              <div className="flex items-center justify-center mb-8">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView({ name: "create", invoice: makeFreshInvoice() })}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/25 transition-all"
                >
                  <span>✦</span>
                  Create New Invoice
                </motion.button>
              </div>

              {/* ── Search + filter (inside a card — same card style) ── */}
              <div className={`rounded-2xl border mb-4 overflow-hidden ${card}`}>
                {/* Search row */}
                <div className={`flex items-center gap-3 px-4 py-3 border-b ${dark ? "border-zinc-800" : "border-zinc-100"}`}>
                  <span className={`text-sm ${muted}`}>⌕</span>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by client, company, or invoice number…"
                    className={`flex-1 bg-transparent text-sm outline-none ${dark ? "text-zinc-200 placeholder:text-zinc-600" : "text-zinc-800 placeholder:text-zinc-400"}`}
                  />
                  {query && (
                    <button
                      onClick={() => setQuery("")}
                      className={`text-xs ${muted} hover:text-zinc-300 transition-colors`}
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filter tabs */}
                <div className={`flex items-center gap-1 px-3 py-2 ${dark ? "bg-zinc-900/30" : "bg-zinc-50"}`}>
                  {FILTER_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setActiveFilter(tab.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        activeFilter === tab.value
                          ? "bg-emerald-500 text-white shadow-sm shadow-emerald-500/30"
                          : dark
                          ? "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                          : "text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                  <span className={`ml-auto text-xs ${muted}`}>
                    {filtered.length} invoice{filtered.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* ── Invoice list — inside same rounded-2xl border card ── */}
              <div className={`rounded-2xl border overflow-hidden ${card}`}>
                <AnimatePresence initial={false}>
                  {filtered.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center py-20 gap-4 text-center"
                    >
                      <span className={`text-4xl ${muted}`}>◎</span>
                      <p className={`text-sm ${muted}`}>
                        {query || activeFilter !== "all"
                          ? "No invoices match your search or filter"
                          : "No invoices yet — create your first one"}
                      </p>
                      {!query && activeFilter === "all" && (
                        <button
                          onClick={() => setView({ name: "create", invoice: makeFreshInvoice() })}
                          className={`text-xs font-medium transition-colors ${dark ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-500"}`}
                        >
                          + Create invoice →
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    filtered.map((inv, i) => (
                      <motion.button
                        key={inv.id}
                        layout
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.22 }}
                        onClick={() => setView({ name: "preview", invoice: inv })}
                        className={`group w-full text-left flex items-center gap-4 px-5 py-4 border-b last:border-b-0 transition-all ${
                          dark
                            ? "border-zinc-800/70 hover:bg-emerald-950/20"
                            : "border-zinc-100 hover:bg-emerald-50/50"
                        }`}
                      >
                        {/* Left accent */}
                        <div className={`w-0.5 self-stretch rounded-full transition-all ${
                          dark ? "bg-zinc-800 group-hover:bg-emerald-500" : "bg-zinc-100 group-hover:bg-emerald-400"
                        }`} />

                        {/* Icon */}
                        <div className={`shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                          dark
                            ? "bg-zinc-800 group-hover:bg-emerald-500/15"
                            : "bg-zinc-100 group-hover:bg-emerald-100"
                        }`}>
                          <span className={`text-sm font-bold transition-colors ${
                            dark
                              ? "text-zinc-500 group-hover:text-emerald-400"
                              : "text-zinc-400 group-hover:text-emerald-600"
                          }`}>
                            ₿
                          </span>
                        </div>

                        {/* Main text */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-sm font-bold font-mono tracking-tight ${strong}`}>
                              {inv.invoiceNumber}
                            </span>
                            <InvoiceStatusBadge status={inv.status} size="sm" />
                          </div>
                          <p className={`text-xs truncate ${muted}`}>
                            {inv.to.name}
                            {inv.to.company ? ` · ${inv.to.company}` : ""}
                            {" · "}
                            {relDate(inv.issueDate)}
                          </p>
                        </div>

                        {/* Amount + due */}
                        <div className="text-right shrink-0">
                          <p className={`text-sm font-bold ${strong}`}>
                            {fmt(inv.total, inv.currency)}
                          </p>
                          <p className={`text-xs ${muted}`}>
                            Due {new Date(inv.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                          </p>
                        </div>

                        {/* Arrow */}
                        <span className={`text-sm transition-all ${muted} opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5`}>
                          →
                        </span>
                      </motion.button>
                    ))
                  )}
                </AnimatePresence>

                {/* Footer total */}
                {filtered.length > 0 && (
                  <div className={`flex justify-between items-center px-5 py-3 border-t text-xs ${dark ? "border-zinc-800 text-zinc-600" : "border-zinc-100 text-zinc-400"}`}>
                    <span>{filtered.length} of {invoices.length} invoices</span>
                    <span className={`font-semibold ${dark ? "text-zinc-300" : "text-zinc-700"}`}>
                      {fmt(filtered.reduce((s, i) => s + i.total, 0))} total
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ════════════ VIEW: PREVIEW ════════════ */}
          {view.name === "preview" && activeInvoice && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* InvoicePreview — exact same usage as CreateInvoicePage */}
              <InvoicePreview
                dark={dark}
                invoice={activeInvoice}
                onEdit={() => setView({ name: "edit", invoice: activeInvoice })}
                onSave={handleSave}
                onReset={() => setView({ name: "list" })}
                isSaving={isSaving}
              />
            </motion.div>
          )}

          {/* ════════════ VIEW: EDIT ════════════ */}
          {view.name === "edit" && activeInvoice && (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* InvoiceEditor — exact same usage as CreateInvoicePage */}
              <InvoiceEditor
                dark={dark}
                invoice={activeInvoice}
                onUpdate={patchActive}
                onUpdateLineItem={patchLineItem}
                onAddLineItem={addLineItem}
                onRemoveLineItem={removeLineItem}
                onPreview={() => setView({ name: "preview", invoice: activeInvoice })}
                onSave={handleSave}
                isSaving={isSaving}
              />
            </motion.div>
          )}

          {/* ════════════ VIEW: CREATE (manual new invoice) ════════════ */}
          {view.name === "create" && activeInvoice && (
            <motion.div
              key="create"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header — matches InvoicePromptInput header style exactly */}
              <div className="mb-8 text-center">
                <div className="inline-flex items-center gap-2 mb-4">
                  <span className={`text-2xl ${dark ? "text-emerald-400" : "text-emerald-600"}`}>✦</span>
                  <span className={`text-xs font-semibold tracking-[0.2em] uppercase ${dark ? "text-emerald-400" : "text-emerald-600"}`}>
                    New Invoice
                  </span>
                </div>
                <h1 className={`text-3xl font-bold tracking-tight mb-2 ${dark ? "text-white" : "text-zinc-900"}`}>
                  Create an invoice
                </h1>
                <p className={`text-sm italic ${dark ? "text-zinc-400" : "text-zinc-500"}`}>
                  Fill in the details below and save when ready
                </p>
              </div>

              {/* InvoiceEditor reused — same props shape as edit view */}
              <InvoiceEditor
                dark={dark}
                invoice={activeInvoice}
                onUpdate={patchActive}
                onUpdateLineItem={patchLineItem}
                onAddLineItem={addLineItem}
                onRemoveLineItem={removeLineItem}
                onPreview={() => setView({ name: "preview", invoice: activeInvoice })}
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