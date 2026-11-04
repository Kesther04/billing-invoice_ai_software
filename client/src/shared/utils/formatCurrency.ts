/* ──────────────────────────────────────────────────────────────────
   Currency formatting + conversion.

   Single source of truth for every currency symbol, locale and
   exchange rate used across the app (invoice currency picker,
   dashboard display-currency switcher, any amount rendered anywhere).
   Nothing else should hand-roll an Intl.NumberFormat("USD", ...) call.
───────────────────────────────────────────────────────────────── */

export type CurrencyCode = "USD" | "NGN" | "EUR" | "GBP" | "GHS" | "KES" | "ZAR" | "CAD";

export interface CurrencyInfo {
  code: CurrencyCode;
  label: string;
  symbol: string;
  locale: string;
}

/* NGN and EUR are the two the product calls out explicitly, USD is the
   default/source currency the backend currently stores amounts in.
   The rest ("and others") round out the common currencies a Nigerian
   freelancer billing international clients is likely to need. Add more
   here — formatCurrency/convertAmount both key off this list. */
export const CURRENCIES: CurrencyInfo[] = [
  { code: "USD", label: "US Dollar",          symbol: "$",    locale: "en-US" },
  { code: "NGN", label: "Nigerian Naira",     symbol: "₦",    locale: "en-NG" },
  { code: "EUR", label: "Euro",                symbol: "€",    locale: "en-IE" },
  { code: "GBP", label: "British Pound",      symbol: "£",    locale: "en-GB" },
  { code: "GHS", label: "Ghanaian Cedi",      symbol: "GH₵",  locale: "en-GH" },
  { code: "KES", label: "Kenyan Shilling",    symbol: "KSh",  locale: "en-KE" },
  { code: "ZAR", label: "South African Rand", symbol: "R",    locale: "en-ZA" },
  { code: "CAD", label: "Canadian Dollar",    symbol: "CA$",  locale: "en-CA" },
];

export const DEFAULT_CURRENCY: CurrencyCode = "USD";

/* Static USD-based exchange rates (1 USD = X <currency>).
   These are placeholder/demo rates so the UI has something to convert
   with today — swap this for a live FX endpoint (e.g. a /rates route
   on the backend, or exchangerate.host) as soon as one exists. Keeping
   all lookups behind convertAmount() means that swap only touches this
   one function. */
const USD_RATES: Record<CurrencyCode, number> = {
  USD: 1,
  NGN: 1600,
  EUR: 0.92,
  GBP: 0.78,
  GHS: 15.5,
  KES: 129,
  ZAR: 18.2,
  CAD: 1.37,
};

export function isSupportedCurrency(code?: string | null): code is CurrencyCode {
  return !!code && code in USD_RATES;
}

export function getCurrencyInfo(code?: string | null): CurrencyInfo {
  return (
    CURRENCIES.find((c) => c.code === code) ??
    CURRENCIES.find((c) => c.code === DEFAULT_CURRENCY)!
  );
}

/** Convert `amount` from one currency to another via the USD rate table. */
export function convertAmount(amount: number, from: string, to: string): number {
  if (!isSupportedCurrency(from) || !isSupportedCurrency(to) || from === to) {
    return amount;
  }
  const inUsd = amount / USD_RATES[from];
  return inUsd * USD_RATES[to];
}

/** Format `amount` as `currency`, using that currency's own locale. */
export function formatCurrency(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  options?: Intl.NumberFormatOptions
): string {
  const info = getCurrencyInfo(currency);
  try {
    return new Intl.NumberFormat(info.locale, {
      style: "currency",
      currency: info.code,
      maximumFractionDigits: 0,
      ...options,
    }).format(amount);
  } catch {
    return `${info.symbol}${amount.toFixed(0)}`;
  }
}

/** Convert `amount` from `fromCurrency` into `displayCurrency`, then format it. */
export function formatConverted(
  amount: number,
  fromCurrency: string,
  displayCurrency: string,
  options?: Intl.NumberFormatOptions
): string {
  const converted = convertAmount(amount, fromCurrency, displayCurrency);
  return formatCurrency(converted, displayCurrency, options);
}