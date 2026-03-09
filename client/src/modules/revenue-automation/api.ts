import { apiClient } from "../../shared/api/client";
import type {
  PaymentLink,
  AutomationSettings,
  ReminderLogEntry,
  ReminderTemplate,
} from "./types";



export const automationService = {
  generatePaymentLink: async (invoiceId: string): Promise<PaymentLink> => {
    const response = await apiClient.post("/payment-links", { invoiceId });
    return response.data;
  },

  listPaymentLinks: async (): Promise<PaymentLink[]> => {
    const response = await apiClient.get("/payment-links");
    return response.data;
  },
  getAutomationSettings: async (): Promise<AutomationSettings> => {
    const response = await apiClient.get("/automation/settings");
    return response.data;
  },
  updateAutomationSettings: async (
    settings: Partial<AutomationSettings>
  ): Promise<AutomationSettings> => {
    const response = await apiClient.patch("/automation/settings", settings);
    return response.data;
  },
  getReminderLog: async (): Promise<ReminderLogEntry[]> => {
    const response = await apiClient.get("/automation/reminders/log");
    return response.data;
  },
  saveTemplate: async (
    template: Partial<ReminderTemplate>
  ): Promise<ReminderTemplate> => {
    const url = template.id
      ? `/automation/templates/${template.id}`
      : `/automation/templates`;

    const response = await apiClient.post(url, template);
    return response.data;
  }
};

// function headers(): HeadersInit {
//   const raw = localStorage.getItem("token");
//   const token = raw ? JSON.parse(raw).accessToken : null;
//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// }

// export async function generatePaymentLink(invoiceId: string): Promise<PaymentLink> {
//   const r = await fetch(`${BASE}/payment-links`, {
//     method: "POST",
//     headers: headers(),
//     body: JSON.stringify({ invoiceId }),
//   });
//   if (!r.ok) throw new Error("Failed to generate payment link");
//   return r.json();
// }

// export async function listPaymentLinks(): Promise<PaymentLink[]> {
//   const r = await fetch(`${BASE}/payment-links`, { headers: headers() });
//   if (!r.ok) throw new Error("Failed to fetch payment links");
//   return r.json();
// }

// export async function getAutomationSettings(): Promise<AutomationSettings> {
//   const r = await fetch(`${BASE}/automation/settings`, { headers: headers() });
//   if (!r.ok) throw new Error("Failed to fetch automation settings");
//   return r.json();
// }

// export async function updateAutomationSettings(
//   settings: Partial<AutomationSettings>
// ): Promise<AutomationSettings> {
//   const r = await fetch(`${BASE}/automation/settings`, {
//     method: "PATCH",
//     headers: headers(),
//     body: JSON.stringify(settings),
//   });
//   if (!r.ok) throw new Error("Failed to update automation settings");
//   return r.json();
// }

// export async function getReminderLog(): Promise<ReminderLogEntry[]> {
//   const r = await fetch(`${BASE}/automation/reminders/log`, { headers: headers() });
//   if (!r.ok) throw new Error("Failed to fetch reminder log");
//   return r.json();
// }

// export async function saveTemplate(
//   template: Partial<ReminderTemplate>
// ): Promise<ReminderTemplate> {
//   const url = template.id
//     ? `${BASE}/automation/templates/${template.id}`
//     : `${BASE}/automation/templates`;
//   const r = await fetch(url, {
//     method: template.id ? "PATCH" : "POST",
//     headers: headers(),
//     body: JSON.stringify(template),
//   });
//   if (!r.ok) throw new Error("Failed to save template");
//   return r.json();
// }