import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}

export function Modal({ onClose, children, dark = false, className = "" }: ModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-2xl p-6 shadow-xl ${
          dark ? "bg-slate-900 border border-slate-700" : "bg-white"
        } ${className}`}
      >
        <button
          type="button"
          onClick={onClose}
          className={`absolute mt-[-24px] ml-[calc(100%-56px)] rounded-full p-1 ${
            dark ? "text-slate-400 hover:text-slate-200" : "text-slate-400 hover:text-slate-600"
          }`}
          aria-label="Close"
        >
          <X size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}