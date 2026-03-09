export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed" | "refunded";
export type ReminderTrigger = "on_due" | "before_due" | "after_due" | "manual";
export type ReminderChannel = "email" | "sms" | "whatsapp";
export type ReminderStatus = "scheduled" | "sent" | "failed" | "skipped";

export interface PaymentLink {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  url: string;
  status: PaymentStatus;
  expiresAt: string | null;
  createdAt: string;
  paidAt: string | null;
}

export interface ReminderTemplate {
  id: string;
  name: string;
  channel: ReminderChannel;
  subject: string;
  body: string;
  isDefault: boolean;
}

export interface ReminderRule {
  id: string;
  trigger: ReminderTrigger;
  daysOffset: number; // days before (-) or after (+) due date
  channel: ReminderChannel;
  templateId: string;
  enabled: boolean;
}

export interface ReminderLogEntry {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  channel: ReminderChannel;
  status: ReminderStatus;
  sentAt: string;
  subject: string;
  amount: number;
  currency: string;
}

export interface AutomationSettings {
  enabled: boolean;
  rules: ReminderRule[];
  templates: ReminderTemplate[];
}