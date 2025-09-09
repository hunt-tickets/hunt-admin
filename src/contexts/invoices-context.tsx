"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { Invoice } from '@/lib/db'

interface InvoicesContextType {
  invoices: Invoice[]
  loading: boolean
  error: string | null
  createInvoice: (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => Promise<Invoice>
  updateInvoice: (id: string, updates: Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at'>>) => Promise<Invoice>
  deleteInvoice: (id: string) => Promise<boolean>
  refreshInvoices: () => Promise<void>
}

const InvoicesContext = createContext<InvoicesContextType | undefined>(undefined)

interface InvoicesProviderProps {
  children: ReactNode
}

export function InvoicesProvider({ children }: InvoicesProviderProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch invoices
  const fetchInvoices = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/invoices')
      if (!response.ok) {
        throw new Error('Failed to fetch invoices')
      }
      const data = await response.json()
      setInvoices(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invoices')
    } finally {
      setLoading(false)
    }
  }

  // Initialize data
  useEffect(() => {
    fetchInvoices()
  }, [])

  // CRUD operations
  const createInvoice = async (invoice: Omit<Invoice, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice)
      })
      if (!response.ok) {
        throw new Error('Failed to create invoice')
      }
      const newInvoice = await response.json()
      setInvoices(prev => [...prev, newInvoice])
      return newInvoice
    } catch (err) {
      throw err
    }
  }

  const updateInvoice = async (id: string, updates: Partial<Omit<Invoice, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (!response.ok) {
        throw new Error('Failed to update invoice')
      }
      const updatedInvoice = await response.json()
      setInvoices(prev => prev.map(i => i.id === id ? updatedInvoice : i))
      return updatedInvoice
    } catch (err) {
      throw err
    }
  }

  const deleteInvoice = async (id: string) => {
    try {
      const response = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) {
        throw new Error('Failed to delete invoice')
      }
      setInvoices(prev => prev.filter(i => i.id !== id))
      return true
    } catch (err) {
      throw err
    }
  }

  const value: InvoicesContextType = {
    invoices,
    loading,
    error,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    refreshInvoices: fetchInvoices
  }

  return (
    <InvoicesContext.Provider value={value}>
      {children}
    </InvoicesContext.Provider>
  )
}

export function useInvoicesContext() {
  const context = useContext(InvoicesContext)
  if (context === undefined) {
    throw new Error('useInvoicesContext must be used within an InvoicesProvider')
  }
  return context
}