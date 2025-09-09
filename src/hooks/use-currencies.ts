"use client"

import { useState, useEffect } from 'react';
import type { Currency } from '@/types/events';

export function useCurrencies() {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/currencies');
        if (!response.ok) {
          throw new Error('Failed to fetch currencies');
        }
        const data = await response.json();
        setCurrencies(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar monedas');
        console.error('Error fetching currencies:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrencies();
  }, []);

  const getCurrencyById = (id: string) => {
    return currencies.find(currency => currency.id === id);
  };

  const getCurrencyByCode = (code: string) => {
    return currencies.find(currency => currency.code === code);
  };

  return {
    currencies,
    loading,
    error,
    getCurrencyById,
    getCurrencyByCode
  };
}