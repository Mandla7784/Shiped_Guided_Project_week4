import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'GEMINI_API_KEY not configured' }, { status: 500 })

  try {
    const { courseName, chapterName, chapterIndex } = await req.json()
    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try different model names in order of preference (using current stable models)
    const modelNames = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-pro', 'gemini-pro']
    let model = genAI.getGenerativeModel({ model: modelNames[0] })

    const prompt = `You are a course content writer. Write clear, educational content for this chapter.

Course: ${courseName || 'General'}
Chapter ${Number(chapterIndex) + 1}: ${chapterName || 'Chapter'}

Provide 2-4 short paragraphs of course content (concepts, examples, key takeaways). Use plain text, no markdown. Keep it concise and useful for learners.`

    let result
    try {
      result = await model.generateContent(prompt)
    } catch (modelError: any) {
      // If model not found, try fallback models
      if (modelError?.message?.includes('not found') || modelError?.message?.includes('not supported')) {
        console.warn(`Model ${modelNames[0]} not available, trying alternatives...`)
        for (let i = 1; i < modelNames.length; i++) {
          try {
            console.log(`Trying model: ${modelNames[i]}`)
            const fallbackModel = genAI.getGenerativeModel({ model: modelNames[i] })
            result = await fallbackModel.generateContent(prompt)
            console.log(`Successfully used model: ${modelNames[i]}`)
            break
          } catch (fallbackError) {
            if (i === modelNames.length - 1) {
              throw modelError
            }
            continue
          }
        }
      } else {
        throw modelError
      }
    }

    if (!result) {
      return NextResponse.json({ error: 'Failed to generate content', details: 'No response from model' }, { status: 500 })
    }
    const text = result.response.text()
    return NextResponse.json({ content: text || '' })
  } catch (error: any) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate content', 
        details: error instanceof Error ? error.message : 'Unknown error',
        modelError: error?.message?.includes('not found') || error?.message?.includes('not supported') 
          ? 'No available Gemini models found. Please check your API key permissions.' 
          : undefined
      },
      { status: 500 }
    )
  }
}
