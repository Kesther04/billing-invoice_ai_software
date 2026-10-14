import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    dark: boolean;
    className?: string;
}

export function Input({ label, type = "text", value, onChange, placeholder, dark, className = "" }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`mb-4 ${className}`}>
      <label className={`block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
            isPassword ? "pr-10" : ""
          } ${
            dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
          }`}
          required
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute inset-y-0 right-0 flex items-center px-3 ${
              dark ? "text-slate-400 hover:text-slate-200" : "text-slate-500 hover:text-slate-700"
            }`}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}