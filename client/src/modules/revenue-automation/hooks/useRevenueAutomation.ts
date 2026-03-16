import { useState, useCallback, useEffect } from "react";
import { nanoid } from "nanoid";
import type {
  AutomationSettings,
  PaymentLink,
  ReminderLogEntry,
  ReminderRule,
  ReminderTemplate,
} from "../types";
import { automationService } from "../api";

// ── Mock data ────────────────────────────────────────────────────────────────

const MOCK_TEMPLATES: ReminderTemplate[] = [
  {
    id: "tpl-1",
    name: "Friendly Nudge",
    channel: "email",
    subject: "Quick reminder: Invoice {{invoiceNumber}} is due soon",
    body: "Hi {{clientName}},\n\nJust a friendly heads-up that Invoice {{invoiceNumber}} for {{amount}} is due on {{dueDate}}.\n\nPay now: {{paymentLink}}\n\nThanks!",
    isDefault: true,
  },
  {
    id: "tpl-2",
    name: "Overdue Notice",
    channel: "email",
    subject: "Invoice {{invoiceNumber}} is overdue",
    body: "Hi {{clientName}},\n\nYour invoice {{invoiceNumber}} for {{amount}} was due on {{dueDate}} and remains unpaid.\n\nPlease settle at your earliest convenience: {{paymentLink}}",
    isDefault: false,
  },
  {
    id: "tpl-3",
    name: "SMS Reminder",
    channel: "sms",
    subject: "",
    body: "Hi {{clientName}}, invoice {{invoiceNumber}} ({{amount}}) is due {{dueDate}}. Pay: {{paymentLink}}",
    isDefault: false,
  },
];

const MOCK_RULES: ReminderRule[] = [
  { id: "r1", trigger: "before_due", daysOffset: 3, channel: "email", templateId: "tpl-1", enabled: true },
  { id: "r2", trigger: "on_due", daysOffset: 0, channel: "email", templateId: "tpl-1", enabled: true },
  { id: "r3", trigger: "after_due", daysOffset: 3, channel: "email", templateId: "tpl-2", enabled: true },
  { id: "r4", trigger: "after_due", daysOffset: 7, channel: "sms", templateId: "tpl-3", enabled: false },
];

const MOCK_LOG: ReminderLogEntry[] = [
  { id: "l1", invoiceId: "inv1", invoiceNumber: "INV-2041", clientName: "Acme Corp", channel: "email", status: "sent", sentAt: new Date(Date.now() - 86400000 * 2).toISOString(), subject: "Invoice INV-2041 is due soon", amount: 3200, currency: "USD" },
  { id: "l2", invoiceId: "inv2", invoiceNumber: "INV-2042", clientName: "Sarah Johnson", channel: "email", status: "sent", sentAt: new Date(Date.now() - 86400000).toISOString(), subject: "Invoice INV-2042 is overdue", amount: 850, currency: "USD" },
  { id: "l3", invoiceId: "inv3", invoiceNumber: "INV-2043", clientName: "TechStartup Inc", channel: "sms", status: "failed", sentAt: new Date(Date.now() - 3600000 * 5).toISOString(), subject: "SMS reminder", amount: 12000, currency: "USD" },
  { id: "l4", invoiceId: "inv4", invoiceNumber: "INV-2044", clientName: "Marcus Lee", channel: "email", status: "sent", sentAt: new Date(Date.now() - 3600000 * 2).toISOString(), subject: "Invoice INV-2044 is due soon", amount: 450, currency: "USD" },
  { id: "l5", invoiceId: "inv1", invoiceNumber: "INV-2041", clientName: "Acme Corp", channel: "email", status: "sent", sentAt: new Date(Date.now() - 3600000).toISOString(), subject: "Invoice INV-2041 is overdue", amount: 3200, currency: "USD" },
];

const MOCK_LINKS: PaymentLink[] = [
  { id: "pl1", invoiceId: "inv1", invoiceNumber: "INV-2041", clientName: "Acme Corp", amount: 3200, currency: "USD", url: "https://pay.revpilot.io/pl1", status: "unpaid", expiresAt: null, createdAt: new Date(Date.now() - 86400000 * 5).toISOString(), paidAt: null },
  { id: "pl2", invoiceId: "inv2", invoiceNumber: "INV-2042", clientName: "Sarah Johnson", amount: 850, currency: "USD", url: "https://pay.revpilot.io/pl2", status: "paid", expiresAt: null, createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), paidAt: new Date(Date.now() - 86400000).toISOString() },
  { id: "pl3", invoiceId: "inv3", invoiceNumber: "INV-2043", clientName: "TechStartup Inc", amount: 12000, currency: "USD", url: "https://pay.revpilot.io/pl3", status: "pending", expiresAt: null, createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), paidAt: null },
];

// ─────────────────────────────────────────────────────────────────────────────

export function useRevenueAutomation() {
  const [settings, setSettings] = useState<AutomationSettings>({
    enabled: true,
    rules: MOCK_RULES,
    templates: MOCK_TEMPLATES,
  });
  const [links, setLinks] = useState<PaymentLink[]>(MOCK_LINKS);
  const [log, setLog] = useState<ReminderLogEntry[]>(MOCK_LOG);
  const [loading] = useState(false);
  const [generatingLink, setGeneratingLink] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ReminderTemplate | null>(null);

  // Try to load from API, fall back to mock
  useEffect(() => {
    (async () => {
      try {
        const [s, l, lg] = await Promise.all([
          automationService.getAutomationSettings(),
          automationService.listPaymentLinks(),
          automationService.getReminderLog(),
        ]);
        setSettings(s);
        setLinks(l);
        setLog(lg);
      } catch {
        // use mock data already set
      }
    })();
  }, []);

  const toggleAutomation = useCallback(async () => {
    const next = { ...settings, enabled: !settings.enabled };
    setSettings(next);
    try { await automationService.updateAutomationSettings({ enabled: next.enabled }); } catch {}
  }, [settings]);

  const toggleRule = useCallback((id: string) => {
    setSettings((s) => ({
      ...s,
      rules: s.rules.map((r) => r.id === id ? { ...r, enabled: !r.enabled } : r),
    }));
  }, []);

  const updateRule = useCallback((id: string, updates: Partial<ReminderRule>) => {
    setSettings((s) => ({
      ...s,
      rules: s.rules.map((r) => r.id === id ? { ...r, ...updates } : r),
    }));
  }, []);

  const addRule = useCallback(() => {
    const newRule: ReminderRule = {
      id: nanoid(),
      trigger: "after_due",
      daysOffset: 1,
      channel: "email",
      templateId: settings.templates[0]?.id ?? "",
      enabled: true,
    };
    setSettings((s) => ({ ...s, rules: [...s.rules, newRule] }));
  }, [settings.templates]);

  const removeRule = useCallback((id: string) => {
    setSettings((s) => ({ ...s, rules: s.rules.filter((r) => r.id !== id) }));
  }, []);

  const generateLink = useCallback(async (invoiceId: string, invoiceNumber: string, clientName: string, amount: number) => {
    setGeneratingLink(true);
    try {
      const link = await automationService.generatePaymentLink(invoiceId);
      setLinks((l) => [link, ...l]);
    } catch {
      // Mock
      await new Promise((r) => setTimeout(r, 900));
      const mock: PaymentLink = {
        id: nanoid(),
        invoiceId,
        invoiceNumber,
        clientName,
        amount,
        currency: "USD",
        url: `https://pay.revpilot.io/${nanoid(8)}`,
        status: "unpaid",
        expiresAt: null,
        createdAt: new Date().toISOString(),
        paidAt: null,
      };
      setLinks((l) => [mock, ...l]);
    } finally {
      setGeneratingLink(false);
    }
  }, []);

  const saveTemplate = useCallback(async (tpl: Partial<ReminderTemplate>) => {
    try {
      const saved = await automationService.saveTemplate(tpl);
      setSettings((s) => ({
        ...s,
        templates: tpl.id
          ? s.templates.map((t) => t.id === tpl.id ? saved : t)
          : [...s.templates, saved],
      }));
    } catch {
      // Mock save
      const mock: ReminderTemplate = {
        id: tpl.id ?? nanoid(),
        name: tpl.name ?? "New Template",
        channel: tpl.channel ?? "email",
        subject: tpl.subject ?? "",
        body: tpl.body ?? "",
        isDefault: tpl.isDefault ?? false,
      };
      setSettings((s) => ({
        ...s,
        templates: tpl.id
          ? s.templates.map((t) => t.id === tpl.id ? mock : t)
          : [...s.templates, mock],
      }));
    }
    setEditingTemplate(null);
  }, []);

  return {
    settings,
    links,
    log,
    loading,
    generatingLink,
    editingTemplate,
    setEditingTemplate,
    toggleAutomation,
    toggleRule,
    updateRule,
    addRule,
    removeRule,
    generateLink,
    saveTemplate,
  };
}