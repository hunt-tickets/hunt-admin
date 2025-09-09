"use client"

import { useState, useEffect } from 'react';
import type { Country } from '@/types/events';

// Mock data for now - later connect to Supabase API
const MOCK_COUNTRIES: Country[] = [
  {
    id: '1',
    code: 'CO',
    name: 'Colombia',
    phone_prefix: '+57',
    default_currency_id: '1',
    is_active: true
  },
  {
    id: '2',
    code: 'MX',
    name: 'México',
    phone_prefix: '+52',
    default_currency_id: '2',
    is_active: true
  },
  {
    id: '3',
    code: 'US',
    name: 'Estados Unidos',
    phone_prefix: '+1',
    default_currency_id: '3',
    is_active: true
  },
  {
    id: '4',
    code: 'PE',
    name: 'Perú',
    phone_prefix: '+51',
    default_currency_id: '4',
    is_active: true
  },
  {
    id: '5',
    code: 'CL',
    name: 'Chile',
    phone_prefix: '+56',
    default_currency_id: '5',
    is_active: true
  },
  {
    id: '6',
    code: 'AR',
    name: 'Argentina',
    phone_prefix: '+54',
    default_currency_id: '6',
    is_active: true
  }
];

export function useCountries() {
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 300));
        setCountries(MOCK_COUNTRIES);
        setError(null);
      } catch (err) {
        setError('Error al cargar países');
        console.error('Error fetching countries:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const getCountryById = (id: string) => {
    return countries.find(country => country.id === id);
  };

  const getCountryByCode = (code: string) => {
    return countries.find(country => country.code === code);
  };

  return {
    countries,
    loading,
    error,
    getCountryById,
    getCountryByCode
  };
}