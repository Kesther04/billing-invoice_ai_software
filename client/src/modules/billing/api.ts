import { apiClient } from "../../shared/api/client";
import type { PromptRun, Invoice, ParsedInvoiceDraft } from "./types";

// AI invoice related services
export const aiBillingService = {
  generate: async (prompt: string): Promise<{draft: ParsedInvoiceDraft, promptRunId: string}> => {
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
