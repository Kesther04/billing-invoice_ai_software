import React from "react";

interface TableProps {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

export function Table({ children, dark = false, className = "" }: TableProps) {
  return (
    <div
      className={`overflow-x-auto rounded-xl shadow-sm ring-1 ${
        dark ? "ring-slate-700" : "ring-slate-200"
      } ${className}`}
    >
      <table className={`min-w-full divide-y ${dark ? "divide-slate-700" : "divide-slate-200"}`}>
        {children}
      </table>
    </div>
  );
}