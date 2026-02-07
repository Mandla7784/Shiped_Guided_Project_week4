import { NextRequest, NextResponse } from 'next/server'
import { generateBannerImage } from '@/lib/gemini-image'

/**
 * Guru AI image generator: generate a banner image from a text prompt.
 * Used by the course flow (called from generate-course) and can be called
 * standalone for "Generate Banner Image using AI" (e.g. regenerate or preview).
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const prompt = typeof body.prompt === 'string' ? body.prompt.trim() : ''
    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 })
    }
    const dataUrl = await generateBannerImage(prompt)
    if (!dataUrl) {
      return NextResponse.json(
        { error: 'Image generation failed or is not available (check GEMINI_API_KEY and model access)' },
        { status: 502 }
      )
    }
    return NextResponse.json({ imageDataUrl: dataUrl })
  } catch (error) {
    console.error('Generate banner image error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
