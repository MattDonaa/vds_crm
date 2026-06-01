export const DISPLAY_CURRENCIES = [
  { code: "ZAR", label: "South African Rand" },
  { code: "USD", label: "US Dollar" },
  { code: "GBP", label: "British Pound" },
  { code: "EUR", label: "Euro" },
  { code: "AED", label: "UAE Dirham" },
  { code: "AUD", label: "Australian Dollar" },
] as const;

export type DisplayCurrency = (typeof DISPLAY_CURRENCIES)[number]["code"];

export const DEFAULT_DISPLAY_CURRENCY: DisplayCurrency = "ZAR";
export const DISPLAY_CURRENCY_STORAGE_KEY = "vds-display-currency";
const currencyFormatters = new Map<DisplayCurrency, Intl.NumberFormat>();
const compactCurrencyFormatters = new Map<DisplayCurrency, Intl.NumberFormat>();

function getCurrencyFormatter(currency: DisplayCurrency): Intl.NumberFormat {
  let formatter = currencyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    currencyFormatters.set(currency, formatter);
  }
  return formatter;
}

function getCompactCurrencyFormatter(
  currency: DisplayCurrency,
): Intl.NumberFormat {
  let formatter = compactCurrencyFormatters.get(currency);
  if (!formatter) {
    formatter = new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      notation: "compact",
      minimumFractionDigits: 0,
      maximumFractionDigits: 1,
    });
    compactCurrencyFormatters.set(currency, formatter);
  }
  return formatter;
}

export function isDisplayCurrency(value: unknown): value is DisplayCurrency {
  return DISPLAY_CURRENCIES.some((currency) => currency.code === value);
}

export function formatDisplayCurrency(
  value: number,
  currency: DisplayCurrency,
): string {
  return getCurrencyFormatter(currency).format(Number(value || 0));
}

export function formatCompactDisplayCurrency(
  value: number,
  currency: DisplayCurrency,
): string {
  return getCompactCurrencyFormatter(currency).format(Number(value || 0));
}
