export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  currency: string;
  totalBilled: number;
  totalPaid: number;
  invoiceCount: number;
  lastInvoiceDate?: string;
  createdAt: string;
  tags?: string[];
  notes?: string;
}

export type ClientFormData = Omit<Client, "id" | "totalBilled" | "totalPaid" | "invoiceCount" | "createdAt">;