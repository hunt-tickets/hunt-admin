import { NextRequest, NextResponse } from 'next/server'
import { validateApiSession, createUnauthorizedResponse } from '@/lib/auth'
import { DatabaseService } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await validateApiSession(request);
  if (!user) {
    return createUnauthorizedResponse();
  }

  try {
    const { id: producerId } = await params
    const formData = await request.formData()
    const file = formData.get('file') as File
    const logoType = (formData.get('logoType') as string) || 'logo'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      )
    }

    // Map logo types to file names
    const fileNames = {
      'logo': 'logo.png',
      'logo_white': 'logo_white.png',
      'logo_black': 'logo_black.png',
      'logo_banner': 'logo_banner.png'
    };
    
    const fileName = fileNames[logoType as keyof typeof fileNames] || 'logo.png'
    const filePath = `${producerId}/logos/${fileName}`
    
    // Convert file to buffer
    const buffer = await file.arrayBuffer()
    
    // Upload to Supabase storage using REST API
    const uploadUrl = `https://db.hunt-tickets.com/storage/v1/object/producers/${filePath}`
    
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer sb_secret_${process.env.SUPABASE_SERVICE_KEY}`,
        'apiKey': `sb_secret_${process.env.SUPABASE_SERVICE_KEY}`,
        'Content-Type': file.type,
        'x-upsert': 'true', // This allows overwriting existing files
      },
      body: buffer,
    })

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text()
      console.error('Supabase upload error:', errorText)
      throw new Error(`Failed to upload to storage: ${uploadResponse.status} ${errorText}`)
    }

    const publicUrl = `https://db.hunt-tickets.com/storage/v1/object/public/producers/${filePath}`

    // Update producer's logoUrl in database (only for main logo)
    if (logoType === 'logo') {
      try {
        await DatabaseService.updateProducer(producerId, { logoUrl: publicUrl });
        console.log('Updated producer logoUrl in database:', { producerId, logoUrl: publicUrl });
      } catch (dbError) {
        console.error('Failed to update producer logoUrl in database:', dbError);
        // Don't fail the entire request if DB update fails, logo is already uploaded
      }
    }

    return NextResponse.json({ 
      success: true, 
      url: publicUrl 
    })
  } catch (error) {
    console.error('Error uploading logo:', error)
    return NextResponse.json(
      { 
        error: 'Failed to upload logo', 
        details: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    )
  }
}