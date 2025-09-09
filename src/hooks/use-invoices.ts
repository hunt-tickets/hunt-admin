"use client"

import { useInvoicesContext } from '@/contexts/invoices-context'

export function useInvoices() {
  return useInvoicesContext()
}