// import { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useTheme } from "../../../shared/themes/ThemeContext";
// import type { Invoice } from "../types";
// import InvoicePreview from "../components/InvoicePreview";
// import { aiBillingService } from "../api";

// export default function InvoiceDetailsPage() {
//   const { id } = useParams<{ id: string }>();
//   const navigate = useNavigate();
//   const { dark } = useTheme();

//   const [invoice, setInvoice] = useState<Invoice | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (!id) return;
//     aiBillingService.getInvoice(id)
//       .then(setInvoice)
//       .catch(() => setError("Invoice not found"))
//       .finally(() => setLoading(false));
//   }, [id]);

//   const bg = dark ? "bg-[#080a0f]" : "bg-zinc-50";

//   return (
//     <div className={`min-h-screen ${bg} transition-colors`}>
//       <div className="max-w-3xl mx-auto px-4 py-10">
//         {loading && (
//           <div className="flex justify-center py-20">
//             <span className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
//           </div>
//         )}

//         {error && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             className="text-center py-20"
//           >
//             <p className={`text-lg font-medium mb-2 ${dark ? "text-zinc-300" : "text-zinc-700"}`}>
//               {error}
//             </p>
//             <button
//               onClick={() => navigate(-1)}
//               className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
//             >
//               ← Go back
//             </button>
//           </motion.div>
//         )}

//         {invoice && (
//           <InvoicePreview
//             dark={dark}
//             invoice={invoice}
//             onEdit={() => navigate(`/billing/invoices/${id}/edit`)}
//             onSave={() => {}}
//             onReset={() => navigate(-1)}
//           />
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "../../../shared/themes/ThemeContext";
import { invoiceService } from "../api";
import type { Invoice, LineItem } from "../types";
import InvoicePreview from "../components/InvoicePreview";
import InvoiceEditor from "../components/InvoiceEditor";

type LocalView = "preview" | "edit";

function recalc(inv: Invoice): Invoice {
  const subtotal  = inv.lineItems.reduce((s, li) => s + li.total, 0);
  const taxAmount = subtotal * (inv.taxRate / 100);
  return { ...inv, subtotal, taxAmount, total: subtotal + taxAmount - inv.discountAmount };
}

export default function InvoiceDetailsPage() {
  const { dark } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [invoice, setInvoice]   = useState<Invoice | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [view, setView]         = useState<LocalView>("preview");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved]       = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    invoiceService
      .get(id)
      .then((inv) => setInvoice(inv))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const patch = (updates: Partial<Invoice>) => {
    setInvoice((inv) => (inv ? recalc({ ...inv, ...updates }) : inv));
  };

  const patchLineItem = (lineId: string, updates: Partial<LineItem>) => {
    setInvoice((inv) => {
      if (!inv) return inv;
      const lineItems = inv.lineItems.map((li) =>
        li.id === lineId
          ? { ...li, ...updates, total: (updates.quantity ?? li.quantity) * (updates.unitPrice ?? li.unitPrice) }
          : li
      );
      return recalc({ ...inv, lineItems });
    });
  };

  const addLineItem = () => {
    setInvoice((inv) =>
      inv
        ? { ...inv, lineItems: [...inv.lineItems, { id: crypto.randomUUID(), description: "", quantity: 1, unitPrice: 0, total: 0 }] }
        : inv
    );
  };

  const removeLineItem = (lineId: string) => {
    setInvoice((inv) => (inv ? recalc({ ...inv, lineItems: inv.lineItems.filter((li) => li.id !== lineId) }) : inv));
  };

  const handleSave = async () => {
    if (!invoice) return;
    setIsSaving(true);
    try {
      const result = await invoiceService.update(invoice.id, invoice);
      setInvoice(result);
      setView("preview");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const bg = dark ? "bg-[#080a0f]" : "bg-zinc-50";
  const muted = dark ? "text-zinc-500" : "text-zinc-400";

  if (isLoading) {
    return (
      <div className={`min-h-screen ${bg} flex items-center justify-center`}>
        <div className="w-6 h-6 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !invoice) {
    return (
      <div className={`min-h-screen ${bg} flex flex-col items-center justify-center gap-4 text-center px-4`}>
        <span className={`text-4xl ${muted}`}>◎</span>
        <p className={`text-sm ${muted}`}>This invoice doesn't exist or you don't have access to it.</p>
        <button
          onClick={() => navigate("/billing/invoices")}
          className={`text-xs font-medium ${dark ? "text-emerald-400 hover:text-emerald-300" : "text-emerald-600 hover:text-emerald-500"}`}
        >
          ← Back to invoices
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${bg} transition-colors`}>
      <div className="max-w-3xl mx-auto px-4 py-10">

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

        <AnimatePresence mode="wait">
          {view === "preview" ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoicePreview
                dark={dark}
                invoice={invoice}
                onEdit={() => setView("edit")}
                onSave={handleSave}
                onReset={() => navigate("/billing/invoices")}
                isSaving={isSaving}
              />
            </motion.div>
          ) : (
            <motion.div
              key="edit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <InvoiceEditor
                dark={dark}
                invoice={invoice}
                onUpdate={patch}
                onUpdateLineItem={patchLineItem}
                onAddLineItem={addLineItem}
                onRemoveLineItem={removeLineItem}
                onPreview={() => setView("preview")}
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