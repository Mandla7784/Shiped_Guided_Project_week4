import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/config/db'
import { courseTable } from '@/config/schema'
import { currentUser } from '@clerk/nextjs/server'
import { generateBannerImage } from '@/lib/gemini-image'

/** Extract JSON object from model text (handles markdown code blocks and stray text) */
function parseCourseJson(text: string): { course: { name: string; description: string; banner_image_prompt?: string; chapters: Array<{ name: string; duration: string }>; bannerImageDataUrl?: string } } {
  let cleaned = text.replace(/```json\n?/gi, '').replace(/```\n?/g, '').trim()
  const first = cleaned.indexOf('{')
  const last = cleaned.lastIndexOf('}')
  if (first !== -1 && last !== -1 && last > first) cleaned = cleaned.slice(first, last + 1)
  const parsed = JSON.parse(cleaned) as Record<string, unknown>
  if (parsed.course && typeof parsed.course === 'object') return parsed as { course: { name: string; description: string; banner_image_prompt?: string; chapters: Array<{ name: string; duration: string }>; bannerImageDataUrl?: string } }
  return { course: parsed as { name: string; description: string; banner_image_prompt?: string; chapters: Array<{ name: string; duration: string }>; bannerImageDataUrl?: string } }
}

export async function POST(req: NextRequest) {
  const formData = await req.json()
  const user = await currentUser()

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
  }

  const genAI = new GoogleGenerativeAI(apiKey)
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
    const response = result.response
    const text = response.text()
    if (!text) {
      return NextResponse.json({ error: 'Empty response from Gemini' }, { status: 500 })
    }

    const courseData = parseCourseJson(text)
    const course = courseData.course

    if (!course.name || !course.description) {
      return NextResponse.json({ error: 'Generated course missing name or description' }, { status: 500 })
    }

    if (!Array.isArray(course.chapters)) course.chapters = []

    const bannerPrompt = course.banner_image_prompt?.trim()
    if (bannerPrompt) {
      const dataUrl = await generateBannerImage(bannerPrompt)
      if (dataUrl) course.bannerImageDataUrl = dataUrl
    }

    const cid = Date.now()
    const results = await db.insert(courseTable).values({
      cid,
      name: course.name,
      description: course.description,
      noOfChapters: Number(formData.chapters) || course.chapters.length,
      includeVideo: formData.includeVideo === true,
      videoUrl: formData.videoUrl || undefined,
      level: formData.difficulty || undefined,
      category: formData.category || undefined,
      courseJson: courseData,
      userEmail: user?.primaryEmailAddress?.emailAddress ?? formData.userEmail ?? undefined
    })

    return NextResponse.json({ course: courseData, dbResult: results })
  } catch (error) {
    console.error('Error generating course:', error)
    return NextResponse.json(
      { error: 'Failed to generate course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}





