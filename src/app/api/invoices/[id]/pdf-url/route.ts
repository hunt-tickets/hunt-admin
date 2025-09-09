import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const invoiceId = params.id
    console.log('Getting signed URL for invoice:', invoiceId)
    
    // Verificar que tenemos el service key
    const serviceKey = process.env.SUPABASE_SERVICE_KEY
    if (!serviceKey) {
      console.error('SUPABASE_SERVICE_KEY not found in environment variables')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }
    
    // Llamada directa a Supabase Storage para generar signed URL
    const bucketName = 'invoice'
    const filePath = `main/${invoiceId}.pdf`
    
    // Usar el formato exacto de la documentación de Supabase
    const supabaseUrl = `https://db.hunt-tickets.com/storage/v1/object/sign/${bucketName}/${filePath}`
    
    console.log('Calling Supabase Storage:', supabaseUrl)
    console.log('Service key exists:', !!serviceKey)
    console.log('Service key length:', serviceKey.length)
    console.log('Bucket name:', bucketName)
    console.log('File path:', filePath)
    
    // Intentar con el formato mínimo de headers
    const requestBody = {
      expiresIn: 3600
    }
    
    console.log('Request body:', JSON.stringify(requestBody))
    
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${serviceKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })
    
    console.log('Supabase response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Supabase Storage error:', response.status, response.statusText, errorText)
      return NextResponse.json(
        { error: 'Failed to generate signed URL', details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    console.log('Supabase response data:', data)
    
    // Supabase devuelve { signedURL: "..." }
    const signedUrl = data.signedURL || data.signedUrl
    if (!signedUrl) {
      console.error('No signed URL in response:', data)
      return NextResponse.json(
        { error: 'Invalid response from Supabase Storage' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ signedUrl })
  } catch (error) {
    console.error('Error calling Supabase Storage API:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}