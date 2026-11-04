import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_CURRENCY,
  isSupportedCurrency,
  type CurrencyCode,
} from "../utils/formatCurrency";

/* Mirrors shared/constants/ThemeContext.tsx — same shape, same
   localStorage-persisted-provider pattern, so the two behave
   consistently (and either can be read without the other). */

interface CurrencyContextValue {
  /** The currency the user has chosen to VIEW amounts in. */
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem("displayCurrency");
    return isSupportedCurrency(saved) ? saved : DEFAULT_CURRENCY;
  });

  const setCurrency = (next: CurrencyCode) => setCurrencyState(next);

  useEffect(() => {
    localStorage.setItem("displayCurrency", currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used inside CurrencyProvider");
  }
  return context;
};