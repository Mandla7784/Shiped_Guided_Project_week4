import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: NextRequest) {
  const formData = await req.json()
  console.log(formData)

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

  const prompt = `Generate a Learning Course based on the following details:
Topic: ${formData.topic}
Category: ${formData.category}
Difficulty: ${formData.difficulty}
Chapters: ${formData.chapters}

Create a JSON response with:
- Course name
- Description
- Banner image prompt (modern, flat style 2D digital illustration)
- Chapters array with name and duration

JSON Schema:
{
  "course": {
    "name": "string",
    "description": "string",
    "banner_image_prompt": "string",
    "chapters": [
      {
        "name": "string",
        "duration": "string"
      }
    ]
  }
}`

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    console.log(text)
    
    return NextResponse.json({ course: text })
  } catch (error) {
    console.error('Error generating course:', error)
    return NextResponse.json({ error: 'Failed to generate course' }, { status: 500 })
  }
}





