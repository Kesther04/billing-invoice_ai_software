// src/shared/validators/invoice.validator.ts

import { z } from "zod";

const partySchema = z.object({
  name:    z.string().optional(),
  email:   z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  phone:   z.string().optional(),
  company: z.string().optional(),
});

const lineItemSchema = z.object({
  id:          z.string().optional(),
  description: z.string().min(1, "Description is required"),
  quantity:    z.number().positive("Quantity must be positive"),
  unitPrice:   z.number().min(0, "Unit price must be >= 0"),
});

export const createInvoiceSchema = z.object({
  invoiceNumber:  z.string().optional(),
  status:         z.enum(["draft", "pending", "paid", "overdue", "cancelled"]).optional(),
  from:           partySchema,
  to:             partySchema,
  issueDate:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"),
  dueDate:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD"),
  lineItems:      z.array(lineItemSchema).min(1, "At least one line item required"),
  taxRate:        z.number().min(0).max(100).optional().default(0),
  discountAmount: z.number().min(0).optional().default(0),
  currency:       z.string().length(3).optional().default("USD"),
  notes:          z.string().optional(),
  clientId:       z.string().uuid().optional(),
});

export const updateInvoiceSchema = z.object({
  invoiceNumber:  z.string().optional(),
  status:         z.enum(["draft", "pending", "paid", "overdue", "cancelled"]).optional(),
  from:           partySchema.optional(),
  to:             partySchema.optional(),
  issueDate:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  dueDate:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  lineItems:      z.array(lineItemSchema).optional(),
  taxRate:        z.number().min(0).max(100).optional(),
  discountAmount: z.number().min(0).optional(),
  currency:       z.string().length(3).optional(),
  notes:          z.string().optional(),
  clientId:       z.string().uuid().optional().nullable(),
});

export type CreateInvoiceBody = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoiceBody = z.infer<typeof updateInvoiceSchema>;