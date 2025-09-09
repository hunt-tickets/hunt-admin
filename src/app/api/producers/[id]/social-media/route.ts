import { NextResponse } from 'next/server'
import { DatabaseService } from '@/lib/db'
import { validateApiSession, createUnauthorizedResponse } from '@/lib/auth'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateApiSession(request as any);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    const { id } = await params;
    const socialMedia = await DatabaseService.getProducerSocialMedia(id)
    return NextResponse.json(socialMedia)
  } catch (error) {
    console.error('Error fetching social media:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
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
    const { id } = await params;
    const body = await request.json()
    await DatabaseService.updateProducerSocialMedia(id, body)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating social media:', error)
    return NextResponse.json(
      { error: 'Failed to update social media', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}