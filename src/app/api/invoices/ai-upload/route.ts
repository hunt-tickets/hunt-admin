import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'

// Supabase configuration - Usando la misma URL que hunt-invoice
const supabaseConfig = {
  url: process.env.HUNT_DATABASE_URL || process.env.VITE_HUNT_DATABASE_URL || 'https://db.hunt-tickets.com',
  serviceKey: process.env.FORMS_SERVICE_KEY || process.env.VITE_FORMS_SERVICE_KEY || process.env.SUPABASE_SERVICE_KEY
}

// Debug environment variables
console.log('🔍 Environment check:', {
  HUNT_DATABASE_URL: process.env.HUNT_DATABASE_URL ? 'SET' : 'NOT SET',
  VITE_HUNT_DATABASE_URL: process.env.VITE_HUNT_DATABASE_URL ? 'SET' : 'NOT SET',
  FORMS_SERVICE_KEY: process.env.FORMS_SERVICE_KEY ? 'SET' : 'NOT SET',
  VITE_FORMS_SERVICE_KEY: process.env.VITE_FORMS_SERVICE_KEY ? 'SET' : 'NOT SET',
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY ? 'SET' : 'NOT SET'
})

// Validate configuration
if (!supabaseConfig.serviceKey) {
  throw new Error('Missing Supabase service key. Please set FORMS_SERVICE_KEY, VITE_FORMS_SERVICE_KEY or SUPABASE_SERVICE_KEY environment variable.')
}

if (supabaseConfig.serviceKey.length < 50) {
  console.warn('⚠️ Service key seems too short, may be invalid:', supabaseConfig.serviceKey.substring(0, 10) + '...')
}

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

function getFileExtension(filename: string): string {
  return filename.toLowerCase().substring(filename.lastIndexOf('.'))
}

// Convert image to PDF using jsPDF (igual que hunt-invoice)
async function convertImageToPDF(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = function(event) {
      try {
        const img = new Image()
        img.onload = function() {
          const pdf = new jsPDF()
          
          // Calculate dimensions to fit the page while maintaining aspect ratio
          const pageWidth = pdf.internal.pageSize.getWidth()
          const pageHeight = pdf.internal.pageSize.getHeight()
          const margin = 10
          const maxWidth = pageWidth - (margin * 2)
          const maxHeight = pageHeight - (margin * 2)
          
          let width = img.width
          let height = img.height
          
          // Scale down if image is larger than page
          if (width > maxWidth) {
            height = (height * maxWidth) / width
            width = maxWidth
          }
          
          if (height > maxHeight) {
            width = (width * maxHeight) / height
            height = maxHeight
          }
          
          // Center the image
          const x = (pageWidth - width) / 2
          const y = (pageHeight - height) / 2
          
          pdf.addImage(event.target!.result as string, 'JPEG', x, y, width, height)
          
          // Convert PDF to blob
          const pdfBlob = pdf.output('blob')
          resolve(pdfBlob)
        }
        
        img.onerror = function() {
          reject(new Error('Failed to load image'))
        }
        
        img.src = event.target!.result as string
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = function() {
      reject(new Error('Failed to read file'))
    }
    
    reader.readAsDataURL(file)
  })
}

// Generate signed URL (igual que hunt-invoice)
async function generateSignedUrl(fileName: string, expiresIn = 7776000): Promise<string | null> {
  try {
    console.log('🔐 Generating signed URL for:', fileName)
    
    const signedUrlEndpoint = `${supabaseConfig.url}/storage/v1/object/sign/invoice/main/${fileName}`
    
    const response = await fetch(signedUrlEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseConfig.serviceKey}`,
        'apikey': supabaseConfig.serviceKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        expiresIn: expiresIn
      })
    })
    
    console.log('📡 Signed URL response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.warn('⚠️ Failed to generate signed URL:', errorText)
      return null
    }
    
    const data = await response.json()
    console.log('📡 Signed URL response data:', data)
    
    const signedUrlPath = data.signedURL || data.signedUrl || data.url
    
    if (signedUrlPath) {
      const fullSignedUrl = `${supabaseConfig.url}/storage/v1${signedUrlPath}`
      console.log('✅ Signed URL generated successfully:', fullSignedUrl)
      return fullSignedUrl
    } else {
      console.warn('⚠️ No signed URL in response, falling back to public URL')
      return null
    }
    
  } catch (error) {
    console.error('❌ Error generating signed URL:', error)
    return null
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }

    // Validate file (igual que hunt-invoice)
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
    
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB' },
        { status: 400 }
      )
    }
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF, JPG, and PNG are allowed' },
        { status: 400 }
      )
    }

    // Security checks (igual que hunt-invoice)
    if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename characters' },
        { status: 400 }
      )
    }

    const uuid = generateUUID()
    
    // Check if file is an image that should be converted to PDF
    const isImage = ['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)
    let fileToUpload = file
    let fileName = `${uuid}.pdf`  // Always save as PDF now (igual que hunt-invoice)
    
    if (isImage) {
      console.log('🔄 Converting image to PDF...')
      fileToUpload = new File([await convertImageToPDF(file)], fileName, { type: 'application/pdf' })
      console.log('✅ Image converted to PDF successfully')
    } else {
      // If it's already a PDF, keep original extension
      const extension = getFileExtension(file.name)
      fileName = `${uuid}${extension}`
      fileToUpload = file
    }
    
    // Upload to Supabase Storage (exactamente igual que hunt-invoice)
    const uploadUrl = `${supabaseConfig.url}/storage/v1/object/invoice/main/${fileName}`
    
    console.log('🔄 Starting upload to Supabase Storage')
    console.log('📁 File details:', { 
      fileName, 
      size: fileToUpload.size, 
      type: fileToUpload.type || 'application/pdf', 
      originalName: file.name,
      converted: isImage ? 'Image converted to PDF' : 'Original file'
    })
    console.log('🌐 Upload URL:', uploadUrl)
    console.log('🔑 Using service key:', supabaseConfig.serviceKey ? `${supabaseConfig.serviceKey.substring(0, 20)}...` : 'MISSING')
    console.log('🏠 Supabase URL:', supabaseConfig.url)
    
    let response;
    try {
      response = await fetch(uploadUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseConfig.serviceKey}`,
          'apikey': supabaseConfig.serviceKey,
          'Content-Type': fileToUpload.type || 'application/pdf'
        },
        body: fileToUpload
      })
      
      console.log('📡 Response status:', response.status)
      console.log('📡 Response headers:', Object.fromEntries(response.headers.entries()))
      
    } catch (fetchError) {
      console.error('❌ Fetch error details:', {
        message: fetchError instanceof Error ? fetchError.message : 'Unknown fetch error',
        name: fetchError instanceof Error ? fetchError.name : 'Unknown',
        cause: fetchError instanceof Error ? fetchError.cause : undefined,
        stack: fetchError instanceof Error ? fetchError.stack : undefined
      })
      throw new Error(`Network error: ${fetchError instanceof Error ? fetchError.message : 'Failed to connect to Supabase'}`)
    }
    
    const responseText = await response.text()
    console.log('📡 Response body:', responseText)
    
    if (!response.ok) {
      let errorMessage
      try {
        const errorData = JSON.parse(responseText)
        errorMessage = errorData.message || errorData.error || responseText
      } catch {
        errorMessage = responseText
      }
      throw new Error(`Storage upload failed: HTTP ${response.status}: ${errorMessage}`)
    }
    
    // Generate signed URL for the uploaded file
    const signedUrl = await generateSignedUrl(fileName)
    
    const result = {
      success: true,
      fileName,
      url: signedUrl || `${supabaseConfig.url}/storage/v1/object/public/invoice/main/${fileName}`,
      uuid,
      extension: isImage ? 'pdf' : getFileExtension(file.name).substring(1),
      originalName: file.name,
      size: fileToUpload.size,
      type: fileToUpload.type || 'application/pdf',
      converted: isImage
    }
    
    console.log('✅ File successfully uploaded to storage:', result)
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Error uploading file to storage:', error)
    return NextResponse.json(
      { error: `Failed to upload file: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}