import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function GET() {
  try {
    // Get unique company names from invoices table
    const invoices = await DatabaseService.getInvoices()
    
    // Extract unique company names and filter out empty ones
    const uniqueCompanies = [...new Set(
      invoices
        .map(invoice => invoice.company_name)
        .filter(name => name && name.trim() !== '')
    )].sort()
    
    return NextResponse.json(uniqueCompanies)
  } catch (error) {
    console.error('Error fetching companies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch companies' },
      { status: 500 }
    )
  }
}