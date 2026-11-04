import { CURRENCIES, type CurrencyCode } from "../utils/formatCurrency";

interface Props {
  value: string;
  onChange: (currency: CurrencyCode) => void;
  dark: boolean;
  /** "field" (default) matches form inputs; "pill" is compact, for toolbars like the dashboard header. */
  variant?: "field" | "pill";
  className?: string;
}

export default function CurrencySelect({ value, onChange, dark, variant = "field", className = "" }: Props) {
  const fieldCls = `w-full rounded-lg px-3 py-2 text-sm outline-none border transition-colors focus:border-emerald-500 ${
    dark
      ? "bg-zinc-900 border-zinc-700 text-zinc-200"
      : "bg-zinc-50 border-zinc-200 text-zinc-800"
  }`;

  const pillCls = `rounded-xl text-xs font-medium border px-3 py-2 outline-none transition-all focus:border-emerald-500 ${
    dark
      ? "bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600"
      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
  }`;

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as CurrencyCode)}
      className={`${variant === "pill" ? pillCls : fieldCls} ${className}`}
    >
      {CURRENCIES.map((c) => (
        <option key={c.code} value={c.code}>
          {c.code} — {c.label}
        </option>
      ))}
    </select>
  );
}