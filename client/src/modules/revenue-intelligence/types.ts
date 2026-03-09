export interface RevenueOverview {
  totalRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  collectedThisMonth: number;
  growthPercent: number;
  currency: string;
}

export interface RevenueDataPoint {
  date: string;      // "YYYY-MM-DD"
  collected: number;
  invoiced: number;
}

export interface PendingPayment {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amount: number;
  currency: string;
  dueDate: string;
  daysOverdue: number; // negative = days until due
  status: "upcoming" | "due_today" | "overdue";
}

export interface TopClient {
  clientId: string;
  clientName: string;
  totalBilled: number;
  totalPaid: number;
  invoiceCount: number;
  currency: string;
  paymentRate: number; // 0-1
}

export interface AIInsight {
  id: string;
  type: "warning" | "opportunity" | "info" | "celebration";
  title: string;
  body: string;
  metric?: string;
  createdAt: string;
}

export interface RevenueAnalytics {
  overview: RevenueOverview;
  trend: RevenueDataPoint[];
  pending: PendingPayment[];
  topClients: TopClient[];
  insights: AIInsight[];
}