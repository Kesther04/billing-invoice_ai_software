import { apiClient } from "../../shared/api/client.ts";
import type { InvoiceData } from "./types.ts";

export async function generateInvoice(data: InvoiceData) {
  const response = await apiClient.post("/invoice", data);
  return response.data;
}