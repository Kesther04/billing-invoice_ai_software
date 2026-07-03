/* ── Overview — the 4 Layer 1 stat cards ────────────────────────────────────── */
export interface RevenueOverview {
  totalRevenue:       number;   // sum of all paid invoice totals
  collectedThisMonth: number;   // paid invoices where paidAt is this calendar month
  pendingRevenue:     number;   // sum of pending + overdue invoice totals
  overdueRevenue:     number;   // sum of overdue invoice totals only
  growthPercent:      number;   // DEFERRED — always 0 until we have month-over-month history
  currency:           string;   // org default currency (USD for now)
}

/* ── Pending payments — the invoice list on the dashboard ───────────────────── */
export type PendingStatus = "overdue" | "due_today" | "upcoming";

export interface PendingPayment {
  invoiceId:     string;
  invoiceNumber: string;
  clientName:    string;
  amount:        number;
  currency:      string;
  dueDate:       string;        // ISO date string YYYY-MM-DD
  daysOverdue:   number;        // negative = days until due, 0 = today, positive = days past due
  status:        PendingStatus;
}

/* ── Trend — DEFERRED (Layer 2+) ────────────────────────────────────────────── */
export interface TrendPoint {
  date:      string;
  collected: number;
  invoiced:  number;
}

/* ── Top clients — DEFERRED (Layer 2+) ─────────────────────────────────────── */
export interface TopClient {
  clientId:    string;
  clientName:  string;
  totalBilled: number;
  totalPaid:   number;
  invoiceCount: number;
  currency:    string;
  paymentRate: number;          // 0.0–1.0
}

/* ── AI Insights — DEFERRED (Layer 2+) ─────────────────────────────────────── */
export type InsightType = "warning" | "celebration" | "opportunity" | "info";

export interface Insight {
  id:        string;
  type:      InsightType;
  title:     string;
  body:      string;
  metric:    string;
  createdAt: string;
}

/* ── Full analytics response — matches frontend RevenueAnalytics type ────────── */
export interface RevenueAnalytics {
  overview:   RevenueOverview;
  pending:    PendingPayment[];
  trend:      TrendPoint[];    // [] until Layer 2
  topClients: TopClient[];     // [] until Layer 2
  insights:   Insight[];       // [] until Layer 2
}