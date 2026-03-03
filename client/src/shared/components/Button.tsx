import React from "react";

type ButtonVariant = "primary" | "ghost" | "accent";

interface SoftButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  className?: string;
  children: React.ReactNode;
  dark?: boolean;
}

export const SoftButton: React.FC<SoftButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  dark = false,
  ...props
}) => {
  const base =
    "rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ";
  const variants: Record<ButtonVariant, string> = {
    primary: dark
      ? "bg-emerald-700 text-white hover:bg-emerald-600 focus:ring-emerald-600"
      : "bg-emerald-900 text-white hover:bg-emerald-800 focus:ring-emerald-700",
    ghost: dark
      ? "bg-white/10 text-slate-200 hover:bg-white/15 focus:ring-white/20"
      : "bg-white text-slate-700 hover:bg-slate-50 focus:ring-slate-300 ring-1 ring-slate-200",
    accent:
      "bg-gradient-to-r from-emerald-500 to-teal-400 text-white hover:opacity-90 focus:ring-emerald-400",
  };
  return (
    <button className={base + variants[variant] + " " + className} {...props}>
      {children}
    </button>
  );
};