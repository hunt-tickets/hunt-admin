import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function GET() {
  try {
    const currencies = await DatabaseService.getCurrencies()
    return NextResponse.json(currencies)
  } catch (error) {
    console.error('Error fetching currencies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch currencies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const currency = await DatabaseService.createCurrency(body)
    return NextResponse.json(currency, { status: 201 })
  } catch (error) {
    console.error('Error creating currency:', error)
    return NextResponse.json(
      { error: 'Failed to create currency' },
      { status: 500 }
    )
  }
}