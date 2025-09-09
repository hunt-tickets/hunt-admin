import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ params: string[] }> }
) {
  const resolvedParams = await params
  const [width = '400', height = '600'] = resolvedParams.params

  // Create a simple SVG placeholder with Hunt colors
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ff6b6b;stop-opacity:0.8" />
          <stop offset="25%" style="stop-color:#4ecdc4;stop-opacity:0.8" />
          <stop offset="50%" style="stop-color:#45b7d1;stop-opacity:0.8" />
          <stop offset="75%" style="stop-color:#96ceb4;stop-opacity:0.8" />
          <stop offset="100%" style="stop-color:#ffeaa7;stop-opacity:0.8" />
        </linearGradient>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="1" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad1)"/>
      <rect width="100%" height="100%" fill="url(#grid)"/>
      <rect x="20" y="${parseInt(height) / 2 - 60}" width="${parseInt(width) - 40}" height="120" rx="12" fill="rgba(0,0,0,0.3)" />
      <text x="50%" y="50%" font-family="Source Sans 3, system-ui, sans-serif" font-size="20" font-weight="600" fill="white" text-anchor="middle" dominant-baseline="middle">
        HUNT EVENT
      </text>
      <text x="50%" y="${parseInt(height) / 2 + 20}" font-family="Source Sans 3, system-ui, sans-serif" font-size="12" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">
        ${width} × ${height}
      </text>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}