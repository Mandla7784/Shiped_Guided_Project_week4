import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/config/db'
import { courseTable } from '@/config/schema'

import { currentUser } from '@clerk/nextjs/server'

export async function POST(req: NextRequest) {
  const formData = await req.json()
  const user = await currentUser()
  console.log(formData)

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `Generate a Learning Course based on the following details:
Topic: ${formData.topic}
Category: ${formData.category}
Difficulty: ${formData.difficulty}
Chapters: ${formData.chapters}

Create ONLY a JSON response (no markdown, no explanation) with:
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
    let text = response.text()

    console.log('Raw response:', text)

    // Remove markdown code blocks if present
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

    // Parse the JSON response and save to database
    const courseData = JSON.parse(text)
    const results = await db.insert(courseTable).values({
      cid: Date.now(),
      name: courseData.course.name,
      description: courseData.course.description,
      noOfChapters: formData.chapters,
      includeVideo: formData.includeVideo || false,
      level: formData.difficulty,
      category: formData.category,
      courseJson: courseData,
      userEmail: user?.primaryEmailAddress?.emailAddress || formData.userEmail
    })
    
    return NextResponse.json({ course: courseData, dbResult: results })
  } catch (error) {
    console.error('Error generating course:', error)
    return NextResponse.json({ error: 'Failed to generate course', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}





