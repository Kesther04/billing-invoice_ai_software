// import { apiClient } from "../../shared/api/client";
// import type { AIInvoicePrompt, AIInvoiceResponse, Invoice } from "./types";

// export const aiBillingService = {
//   generateInvoiceFromPrompt: async (payload: AIInvoicePrompt): Promise<AIInvoiceResponse> => {
//     const response = await apiClient.post("/billing/ai/generate", payload);
//     return response.data;
//   },

//   createInvoice: async (invoice: Partial<Invoice>): Promise<Invoice> => {
//     const response = await apiClient.post("/billing/invoices", invoice);
//     return response.data;
//   },

//   getInvoice: async (id: string): Promise<Invoice> => {
//     const response = await apiClient.get(`/invoices/${id}`);
//     return response.data;
//   },

//   updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
//     const response = await apiClient.patch(`/invoices/${id}`, data);
//     return response.data;
//   },

//   listInvoices: async (): Promise<Invoice[]> => {
//     const response = await apiClient.get("/invoices");
//     return response.data;
//   }
// };

// // function authHeaders(): HeadersInit {
// //   const raw = localStorage.getItem("token");
// //   const token = raw ? JSON.parse(raw).accessToken : null;
// //   return {
// //     "Content-Type": "application/json",
// //     ...(token ? { Authorization: `Bearer ${token}` } : {}),
// //   };
// // }

// // export async function generateInvoiceFromPrompt(
// //   payload: AIInvoicePrompt
// // ): Promise<AIInvoiceResponse> {
// //   const res = await fetch(`${BASE_URL}/invoices/generate`, {
// //     method: "POST",
// //     headers: authHeaders(),
// //     body: JSON.stringify(payload),
// //   });
// //   if (!res.ok) throw new Error("Failed to generate invoice");
// //   return res.json();
// // }

// // export async function createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
// //   const res = await fetch(`${BASE_URL}/invoices`, {
// //     method: "POST",
// //     headers: authHeaders(),
// //     body: JSON.stringify(invoice),
// //   });
// //   if (!res.ok) throw new Error("Failed to create invoice");
// //   return res.json();
// // }

// // export async function getInvoice(id: string): Promise<Invoice> {
// //   const res = await fetch(`${BASE_URL}/invoices/${id}`, {
// //     headers: authHeaders(),
// //   });
// //   if (!res.ok) throw new Error("Invoice not found");
// //   return res.json();
// // }

// // export async function updateInvoice(
// //   id: string,
// //   data: Partial<Invoice>
// // ): Promise<Invoice> {
// //   const res = await fetch(`${BASE_URL}/invoices/${id}`, {
// //     method: "PATCH",
// //     headers: authHeaders(),
// //     body: JSON.stringify(data),
// //   });
// //   if (!res.ok) throw new Error("Failed to update invoice");
// //   return res.json();
// // }

// // export async function listInvoices(): Promise<Invoice[]> {
// //   const res = await fetch(`${BASE_URL}/invoices`, { headers: authHeaders() });
// //   if (!res.ok) throw new Error("Failed to fetch invoices");
// //   return res.json();
// // }

import type { Invoice, PromptRun } from "./types";

const BASE = "/api/billing";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.message ?? `Request failed: ${res.status}`);
  }
  return res.json();
}

/* ── AI parsing — talks to /billing/ai/*, never persists an invoice itself.
   Returns a draft for the caller to review/edit before saving via invoiceService. */
export const aiService = {
  generate: (prompt: string) =>
    request<{ draft: Partial<Invoice> }>("/ai/generate", {
      method: "POST",
      body: JSON.stringify({ prompt }),
    }),

  listPromptHistory: () => request<PromptRun[]>("/ai/history"),
};

/* ── Invoice CRUD — the single source of truth, used by both the form
   and the AI flow once a draft is confirmed. Talks to /billing/invoices/*. */
export const invoiceService = {
  list: () => request<Invoice[]>("/invoices"),

  get: (id: string) => request<Invoice>(`/invoices/${id}`),

  create: (invoice: Partial<Invoice>) =>
    request<Invoice>("/invoices", {
      method: "POST",
      body: JSON.stringify(invoice),
    }),

  update: (id: string, invoice: Partial<Invoice>) =>
    request<Invoice>(`/invoices/${id}`, {
      method: "PATCH",
      body: JSON.stringify(invoice),
    }),

  remove: (id: string) =>
    request<void>(`/invoices/${id}`, { method: "DELETE" }),

  send: (id: string) =>
    request<Invoice>(`/invoices/${id}/send`, { method: "POST" }),
};