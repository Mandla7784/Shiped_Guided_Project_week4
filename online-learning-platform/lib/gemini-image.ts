/**
 * Generate a banner image using Gemini's image generation (Nano Banana / Imagen-style).
 * Uses the same GEMINI_API_KEY as the rest of the project.
 * Returns a data URL so the image can be stored in courseJson and displayed without file storage.
 */
// Gemini native image model (Nano Banana); falls back gracefully if unavailable
const GEMINI_IMAGE_MODEL = 'gemini-2.5-flash-image'
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta'

export async function generateBannerImage(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.warn('GEMINI_API_KEY not set; skipping banner image generation')
    return null
  }

  try {
    const url = `${API_BASE}/models/${GEMINI_IMAGE_MODEL}:generateContent?key=${apiKey}`
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseModalities: ['TEXT', 'IMAGE'],
        responseMimeType: 'text/plain',
      },
    }

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini image API error:', res.status, errText)
      return null
    }

    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ inlineData?: { mimeType?: string; data?: string }; text?: string }> }
      }>
    }

    const parts = data.candidates?.[0]?.content?.parts ?? []
    for (const part of parts) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png'
        return `data:${mime};base64,${part.inlineData.data}`
      }
    }
    return null
  } catch (err) {
    console.error('Banner image generation failed:', err)
    return null
  }
}
