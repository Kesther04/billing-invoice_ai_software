import { apiClient } from "../../shared/api/client";
import type { PromptRun, Invoice } from "./types";

// AI invoice related services
export const aiBillingService = {
  generate: async (prompt: string): Promise<Invoice> => {
    const response = await apiClient.post("/billing/ai/generate", { prompt });
    return response.data;
  },

  listPromptHistory: async (): Promise<PromptRun[]> => {
    const response = await apiClient.get("/billing/ai/history");
    return response.data;
  }
};

// invoice related services
export const invoiceBillingService = {
  create: async (invoice: Partial<Invoice>): Promise<Invoice> => {
    const response = await apiClient.post("/billing/invoices", invoice);
    return response.data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get(`/billing/invoices/${id}`);
    return response.data;
  },

  update: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await apiClient.patch(`/billing/invoices/${id}`, data);
    return response.data;
  },

  listInvoices: async (): Promise<Invoice[]> => {
    const response = await apiClient.get("/billing/invoices");
    return response.data;
  }
}

// const BASE = "/api/billing";

// async function request<T>(path: string, options?: RequestInit): Promise<T> {
//   const res = await fetch(`${BASE}${path}`, {
//     headers: { "Content-Type": "application/json" },
//     credentials: "include",
//     ...options,
//   });
//   if (!res.ok) {
//     const body = await res.json().catch(() => ({}));
//     throw new Error(body?.message ?? `Request failed: ${res.status}`);
//   }
//   return res.json();
// }

// /* ── AI parsing — talks to /billing/ai/*, never persists an invoice itself.
//    Returns a draft for the caller to review/edit before saving via invoiceService. */
// export const aiService = {
//   generate: (prompt: string) =>
//     request<{ draft: Partial<Invoice> }>("/ai/generate", {
//       method: "POST",
//       body: JSON.stringify({ prompt }),
//     }),

//   listPromptHistory: () => request<PromptRun[]>("/ai/history"),
// };

// /* ── Invoice CRUD — the single source of truth, used by both the form
//    and the AI flow once a draft is confirmed. Talks to /billing/invoices/*. */
// export const invoiceService = {
//   list: () => request<Invoice[]>("/invoices"),

//   get: (id: string) => request<Invoice>(`/invoices/${id}`),

//   create: (invoice: Partial<Invoice>) =>
//     request<Invoice>("/invoices", {
//       method: "POST",
//       body: JSON.stringify(invoice),
//     }),

//   update: (id: string, invoice: Partial<Invoice>) =>
//     request<Invoice>(`/invoices/${id}`, {
//       method: "PATCH",
//       body: JSON.stringify(invoice),
//     }),

//   remove: (id: string) =>
//     request<void>(`/invoices/${id}`, { method: "DELETE" }),

//   send: (id: string) =>
//     request<Invoice>(`/invoices/${id}/send`, { method: "POST" }),
// };