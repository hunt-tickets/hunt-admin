import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { validateApiSession, createUnauthorizedResponse } from '@/lib/auth'

export async function GET(request: Request) {
  const user = await validateApiSession(request as any);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    const producers = await DatabaseService.getProducers()
    return NextResponse.json(producers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch producers' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const user = await validateApiSession(request as any);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    const body = await request.json()
    console.log('Creating producer with data:', body)
    const producer = await DatabaseService.createProducer(body)
    return NextResponse.json(producer, { status: 201 })
  } catch (error) {
    console.error('Error creating producer:', error)
    return NextResponse.json(
      { error: 'Failed to create producer', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}