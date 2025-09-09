import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const currency = await DatabaseService.getCurrencyById(params.id)
    return NextResponse.json(currency)
  } catch (error) {
    console.error('Error fetching currency:', error)
    return NextResponse.json(
      { error: 'Currency not found' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const currency = await DatabaseService.updateCurrency(params.id, body)
    return NextResponse.json(currency)
  } catch (error) {
    console.error('Error updating currency:', error)
    return NextResponse.json(
      { error: 'Failed to update currency' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await DatabaseService.deleteCurrency(params.id)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Currency not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting currency:', error)
    return NextResponse.json(
      { error: 'Failed to delete currency' },
      { status: 500 }
    )
  }
}