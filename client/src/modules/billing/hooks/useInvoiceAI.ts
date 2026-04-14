import { useState, useCallback } from "react";
// import { generateInvoiceFromPrompt, createInvoice } from "../api";
import { aiBillingService } from "../api";
// import type { AIInvoicePrompt, AIInvoiceResponse } from "../types";
import type { CreateInvoiceState, Invoice, LineItem } from "../types";
import { nanoid } from "nanoid";

// ── Mock AI response so the UI works without a backend ──────────────────────
function mockGenerateInvoice(prompt: string): Partial<Invoice> {
  const lower = prompt.toLowerCase();

  // Parse a dollar amount from prompt
  const amountMatch = prompt.match(/\$?([\d,]+(?:\.\d{2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1].replace(",", "")) : 500;

  // Parse a name for the client
  const forMatch = prompt.match(/for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
  const clientName = forMatch ? forMatch[1] : "Client";

  const serviceMatch =
    lower.match(/for\s+[\w\s]+?\s+(website|design|development|consulting|marketing|seo|logo|branding|writing|photography)/i)?.[1] ??
    "Professional Services";

  const today = new Date();
  const due = new Date(today);
  due.setDate(due.getDate() + 30);

  const lineItems: LineItem[] = [
    {
      id: nanoid(),
      description: serviceMatch.charAt(0).toUpperCase() + serviceMatch.slice(1),
      quantity: 1,
      unitPrice: amount,
      total: amount,
    },
  ];

  return {
    id: nanoid(),
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    status: "draft",
    from: {
      name: "Your Business",
      email: "hello@yourbusiness.com",
      address: "123 Business Ave, City, ST 00000",
    },
    to: {
      name: clientName,
      email: `${clientName.toLowerCase().replace(" ", ".")}@email.com`,
      address: "",
    },
    issueDate: today.toISOString().split("T")[0],
    dueDate: due.toISOString().split("T")[0],
    lineItems,
    subtotal: amount,
    taxRate: 10,
    taxAmount: amount * 0.1,
    discountAmount: 0,
    total: amount * 1.1,
    notes: "Thank you for your business!",
    currency: "USD",
    createdAt: today.toISOString(),
    updatedAt: today.toISOString(),
  };
}

export function useInvoiceAI() {
  const [state, setState] = useState<CreateInvoiceState>({
    step: "prompt",
    prompt: "",
    invoice: null,
    isGenerating: false,
    error: null,
  });

  const setPrompt = useCallback((prompt: string) => {
    setState((s) => ({ ...s, prompt }));
  }, []);

  const generate = useCallback(async (prompt: string) => {
    setState((s) => ({ ...s, isGenerating: true, error: null }));
    try {
      // Try real API first, fall back to mock
      let invoice: Partial<Invoice>;
      try {
        const res = await aiBillingService.generateInvoiceFromPrompt({ prompt });
        // res.invoice.total = res.invoice
        invoice = res.invoice;

        console.log(res);
      } catch (err) {
        // Simulate network latency for the mock
        console.error(err);
        console.error("AI generation failed, using mock data");
        await new Promise((r) => setTimeout(r, 1400));
        invoice = mockGenerateInvoice(prompt);
      }
      setState((s) => ({
        ...s,
        invoice,
        step: "preview",
        isGenerating: false,
        prompt,
      }));
    } catch (err: unknown) {
      setState((s) => ({
        ...s,
        isGenerating: false,
        error: err instanceof Error ? err.message : "Something went wrong",
      }));
    }
  }, []);

  const updateInvoice = useCallback((updates: Partial<Invoice>) => {
    setState((s) => ({
      ...s,
      invoice: s.invoice ? { ...s.invoice, ...updates } : updates,
    }));
  }, []);

  const updateLineItem = useCallback(
    (id: string, updates: Partial<LineItem>) => {
      setState((s) => {
        if (!s.invoice) return s;
        const lineItems = (s.invoice.lineItems ?? []).map((li) =>
          li.id === id
            ? {
                ...li,
                ...updates,
                total:
                  (updates.quantity ?? li.quantity) *
                  (updates.unitPrice ?? li.unitPrice),
              }
            : li
        );
        const subtotal = lineItems.reduce((a, li) => a + li.total, 0);
        const taxAmount = subtotal * ((s.invoice.taxRate ?? 0) / 100);
        return {
          ...s,
          invoice: {
            ...s.invoice,
            lineItems,
            subtotal,
            taxAmount,
            total: subtotal + taxAmount - (s.invoice.discountAmount ?? 0),
          },
        };
      });
    },
    []
  );

  const addLineItem = useCallback(() => {
    const newItem: LineItem = {
      id: nanoid(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    };
    setState((s) => ({
      ...s,
      invoice: s.invoice
        ? { ...s.invoice, lineItems: [...(s.invoice.lineItems ?? []), newItem] }
        : s.invoice,
    }));
  }, []);

  const removeLineItem = useCallback((id: string) => {
    setState((s) => {
      if (!s.invoice) return s;
      const lineItems = (s.invoice.lineItems ?? []).filter((li) => li.id !== id);
      const subtotal = lineItems.reduce((a, li) => a + li.total, 0);
      const taxAmount = subtotal * ((s.invoice.taxRate ?? 0) / 100);
      return {
        ...s,
        invoice: {
          ...s.invoice,
          lineItems,
          subtotal,
          taxAmount,
          total: subtotal + taxAmount - (s.invoice.discountAmount ?? 0),
        },
      };
    });
  }, []);

  const goToEdit = useCallback(() => {
    setState((s) => ({ ...s, step: "edit" }));
  }, []);

  const goToPreview = useCallback(() => {
    setState((s) => ({ ...s, step: "preview" }));
  }, []);

  const reset = useCallback(() => {
    setState({ step: "prompt", prompt: "", invoice: null, isGenerating: false, error: null });
  }, []);

  const save = useCallback(async (): Promise<Invoice | null> => {
    if (!state.invoice) return null;
    try {
      const saved = await aiBillingService.createInvoice(state.invoice);
      return saved;
    } catch {
      // Return invoice as-is when offline / no backend
      return state.invoice as Invoice;
    }
  }, [state.invoice]);

  return {
    state,
    setPrompt,
    generate,
    updateInvoice,
    updateLineItem,
    addLineItem,
    removeLineItem,
    goToEdit,
    goToPreview,
    reset,
    save,
  };
}