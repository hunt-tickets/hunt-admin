import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const country = await DatabaseService.getCountryById(params.id)
    return NextResponse.json(country)
  } catch (error) {
    console.error('Error fetching country:', error)
    return NextResponse.json(
      { error: 'Country not found' },
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
    const country = await DatabaseService.updateCountry(params.id, body)
    return NextResponse.json(country)
  } catch (error) {
    console.error('Error updating country:', error)
    return NextResponse.json(
      { error: 'Failed to update country' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await DatabaseService.deleteCountry(params.id)
    if (success) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json(
        { error: 'Country not found' },
        { status: 404 }
      )
    }
  } catch (error) {
    console.error('Error deleting country:', error)
    return NextResponse.json(
      { error: 'Failed to delete country' },
      { status: 500 }
    )
  }
}