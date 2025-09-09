import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { validateApiSession, createUnauthorizedResponse } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await validateApiSession(request as any);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    const producer = await DatabaseService.getProducerById(params.id)
    return NextResponse.json(producer)
  } catch (error) {
    return NextResponse.json(
      { error: 'Producer not found' },
      { status: 404 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateApiSession(request as any);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    const { id: producerId } = await params
    const body = await request.json()
    
    const { name, description, url } = body
    
    if (!name || typeof name !== 'string' || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Update producer in database
    await DatabaseService.updateProducer(producerId, {
      name: name.trim(),
      description: description?.trim() || null,
      url: url?.trim() || null
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating producer:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update producer', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const user = await validateApiSession(request as any);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    await DatabaseService.deleteProducer(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete producer' },
      { status: 500 }
    )
  }
}