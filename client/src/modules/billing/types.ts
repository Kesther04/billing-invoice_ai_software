export interface InvoiceParty {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  companyName?: string;
  taxId?: string; // VAT, TIN, EIN, etc.
}

export interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export type CurrencyCode =
  | "USD"
  | "EUR"
  | "GBP"
  | "NGN"
  | "CAD"
  | "AUD";

export interface AIInvoiceRequest {
  prompt: string;
  file?: File | null;
}

export interface InvoiceData {
  invoiceNumber?: string;

  issuer: InvoiceParty;   // freelancer, agency, business
  client: InvoiceParty;   // who receives invoice

  items: InvoiceItem[];

  currency: CurrencyCode; // ✅ use the strict type instead of string
  
  issueDate: string;
  dueDate?: string;

  taxRate?: number;       // percentage (e.g. 7.5)
  discount?: number;      // percentage or flat (your logic decides)
  notes?: string;

  subtotal?: number;      // calculated
  total?: number;         // calculated
}