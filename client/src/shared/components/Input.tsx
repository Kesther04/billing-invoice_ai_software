
interface InputProps {
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    dark: boolean;
    className?: string;
}

export function Input({ label,type = "text",value,onChange,placeholder,dark,className = "",}:  InputProps ) {
  return (
    <div className={`mb-4 ${className}`}>
      <label className={`block text-sm font-medium ${dark ? "text-slate-300" : "text-slate-700"}`}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 block w-full rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
          dark ? "bg-slate-800 border-slate-700 text-white" : "bg-white border-slate-300 text-slate-900"
        }`}
        required
      />
    </div>
  );
}