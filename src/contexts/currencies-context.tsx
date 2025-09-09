"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Currency, Country } from '@/lib/db'

interface CurrenciesContextType {
  // Currencies
  currencies: Currency[]
  currenciesLoading: boolean
  currenciesError: string | null
  createCurrency: (currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) => Promise<Currency>
  updateCurrency: (id: string, updates: Partial<Omit<Currency, 'id' | 'created_at' | 'updated_at'>>) => Promise<Currency>
  deleteCurrency: (id: string) => Promise<boolean>
  
  // Countries
  countries: Country[]
  countriesLoading: boolean
  countriesError: string | null
  createCountry: (country: Omit<Country, 'id' | 'created_at' | 'updated_at'>) => Promise<Country>
  updateCountry: (id: string, updates: Partial<Omit<Country, 'id' | 'created_at' | 'updated_at'>>) => Promise<Country>
  deleteCountry: (id: string) => Promise<boolean>
}

const CurrenciesContext = createContext<CurrenciesContextType | undefined>(undefined)

interface CurrenciesProviderProps {
  children: ReactNode
}

export function CurrenciesProvider({ children }: CurrenciesProviderProps) {
  // Currencies state
  const [currencies, setCurrencies] = useState<Currency[]>([])
  const [currenciesLoading, setCurrenciesLoading] = useState(true)
  const [currenciesError, setCurrenciesError] = useState<string | null>(null)

  // Countries state
  const [countries, setCountries] = useState<Country[]>([])
  const [countriesLoading, setCountriesLoading] = useState(true)
  const [countriesError, setCountriesError] = useState<string | null>(null)

  // Fetch currencies
  const fetchCurrencies = async () => {
    try {
      setCurrenciesLoading(true)
      setCurrenciesError(null)
      const response = await fetch('/api/currencies')
      if (!response.ok) {
        throw new Error('Failed to fetch currencies')
      }
      const data = await response.json()
      setCurrencies(data)
    } catch (err) {
      setCurrenciesError(err instanceof Error ? err.message : 'Failed to fetch currencies')
    } finally {
      setCurrenciesLoading(false)
    }
  }

  // Fetch countries
  const fetchCountries = async () => {
    try {
      setCountriesLoading(true)
      setCountriesError(null)
      const response = await fetch('/api/countries')
      if (!response.ok) {
        throw new Error('Failed to fetch countries')
      }
      const data = await response.json()
      setCountries(data)
    } catch (err) {
      setCountriesError(err instanceof Error ? err.message : 'Failed to fetch countries')
    } finally {
      setCountriesLoading(false)
    }
  }

  // Initialize data
  useEffect(() => {
    fetchCurrencies()
    fetchCountries()
  }, [])

  // Currency CRUD operations
  const createCurrency = async (currency: Omit<Currency, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/currencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currency)
      })
      if (!response.ok) {
        throw new Error('Failed to create currency')
      }
      const newCurrency = await response.json()
      setCurrencies(prev => [...prev, newCurrency])
      return newCurrency
    } catch (err) {
      throw err
    }
  }

  const updateCurrency = async (id: string, updates: Partial<Omit<Currency, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch(`/api/currencies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) {
        throw new Error('Failed to update currency')
      }
      const updatedCurrency = await response.json()
      setCurrencies(prev => prev.map(c => c.id === id ? updatedCurrency : c))
      return updatedCurrency
    } catch (err) {
      throw err
    }
  }

  const deleteCurrency = async (id: string) => {
    try {
      const response = await fetch(`/api/currencies/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete currency')
      }
      setCurrencies(prev => prev.filter(c => c.id !== id))
      return true
    } catch (err) {
      throw err
    }
  }

  // Country CRUD operations
  const createCountry = async (country: Omit<Country, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/countries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(country)
      })
      if (!response.ok) {
        throw new Error('Failed to create country')
      }
      const newCountry = await response.json()
      setCountries(prev => [...prev, newCountry])
      return newCountry
    } catch (err) {
      throw err
    }
  }

  const updateCountry = async (id: string, updates: Partial<Omit<Country, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch(`/api/countries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) {
        throw new Error('Failed to update country')
      }
      const updatedCountry = await response.json()
      setCountries(prev => prev.map(c => c.id === id ? updatedCountry : c))
      return updatedCountry
    } catch (err) {
      throw err
    }
  }

  const deleteCountry = async (id: string) => {
    try {
      const response = await fetch(`/api/countries/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete country')
      }
      setCountries(prev => prev.filter(c => c.id !== id))
      return true
    } catch (err) {
      throw err
    }
  }

  const value: CurrenciesContextType = {
    // Currencies
    currencies,
    currenciesLoading,
    currenciesError,
    createCurrency,
    updateCurrency,
    deleteCurrency,
    
    // Countries
    countries,
    countriesLoading,
    countriesError,
    createCountry,
    updateCountry,
    deleteCountry
  }

  return (
    <CurrenciesContext.Provider value={value}>
      {children}
    </CurrenciesContext.Provider>
  )
}

export function useCurrenciesContext() {
  const context = useContext(CurrenciesContext)
  if (context === undefined) {
    throw new Error('useCurrenciesContext must be used within a CurrenciesProvider')
  }
  return context
}