import { NextRequest, NextResponse } from 'next/server'

// AI Processing configuration
const config = {
  webhookUrl: process.env.N8N_WEBHOOK_URL || 'https://automations.hunt-tickets.com/webhook/add-invoice',
  webhookUsername: process.env.N8N_USERNAME || 'hunt',
  webhookPassword: process.env.N8N_PASSWORD || 'hunt',
  timeout: 30000, // 30 seconds
  retries: 2
}

async function callWebhook(data: { fileUrl: string; uuid: string }, attempt: number = 1): Promise<any> {
  console.log(`Calling AI webhook (attempt ${attempt}/${config.retries + 1})`)
  
  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), config.timeout)
  
  try {
    const credentials = Buffer.from(`${config.webhookUsername}:${config.webhookPassword}`).toString('base64')
    
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${credentials}`
      },
      body: JSON.stringify({
        uuid: data.uuid,
        fileUrl: data.fileUrl
      }),
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    const responseText = await response.text()
    let result
    
    try {
      result = responseText ? JSON.parse(responseText) : { status: 'success' }
    } catch (parseError) {
      // If response is not JSON, treat as success if status is OK
      result = { status: 'success' }
    }
    
    console.log('AI webhook response:', result)
    return result
    
  } catch (error) {
    clearTimeout(timeoutId)
    
    if (error instanceof Error) {
      console.warn(`Webhook error on attempt ${attempt}:`, error.message)
      
      // Don't retry on client errors (4xx)
      if (error.message.includes('HTTP 4')) {
        throw error
      }
      
      // Retry on server errors and network issues
      if (attempt <= config.retries) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt - 1) * 1000))
        return callWebhook(data, attempt + 1)
      }
    }
    
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fileUrl, uuid } = await request.json()
    
    if (!fileUrl || !uuid) {
      return NextResponse.json(
        { error: 'Missing fileUrl or uuid' },
        { status: 400 }
      )
    }
    
    console.log('Processing invoice with AI:', { uuid, fileUrl })
    
    // Call the webhook to process with AI - el webhook maneja TODO el procesamiento y creación del invoice
    const webhookResult = await callWebhook({ fileUrl, uuid })
    
    return NextResponse.json({
      success: true,
      message: 'Invoice processing initiated successfully',
      uuid,
      webhookResult
    })
    
  } catch (error) {
    console.error('AI processing error:', error)
    
    let errorMessage = 'AI processing failed'
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.name === 'AbortError') {
        errorMessage = 'AI processing timed out'
      } else if (error.message.includes('HTTP 4')) {
        errorMessage = 'Invalid request to AI service'
      } else if (error.message.includes('HTTP 5')) {
        errorMessage = 'AI service temporarily unavailable'
      } else if (error.message.includes('fetch')) {
        errorMessage = 'Network error connecting to AI service'
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}