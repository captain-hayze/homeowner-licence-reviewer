import { useCallback } from 'react';

/**
 * Custom hook to format an amount as currency using Intl.NumberFormat.
 * @param currency The currency code (default: 'NGN').
 * @param locale The locale string (default: 'en-NG').
 * @returns A function that formats a number as currency.
 */
export function useCurrency(currency = 'NGN', locale = 'en-NG') {
  const formatCurrency = useCallback(
    (amount: number | string) => {
      const num = typeof amount === 'string' ? parseFloat(amount.replace(/,/g, '')) : amount;
      if (isNaN(num)) return '';
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(num);
    },
    [currency, locale]
  );
  return {formatCurrency};
}