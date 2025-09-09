"use client"

import { useState, useEffect } from "react";
import { Currency } from "@/lib/db";

interface ExchangeRates {
  [key: string]: number;
}

export function useCurrencyConversion(baseCurrency: string = 'USD') {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch currencies from database
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        const response = await fetch('/api/currencies');
        if (!response.ok) {
          throw new Error('Failed to fetch currencies');
        }
        const data = await response.json();
        setCurrencies(data.filter((currency: Currency) => currency.is_active));
      } catch (err) {
        console.error('Error fetching currencies:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch currencies');
      }
    };

    fetchCurrencies();
  }, []);

  // Fetch exchange rates when base currency changes
  useEffect(() => {
    const fetchExchangeRates = async () => {
      if (!baseCurrency) return;

      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        if (!response.ok) {
          throw new Error('Failed to fetch exchange rates');
        }
        
        const data = await response.json();
        setExchangeRates(data.rates || {});
      } catch (err) {
        console.error('Error fetching exchange rates:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch exchange rates');
        // Set fallback rates (all to 1) so the app doesn't break
        setExchangeRates({});
      } finally {
        setLoading(false);
      }
    };

    fetchExchangeRates();
  }, [baseCurrency]);

  // Get currency info from database
  const getCurrencyInfo = (currencyCode: string): Currency | null => {
    return currencies.find(currency => currency.code === currencyCode) || null;
  };

  // Convert amount to base currency
  const convertToBaseCurrency = (amount: number, fromCurrency: string): number => {
    if (fromCurrency === baseCurrency) return amount;
    
    const rate = exchangeRates[fromCurrency];
    if (!rate) return amount; // Fallback to original amount if no rate available
    
    return amount / rate;
  };

  // Format number with proper decimal places
  const formatCurrencyAmount = (amount: number, currencyCode: string): string => {
    const currency = getCurrencyInfo(currencyCode);
    const decimalPlaces = currency?.decimal_places ?? 2;
    
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: decimalPlaces === 0 ? 0 : 2,
      maximumFractionDigits: decimalPlaces === 0 ? 0 : 2,
    }).format(amount);
  };

  // Get currency symbol
  const getCurrencySymbol = (currencyCode: string): string => {
    const currency = getCurrencyInfo(currencyCode);
    return currency?.symbol || currencyCode;
  };

  // Get active currencies for selector
  const getActiveCurrencies = (): Currency[] => {
    return currencies.filter(currency => currency.is_active);
  };

  return {
    currencies,
    exchangeRates,
    loading,
    error,
    getCurrencyInfo,
    convertToBaseCurrency,
    formatCurrencyAmount,
    getCurrencySymbol,
    getActiveCurrencies,
  };
}