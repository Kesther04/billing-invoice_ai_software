/**
 * invoice.tracker.ts — View receipt / open tracking
 *
 * DEFERRED: This is a Layer 2 feature. Implementing it requires a
 * tracking pixel endpoint and email link instrumentation that aren't
 * in Layer 1 scope. The file exists so import paths don't break when
 * the feature is added.
 *
 * When implemented, this will:
 * - Generate a unique tracking token per sent invoice
 * - Expose GET /billing/invoices/:id/track?t=TOKEN (1×1 pixel response)
 * - Record the view event (timestamp, IP) and update invoice status to "viewed"
 * - Emit a real-time notification to the dashboard
 */

export interface ViewEvent {
  invoiceId:  string;
  viewedAt:   Date;
  ip?:        string;
  userAgent?: string;
}

// Placeholder — replace with real implementation in Layer 2
export async function recordView(_event: ViewEvent): Promise<void> {
  // TODO: persist view event to DB and notify dashboard
}

export async function getViewHistory(_invoiceId: string): Promise<ViewEvent[]> {
  // TODO: query view events from DB
  return [];
}