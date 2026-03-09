import { apiClient } from "../../shared/api/client";
import type { RevenueAnalytics } from "./types";


// function headers(): HeadersInit {
//   const raw = localStorage.getItem("token");
//   const token = raw ? JSON.parse(raw).accessToken : null;
//   return { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
// }

export const dashboardServices = {
  fetchRevenueAnalytics: async (): Promise<RevenueAnalytics> => {
    const response = await apiClient.get("/analytics/revenue");
    return response.data;
  }
}

// export async function fetchRevenueAnalytics(): Promise<RevenueAnalytics> {
//   const r = await fetch(`${BASE}/analytics/revenue`, { headers: headers() });
//   if (!r.ok) throw new Error("Failed to fetch analytics");
//   return r.json();
// }

// Exported for tests / Storybook
export function buildMockAnalytics(): RevenueAnalytics {
  const now = new Date();
  const trend = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    const base = 2000 + Math.sin(i / 4) * 800;
    return {
      date: d.toISOString().split("T")[0],
      collected: Math.round(base + Math.random() * 1200),
      invoiced:  Math.round(base * 1.3 + Math.random() * 600),
    };
  });

  return {
    overview: {
      totalRevenue: 84320,
      pendingRevenue: 22400,
      overdueRevenue: 8750,
      collectedThisMonth: 18200,
      growthPercent: 23.4,
      currency: "USD",
    },
    trend,
    pending: [
      { invoiceId: "i1", invoiceNumber: "INV-2045", clientName: "TechStartup Inc",  amount: 12000, currency: "USD", dueDate: new Date(now.getTime() - 86400000 * 5).toISOString().split("T")[0], daysOverdue: 5,  status: "overdue"   },
      { invoiceId: "i2", invoiceNumber: "INV-2046", clientName: "Acme Corp",        amount: 3200,  currency: "USD", dueDate: new Date(now.getTime() - 86400000 * 2).toISOString().split("T")[0], daysOverdue: 2,  status: "overdue"   },
      { invoiceId: "i3", invoiceNumber: "INV-2047", clientName: "Sarah Johnson",    amount: 850,   currency: "USD", dueDate: now.toISOString().split("T")[0],                                   daysOverdue: 0,  status: "due_today" },
      { invoiceId: "i4", invoiceNumber: "INV-2048", clientName: "Marcus Lee",       amount: 450,   currency: "USD", dueDate: new Date(now.getTime() + 86400000 * 3).toISOString().split("T")[0], daysOverdue: -3, status: "upcoming"  },
      { invoiceId: "i5", invoiceNumber: "INV-2049", clientName: "Bright Agency",    amount: 5900,  currency: "USD", dueDate: new Date(now.getTime() + 86400000 * 7).toISOString().split("T")[0], daysOverdue: -7, status: "upcoming"  },
    ],
    topClients: [
      { clientId: "c1", clientName: "TechStartup Inc", totalBilled: 36000, totalPaid: 24000, invoiceCount: 8,  currency: "USD", paymentRate: 0.67 },
      { clientId: "c2", clientName: "Acme Corp",        totalBilled: 22400, totalPaid: 19200, invoiceCount: 12, currency: "USD", paymentRate: 0.86 },
      { clientId: "c3", clientName: "Bright Agency",    totalBilled: 14800, totalPaid: 14800, invoiceCount: 6,  currency: "USD", paymentRate: 1.00 },
      { clientId: "c4", clientName: "Sarah Johnson",    totalBilled: 7650,  totalPaid: 6800,  invoiceCount: 9,  currency: "USD", paymentRate: 0.89 },
      { clientId: "c5", clientName: "Marcus Lee",       totalBilled: 3470,  totalPaid: 3020,  invoiceCount: 5,  currency: "USD", paymentRate: 0.87 },
    ],
    insights: [
      { id: "ins1", type: "warning",     title: "5 invoices overdue",         body: "You have $15,200 sitting in overdue invoices. AI reminders have been sent — consider a direct follow-up.", metric: "$15,200 at risk", createdAt: now.toISOString() },
      { id: "ins2", type: "celebration", title: "Best month yet",             body: "This month's collected revenue is 23% higher than last month. TechStartup and Acme Corp drove most of the growth.", metric: "+23% MoM", createdAt: now.toISOString() },
      { id: "ins3", type: "opportunity", title: "Upsell opportunity: Acme",  body: "Acme Corp pays within 3 days on average and has a perfect record. They may be open to a retainer agreement.", metric: "86% pay rate", createdAt: now.toISOString() },
      { id: "ins4", type: "info",        title: "Payment speed improving",   body: "Average time-to-pay dropped from 11 days to 4.2 days since enabling automated reminders.", metric: "4.2 day avg", createdAt: now.toISOString() },
    ],
  };
}