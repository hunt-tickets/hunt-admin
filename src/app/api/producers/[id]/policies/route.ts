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
    const policies = await DatabaseService.getProducerTerms(id)
    return NextResponse.json(policies)
  } catch (error) {
    console.error('Error fetching producer policies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch producer policies', details: error instanceof Error ? error.message : String(error) },
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
    
    // Validate that we have at least one policy field
    const { terms_and_conditions, privacy_policy, refund_policy } = body;
    if (!terms_and_conditions && !privacy_policy && !refund_policy) {
      return NextResponse.json(
        { error: 'At least one policy field is required' },
        { status: 400 }
      )
    }

    const updatedPolicies = await DatabaseService.updateProducerTerms(id, {
      terms_and_conditions,
      privacy_policy,
      refund_policy
    })
    
    return NextResponse.json(updatedPolicies)
  } catch (error) {
    console.error('Error updating producer policies:', error)
    return NextResponse.json(
      { error: 'Failed to update producer policies', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}