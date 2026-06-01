"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_DISPLAY_CURRENCY,
  DISPLAY_CURRENCY_STORAGE_KEY,
  formatCompactDisplayCurrency,
  formatDisplayCurrency,
  isDisplayCurrency,
  type DisplayCurrency,
} from "@/lib/currencies";

interface CurrencyContextValue {
  currency: DisplayCurrency;
  setCurrency: (currency: DisplayCurrency) => void;
  formatCurrency: (value: number) => string;
  formatCompactCurrency: (value: number) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const fallbackCurrencyContext: CurrencyContextValue = {
  currency: DEFAULT_DISPLAY_CURRENCY,
  setCurrency: () => {},
  formatCurrency: (value) =>
    formatDisplayCurrency(value, DEFAULT_DISPLAY_CURRENCY),
  formatCompactCurrency: (value) =>
    formatCompactDisplayCurrency(value, DEFAULT_DISPLAY_CURRENCY),
};

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<DisplayCurrency>(() => {
    if (typeof window === "undefined") return DEFAULT_DISPLAY_CURRENCY;
    try {
      const stored = localStorage.getItem(DISPLAY_CURRENCY_STORAGE_KEY);
      if (isDisplayCurrency(stored)) return stored;
    } catch {
      // The in-memory ZAR default still works if storage is unavailable.
    }
    return DEFAULT_DISPLAY_CURRENCY;
  });

  useEffect(() => {
    function onStorage(event: StorageEvent) {
      if (event.key !== DISPLAY_CURRENCY_STORAGE_KEY) return;
      if (isDisplayCurrency(event.newValue)) setCurrencyState(event.newValue);
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const setCurrency = useCallback((next: DisplayCurrency) => {
    setCurrencyState(next);
    try {
      localStorage.setItem(DISPLAY_CURRENCY_STORAGE_KEY, next);
    } catch {
      // Keep the current tab functional in private or sandboxed contexts.
    }
  }, []);

  const formatCurrency = useCallback(
    (value: number) => formatDisplayCurrency(value, currency),
    [currency],
  );
  const formatCompactCurrency = useCallback(
    (value: number) => formatCompactDisplayCurrency(value, currency),
    [currency],
  );
  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      formatCurrency,
      formatCompactCurrency,
    }),
    [currency, setCurrency, formatCurrency, formatCompactCurrency],
  );

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (context) return context;

  return fallbackCurrencyContext;
}
