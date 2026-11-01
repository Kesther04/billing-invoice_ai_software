export function formatDate(
  date: string | Date,
  options?: Intl.DateTimeFormatOptions
): string {
  const parsed = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleDateString("en-US", {
    year:  "numeric",
    month: "short",
    day:   "numeric",
    ...options,
  });
}

export function formatDateTime(date: string | Date): string {
  const parsed = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("en-US", {
    year:   "numeric",
    month:  "short",
    day:    "numeric",
    hour:   "numeric",
    minute: "2-digit",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const parsed = typeof date === "string" ? new Date(date) : date;

  if (isNaN(parsed.getTime())) return "—";

  const diffMs = parsed.getTime() - Date.now();
  const diffSeconds = Math.round(diffMs / 1000);
  const diffMinutes = Math.round(diffSeconds / 60);
  const diffHours = Math.round(diffMinutes / 60);
  const diffDays = Math.round(diffHours / 24);

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  if (Math.abs(diffDays) >= 1) return rtf.format(diffDays, "day");
  if (Math.abs(diffHours) >= 1) return rtf.format(diffHours, "hour");
  if (Math.abs(diffMinutes) >= 1) return rtf.format(diffMinutes, "minute");
  return rtf.format(diffSeconds, "second");
}