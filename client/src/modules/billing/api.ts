import { apiClient } from "../../shared/api/client";
import type { AIInvoicePrompt, AIInvoiceResponse, Invoice } from "./types";

export const aiBillingService = {
  generateInvoiceFromPrompt: async (payload: AIInvoicePrompt): Promise<AIInvoiceResponse> => {
    const response = await apiClient.post("/invoices/generate", payload);
    return response.data;
  },

  createInvoice: async (invoice: Partial<Invoice>): Promise<Invoice> => {
    const response = await apiClient.post("/invoices", invoice);
    return response.data;
  },

  getInvoice: async (id: string): Promise<Invoice> => {
    const response = await apiClient.get(`/invoices/${id}`);
    return response.data;
  },

  updateInvoice: async (id: string, data: Partial<Invoice>): Promise<Invoice> => {
    const response = await apiClient.patch(`/invoices/${id}`, data);
    return response.data;
  },

  listInvoices: async (): Promise<Invoice[]> => {
    const response = await apiClient.get("/invoices");
    return response.data;
  }
};

// function authHeaders(): HeadersInit {
//   const raw = localStorage.getItem("token");
//   const token = raw ? JSON.parse(raw).accessToken : null;
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// export async function generateInvoiceFromPrompt(
//   payload: AIInvoicePrompt
// ): Promise<AIInvoiceResponse> {
//   const res = await fetch(`${BASE_URL}/invoices/generate`, {
//     method: "POST",
//     headers: authHeaders(),
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) throw new Error("Failed to generate invoice");
//   return res.json();
// }

// export async function createInvoice(invoice: Partial<Invoice>): Promise<Invoice> {
//   const res = await fetch(`${BASE_URL}/invoices`, {
//     method: "POST",
//     headers: authHeaders(),
//     body: JSON.stringify(invoice),
//   });
//   if (!res.ok) throw new Error("Failed to create invoice");
//   return res.json();
// }

// export async function getInvoice(id: string): Promise<Invoice> {
//   const res = await fetch(`${BASE_URL}/invoices/${id}`, {
//     headers: authHeaders(),
//   });
//   if (!res.ok) throw new Error("Invoice not found");
//   return res.json();
// }

// export async function updateInvoice(
//   id: string,
//   data: Partial<Invoice>
// ): Promise<Invoice> {
//   const res = await fetch(`${BASE_URL}/invoices/${id}`, {
//     method: "PATCH",
//     headers: authHeaders(),
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw new Error("Failed to update invoice");
//   return res.json();
// }

// export async function listInvoices(): Promise<Invoice[]> {
//   const res = await fetch(`${BASE_URL}/invoices`, { headers: authHeaders() });
//   if (!res.ok) throw new Error("Failed to fetch invoices");
//   return res.json();
// }