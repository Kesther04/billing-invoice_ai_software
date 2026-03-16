// src/shared/validators/ai.validator.ts

import { z } from "zod";

export const generateInvoiceSchema = z.object({
  prompt: z
    .string()
    .min(5,    "Prompt must be at least 5 characters")
    .max(1000, "Prompt must be at most 1000 characters"),
});

const parsedInvoiceSchema = z.object({
  invoiceNumber:  z.string().optional(),
  from:           z.object({
    name:    z.string().optional(),
    email:   z.string().optional(),
    address: z.string().optional(),
    phone:   z.string().optional(),
    company: z.string().optional(),
  }).optional(),
  to: z.object({
    name:    z.string().optional(),
    email:   z.string().optional(),
    address: z.string().optional(),
    phone:   z.string().optional(),
    company: z.string().optional(),
  }),
  issueDate:      z.string().optional(),
  dueDate:        z.string().optional(),
  lineItems: z.array(z.object({
    id:          z.string().optional(),
    description: z.string(),
    quantity:    z.number(),
    unitPrice:   z.number(),
  })),
  taxRate:        z.number().optional(),
  discountAmount: z.number().optional(),
  currency:       z.string().optional(),
  notes:          z.string().optional(),
});

export const saveAIInvoiceSchema = z.object({
  invoice:     parsedInvoiceSchema,
  prompt:      z.string().min(1),
  confidence:  z.number().min(0).max(1),
  suggestions: z.array(z.string()).optional().default([]),
});

export type GenerateInvoiceBody = z.infer<typeof generateInvoiceSchema>;
export type SaveAIInvoiceBody   = z.infer<typeof saveAIInvoiceSchema>;