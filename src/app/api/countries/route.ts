import { NextRequest, NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'

export async function GET() {
  try {
    const countries = await DatabaseService.getCountries()
    return NextResponse.json(countries)
  } catch (error) {
    console.error('Error fetching countries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch countries' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const country = await DatabaseService.createCountry(body)
    return NextResponse.json(country, { status: 201 })
  } catch (error) {
    console.error('Error creating country:', error)
    return NextResponse.json(
      { error: 'Failed to create country' },
      { status: 500 }
    )
  }
}