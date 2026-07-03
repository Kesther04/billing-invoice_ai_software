import prisma from "../../../config/prisma";
import type { RevenueOverview, PendingPayment, PendingStatus } from "./analytics.types";

/* ── Helpers ─────────────────────────────────────────────────────────────────── */

function startOfMonth(): Date {
  const d = new Date();
  d.setDate(1);
  d.setHours(0, 0, 0, 0);
  return d;
}

function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysBetween(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

function resolvePendingStatus(dueDate: Date): { status: PendingStatus; daysOverdue: number } {
  const t = today();
  const diff = daysBetween(dueDate, t); // positive = past due, negative = future

  if (diff > 0)  return { status: "overdue",   daysOverdue: diff };
  if (diff === 0) return { status: "due_today", daysOverdue: 0 };
  return           { status: "upcoming",  daysOverdue: diff }; // negative = days until due
}

/* ── Layer 1: Revenue overview ───────────────────────────────────────────────── *
   Four SQL aggregates over the invoices table.
   growthPercent is always 0 until we have month-over-month history (Layer 2+). */
export async function getRevenueOverview(organizationId: string): Promise<RevenueOverview> {
  const monthStart = startOfMonth();

  /* Run all aggregates in parallel — no sequential dependency between them */
  const [totalResult, collectedThisMonthResult, pendingResult, overdueResult] =
    await Promise.all([

      /* Total revenue — sum of all paid invoice totals */
      prisma.invoice.aggregate({
        where:  { organizationId, status: "paid" },
        _sum:   { total: true },
      }),

      /* Collected this month — paid invoices updated this calendar month.
         Using updatedAt as a proxy for payment date since we don't have a
         paidAt field yet. Replace with paidAt when added in Layer 2. */
      prisma.invoice.aggregate({
        where:  {
          organizationId,
          status:    "paid",
          updatedAt: { gte: monthStart },
        },
        _sum: { total: true },
      }),

      /* Pending revenue — pending + overdue combined (total outstanding) */
      prisma.invoice.aggregate({
        where:  { organizationId, status: { in: ["pending", "overdue"] } },
        _sum:   { total: true },
      }),

      /* Overdue revenue — overdue only */
      prisma.invoice.aggregate({
        where:  { organizationId, status: "overdue" },
        _sum:   { total: true },
      }),
    ]);

  /* Auto-detect overdue: pending invoices past their due date aren't always
     status=overdue in the DB (status only updates on explicit transitions).
     Add them to overdueRevenue here so the dashboard is always accurate
     without needing a background job to flip statuses. */
  const autoOverdueResult = await prisma.invoice.aggregate({
    where: {
      organizationId,
      status:  "pending",
      dueDate: { lt: today() },
    },
    _sum: { total: true },
  });

  const totalRevenue       = totalResult._sum.total        ?? 0;
  const collectedThisMonth = collectedThisMonthResult._sum.total ?? 0;
  const pendingRevenue     = pendingResult._sum.total      ?? 0;
  const overdueRevenue     = (overdueResult._sum.total ?? 0) + (autoOverdueResult._sum.total ?? 0);

  return {
    totalRevenue,
    collectedThisMonth,
    pendingRevenue,
    overdueRevenue,
    growthPercent: 0,   // DEFERRED: needs month-over-month history
    currency: "USD",    // TODO: read from org settings when multi-currency lands
  };
}

/* ── Layer 1: Pending payments list ─────────────────────────────────────────── *
   All non-paid, non-cancelled invoices ordered by due date (most urgent first).
   Client name comes from toParty JSON since clientId is optional. */
export async function getPendingPayments(organizationId: string): Promise<PendingPayment[]> {
  const invoices = await prisma.invoice.findMany({
    where: {
      organizationId,
      status: { in: ["draft", "pending", "overdue"] },
    },
    orderBy: { dueDate: "asc" },
    select: {
      id:            true,
      invoiceNumber: true,
      toParty:       true,
      total:         true,
      currency:      true,
      dueDate:       true,
    },
  });

  return invoices.map((inv) => {
    const party = inv.toParty as { name?: string; company?: string };
    const clientName = party.name ?? party.company ?? "Unknown Client";
    const { status, daysOverdue } = resolvePendingStatus(inv.dueDate);

    return {
      invoiceId:     inv.id,
      invoiceNumber: inv.invoiceNumber,
      clientName,
      amount:        inv.total,
      currency:      inv.currency,
      dueDate:       inv.dueDate.toISOString().split("T")[0],
      daysOverdue,
      status,
    };
  });
}

/* ── DEFERRED: Trend data ────────────────────────────────────────────────────── *
   Returns empty array until Layer 2 adds time-series collection.
   Needs: 30+ days of invoice history, aggregated by day. */
export async function getRevenueTrend(_organizationId: string): Promise<[]> {
  // TODO Layer 2: GROUP BY DATE(updatedAt) WHERE status = 'paid', last 30/90 days
  return [];
}

/* ── DEFERRED: Top clients ───────────────────────────────────────────────────── *
   Returns empty array until there's enough invoice volume to be meaningful.
   Needs: GROUP BY clientId, SUM(total) WHERE status = 'paid'. */
export async function getTopClients(_organizationId: string): Promise<[]> {
  // TODO Layer 2: aggregate by client, compute paymentRate = paid/billed
  return [];
}