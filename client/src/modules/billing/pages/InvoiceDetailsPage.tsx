import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTheme } from "../../../shared/themes/ThemeContext";
import type { Invoice } from "../types";
import InvoicePreview from "../components/InvoicePreview";
import { aiBillingService } from "../api";

export default function InvoiceDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { dark } = useTheme();

  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    aiBillingService.getInvoice(id)
      .then(setInvoice)
      .catch(() => setError("Invoice not found"))
      .finally(() => setLoading(false));
  }, [id]);

  const bg = dark ? "bg-[#080a0f]" : "bg-zinc-50";

  return (
    <div className={`min-h-screen ${bg} transition-colors`}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        {loading && (
          <div className="flex justify-center py-20">
            <span className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className={`text-lg font-medium mb-2 ${dark ? "text-zinc-300" : "text-zinc-700"}`}>
              {error}
            </p>
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-emerald-500 hover:text-emerald-400 transition-colors"
            >
              ← Go back
            </button>
          </motion.div>
        )}

        {invoice && (
          <InvoicePreview
            dark={dark}
            invoice={invoice}
            onEdit={() => navigate(`/billing/invoices/${id}/edit`)}
            onSave={() => {}}
            onReset={() => navigate(-1)}
          />
        )}
      </div>
    </div>
  );
}