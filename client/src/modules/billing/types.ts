export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

export interface Party {
  name?: string;
  email?: string;
  company?: string;
  address?: string;
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  status: InvoiceStatus;
  from: Party;
  to: Party;
  issueDate: string;
  dueDate: string;
  lineItems: LineItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/* AI generation — a prompt run that produced (or attempted) an invoice draft.
   Persisted separately from invoices themselves; promotion to a real Invoice
   only happens when the user saves it via the normal invoice save path. */
export interface PromptRun {
  id: string;
  prompt: string;
  createdAt: string;
  status: "success" | "error";
  /* Present only when status === "success" — the parsed draft, not yet saved. */
  draft?: Partial<Invoice>;
  error?: string;
}