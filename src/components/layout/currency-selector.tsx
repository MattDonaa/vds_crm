"use client";

import { DISPLAY_CURRENCIES, isDisplayCurrency } from "@/lib/currencies";
import { useCurrency } from "@/hooks/use-currency";

const DISPLAY_ONLY_NOTE =
  "Currency selection changes display format only. Deal values are not converted.";

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className="flex items-center gap-2"
      title={DISPLAY_ONLY_NOTE}
    >
      <label htmlFor="display-currency" className="sr-only">
        Display currency
      </label>
      <select
        id="display-currency"
        value={currency}
        onChange={(event) => {
          if (isDisplayCurrency(event.target.value)) {
            setCurrency(event.target.value);
          }
        }}
        className="h-8 rounded-md border border-slate-800 bg-slate-900 px-2 text-xs font-medium text-slate-200 outline-none transition-colors hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary"
        aria-describedby="display-currency-note"
      >
        {DISPLAY_CURRENCIES.map((option) => (
          <option key={option.code} value={option.code}>
            {option.code}
          </option>
        ))}
      </select>
      <span
        id="display-currency-note"
        className="hidden max-w-52 text-[10px] leading-tight text-slate-500 2xl:inline"
      >
        {DISPLAY_ONLY_NOTE}
      </span>
    </div>
  );
}
