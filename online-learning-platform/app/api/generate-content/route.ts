import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })

  try {
    const { courseName, chapterName, chapterIndex } = await req.json()
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `You are a course content writer. Write clear, educational content for this chapter.

Course: ${courseName || 'General'}
Chapter ${Number(chapterIndex) + 1}: ${chapterName || 'Chapter'}

Provide 2-4 short paragraphs of course content (concepts, examples, key takeaways). Use plain text, no markdown. Keep it concise and useful for learners.`

    const result = await model.generateContent(prompt)
    const text = result.response.text()
    return NextResponse.json({ content: text || '' })
  } catch (error) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { error: 'Failed to generate content', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
