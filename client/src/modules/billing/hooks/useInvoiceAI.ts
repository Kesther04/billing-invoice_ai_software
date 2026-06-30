// import { useState, useCallback } from "react";
// // import { generateInvoiceFromPrompt, createInvoice } from "../api";
// import { aiBillingService } from "../api";
// // import type { AIInvoicePrompt, AIInvoiceResponse } from "../types";
// import type { CreateInvoiceState, Invoice, LineItem } from "../types";
// import { nanoid } from "nanoid";

// // ── Mock AI response so the UI works without a backend ──────────────────────
// function mockGenerateInvoice(prompt: string): Partial<Invoice> {
//   const lower = prompt.toLowerCase();

//   // Parse a dollar amount from prompt
//   const amountMatch = prompt.match(/\$?([\d,]+(?:\.\d{2})?)/);
//   const amount = amountMatch ? parseFloat(amountMatch[1].replace(",", "")) : 500;

//   // Parse a name for the client
//   const forMatch = prompt.match(/for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/);
//   const clientName = forMatch ? forMatch[1] : "Client";

//   const serviceMatch =
//     lower.match(/for\s+[\w\s]+?\s+(website|design|development|consulting|marketing|seo|logo|branding|writing|photography)/i)?.[1] ??
//     "Professional Services";

//   const today = new Date();
//   const due = new Date(today);
//   due.setDate(due.getDate() + 30);

//   const lineItems: LineItem[] = [
//     {
//       id: nanoid(),
//       description: serviceMatch.charAt(0).toUpperCase() + serviceMatch.slice(1),
//       quantity: 1,
//       unitPrice: amount,
//       total: amount,
//     },
//   ];

//   return {
//     id: nanoid(),
//     invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
//     status: "draft",
//     from: {
//       name: "Your Business",
//       email: "hello@yourbusiness.com",
//       address: "123 Business Ave, City, ST 00000",
//     },
//     to: {
//       name: clientName,
//       email: `${clientName.toLowerCase().replace(" ", ".")}@email.com`,
//       address: "",
//     },
//     issueDate: today.toISOString().split("T")[0],
//     dueDate: due.toISOString().split("T")[0],
//     lineItems,
//     subtotal: amount,
//     taxRate: 10,
//     taxAmount: amount * 0.1,
//     discountAmount: 0,
//     total: amount * 1.1,
//     notes: "Thank you for your business!",
//     currency: "USD",
//     createdAt: today.toISOString(),
//     updatedAt: today.toISOString(),
//   };
// }

// export function useInvoiceAI() {
//   const [state, setState] = useState<CreateInvoiceState>({
//     step: "prompt",
//     prompt: "",
//     invoice: null,
//     isGenerating: false,
//     error: null,
//   });

//   const setPrompt = useCallback((prompt: string) => {
//     setState((s) => ({ ...s, prompt }));
//   }, []);

//   const generate = useCallback(async (prompt: string) => {
//     setState((s) => ({ ...s, isGenerating: true, error: null }));
//     try {
//       // Try real API first, fall back to mock
//       let invoice: Partial<Invoice>;
//       try {
//         const res = await aiBillingService.generateInvoiceFromPrompt({ prompt });
//         // res.invoice.total = res.invoice
//         invoice = res.invoice;

//         console.log(res);
//       } catch (err) {
//         // Simulate network latency for the mock
//         console.error(err);
//         console.error("AI generation failed, using mock data");
//         await new Promise((r) => setTimeout(r, 1400));
//         invoice = mockGenerateInvoice(prompt);
//       }
//       setState((s) => ({
//         ...s,
//         invoice,
//         step: "preview",
//         isGenerating: false,
//         prompt,
//       }));
//     } catch (err: unknown) {
//       setState((s) => ({
//         ...s,
//         isGenerating: false,
//         error: err instanceof Error ? err.message : "Something went wrong",
//       }));
//     }
//   }, []);

//   const updateInvoice = useCallback((updates: Partial<Invoice>) => {
//     setState((s) => ({
//       ...s,
//       invoice: s.invoice ? { ...s.invoice, ...updates } : updates,
//     }));
//   }, []);

//   const updateLineItem = useCallback(
//     (id: string, updates: Partial<LineItem>) => {
//       setState((s) => {
//         if (!s.invoice) return s;
//         const lineItems = (s.invoice.lineItems ?? []).map((li) =>
//           li.id === id
//             ? {
//                 ...li,
//                 ...updates,
//                 total:
//                   (updates.quantity ?? li.quantity) *
//                   (updates.unitPrice ?? li.unitPrice),
//               }
//             : li
//         );
//         const subtotal = lineItems.reduce((a, li) => a + li.total, 0);
//         const taxAmount = subtotal * ((s.invoice.taxRate ?? 0) / 100);
//         return {
//           ...s,
//           invoice: {
//             ...s.invoice,
//             lineItems,
//             subtotal,
//             taxAmount,
//             total: subtotal + taxAmount - (s.invoice.discountAmount ?? 0),
//           },
//         };
//       });
//     },
//     []
//   );

//   const addLineItem = useCallback(() => {
//     const newItem: LineItem = {
//       id: nanoid(),
//       description: "",
//       quantity: 1,
//       unitPrice: 0,
//       total: 0,
//     };
//     setState((s) => ({
//       ...s,
//       invoice: s.invoice
//         ? { ...s.invoice, lineItems: [...(s.invoice.lineItems ?? []), newItem] }
//         : s.invoice,
//     }));
//   }, []);

//   const removeLineItem = useCallback((id: string) => {
//     setState((s) => {
//       if (!s.invoice) return s;
//       const lineItems = (s.invoice.lineItems ?? []).filter((li) => li.id !== id);
//       const subtotal = lineItems.reduce((a, li) => a + li.total, 0);
//       const taxAmount = subtotal * ((s.invoice.taxRate ?? 0) / 100);
//       return {
//         ...s,
//         invoice: {
//           ...s.invoice,
//           lineItems,
//           subtotal,
//           taxAmount,
//           total: subtotal + taxAmount - (s.invoice.discountAmount ?? 0),
//         },
//       };
//     });
//   }, []);

//   const goToEdit = useCallback(() => {
//     setState((s) => ({ ...s, step: "edit" }));
//   }, []);

//   const goToPreview = useCallback(() => {
//     setState((s) => ({ ...s, step: "preview" }));
//   }, []);

//   const reset = useCallback(() => {
//     setState({ step: "prompt", prompt: "", invoice: null, isGenerating: false, error: null });
//   }, []);

//   const save = useCallback(async (): Promise<Invoice | null> => {
//     if (!state.invoice) return null;
//     try {
//       const saved = await aiBillingService.createInvoice(state.invoice);
//       return saved;
//     } catch {
//       // Return invoice as-is when offline / no backend
//       return state.invoice as Invoice;
//     }
//   }, [state.invoice]);

//   return {
//     state,
//     setPrompt,
//     generate,
//     updateInvoice,
//     updateLineItem,
//     addLineItem,
//     removeLineItem,
//     goToEdit,
//     goToPreview,
//     reset,
//     save,
//   };
// }

import { useCallback, useState } from "react";
import { nanoid } from "nanoid";
import { aiService } from "../api";
import type { Invoice, PromptRun } from "../types";

interface UseInvoiceAIState {
  prompt: string;
  isGenerating: boolean;
  error: string | null;
  history: PromptRun[];
  isLoadingHistory: boolean;
}

export function useInvoiceAI() {
  const [state, setState] = useState<UseInvoiceAIState>({
    prompt: "",
    isGenerating: false,
    error: null,
    history: [],
    isLoadingHistory: false,
  });

  const setPrompt = useCallback((prompt: string) => {
    setState((s) => ({ ...s, prompt, error: null }));
  }, []);

  /* Generate a draft from a prompt. Returns the draft (or null on failure)
     so the caller decides what to do next — it never saves anything itself. */
  const generate = useCallback(async (prompt: string): Promise<Partial<Invoice> | null> => {
    setState((s) => ({ ...s, isGenerating: true, error: null }));
    const run: PromptRun = {
      id: nanoid(),
      prompt,
      createdAt: new Date().toISOString(),
      status: "success",
    };
    try {
      const { draft } = await aiService.generate(prompt);
      run.draft = draft;
      setState((s) => ({
        ...s,
        isGenerating: false,
        history: [run, ...s.history],
      }));
      return draft;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Couldn't parse that prompt — try rephrasing it.";
      run.status = "error";
      run.error = message;
      setState((s) => ({
        ...s,
        isGenerating: false,
        error: message,
        history: [run, ...s.history],
      }));
      return null;
    }
  }, []);

  const loadHistory = useCallback(async () => {
    setState((s) => ({ ...s, isLoadingHistory: true }));
    try {
      const history = await aiService.listPromptHistory();
      setState((s) => ({ ...s, history, isLoadingHistory: false }));
    } catch {
      // Non-critical — history is a convenience, not load-bearing.
      setState((s) => ({ ...s, isLoadingHistory: false }));
    }
  }, []);

  const reset = useCallback(() => {
    setState((s) => ({ ...s, prompt: "", error: null }));
  }, []);

  return {
    state,
    setPrompt,
    generate,
    loadHistory,
    reset,
  };
}