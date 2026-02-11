import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { db } from '@/config/db'
import { courseTable, usersTable } from '@/config/schema'
import { currentUser } from '@clerk/nextjs/server'
import { generateBannerImage } from '@/lib/gemini-image'
import { eq } from 'drizzle-orm'

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
  try {
    let formData
    try {
      formData = await req.json()
    } catch (parseError: any) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json(
        { error: 'Invalid request data', details: 'Failed to parse request body' },
        { status: 400 }
      )
    }
    
    console.log('Received course generation request:', {
      topic: formData.topic,
      category: formData.category,
      difficulty: formData.difficulty,
      chapters: formData.chapters,
      includeVideo: formData.includeVideo
    })
    
    // Validate required fields
    if (!formData.topic || !formData.category || !formData.difficulty || !formData.chapters) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: 'Please provide topic, category, difficulty, and chapters' 
        },
        { status: 400 }
      )
    }
    
    const user = await currentUser()
    const userEmail = user?.primaryEmailAddress?.emailAddress
    console.log('User:', userEmail || 'Not authenticated')
    
    // Ensure user exists in database before creating course (to satisfy foreign key constraint)
    if (userEmail) {
      try {
        // Check if user exists
        const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, userEmail))
        
        // Create user if doesn't exist
        if (existingUsers.length === 0) {
          await db.insert(usersTable).values({
            name: user.fullName || 'Unknown',
            email: userEmail,
            age: 0,
            subscribtion: 'free'
          })
          console.log('Created user in database:', userEmail)
        }
      } catch (userError: any) {
        // If user creation fails, log but continue (might be a race condition)
        console.warn('Could not ensure user exists in database:', userError?.message)
        // Don't throw - we'll handle foreign key constraint error separately
      }
    }

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('GEMINI_API_KEY is missing')
      return NextResponse.json({ error: 'GEMINI_API_KEY is not configured' }, { status: 500 })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    
    // Try different model names in order of preference (using current stable models)
    let model
    const modelNames = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-pro', 'gemini-pro']
    
    // Use the first available model (we'll catch errors if none work)
    model = genAI.getGenerativeModel({ model: modelNames[0] })

    const prompt = `Generate a Learning Course based on the following details:
Topic: ${formData.topic}
Category: ${formData.category}
Difficulty: ${formData.difficulty}
Chapters: ${formData.chapters}

Create ONLY a JSON response (no markdown, no explanation, no code blocks) with:
- Course name
- Description
- Banner image prompt (a detailed prompt for generating a modern, flat style 2D digital illustration related to the course topic)
- Chapters array with name and duration (each chapter should be relevant to the topic)

Important: Return ONLY valid JSON, no markdown formatting, no backticks, no explanations.

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

    console.log('Calling Gemini API with model:', modelNames[0])
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
              // Last model failed, throw original error
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
      return NextResponse.json(
        { error: 'Empty response from AI', details: 'No response from model' },
        { status: 500 }
      )
    }
    const response = result.response
    const text = response.text()
    
    if (!text) {
      console.error('Empty response from Gemini API')
      return NextResponse.json(
        { 
          error: 'Empty response from AI', 
          details: 'The AI service returned an empty response. Please try again.'
        },
        { status: 500 }
      )
    }
    
    console.log('Gemini response length:', text.length)
    console.log('Gemini response preview:', text.substring(0, 200))

    let courseData
    try {
      courseData = parseCourseJson(text)
    } catch (parseError: any) {
      console.error('JSON parsing error:', parseError)
      console.error('Raw Gemini response:', text.substring(0, 500))
      return NextResponse.json(
        { 
          error: 'Failed to parse course data', 
          details: 'The AI response was not valid JSON. Please try again.',
          rawResponse: text.substring(0, 200)
        },
        { status: 500 }
      )
    }
    
    const course = courseData.course

    if (!course.name || !course.description) {
      console.error('Missing course data:', { name: course.name, description: course.description })
      return NextResponse.json(
        { 
          error: 'Generated course missing required fields', 
          details: 'The AI did not generate a complete course. Please try again.',
          received: { hasName: !!course.name, hasDescription: !!course.description }
        },
        { status: 500 }
      )
    }

    if (!Array.isArray(course.chapters)) course.chapters = []

    const bannerPrompt = course.banner_image_prompt?.trim()
    if (bannerPrompt) {
      const dataUrl = await generateBannerImage(bannerPrompt)
      if (dataUrl) course.bannerImageDataUrl = dataUrl
    }

    const cid = Date.now()
    
    // Validate and clean video URL if provided
    let videoUrl: string | undefined = undefined
    if (formData.includeVideo === true && formData.videoUrl) {
      videoUrl = formData.videoUrl.trim()
      if (videoUrl === '') videoUrl = undefined
    }
    
    // Truncate description if too long (database constraint is 255 chars)
    const description = course.description.length > 255 
      ? course.description.substring(0, 252) + '...' 
      : course.description
    
    // Truncate name if too long
    const name = course.name.length > 255 
      ? course.name.substring(0, 252) + '...' 
      : course.name
    
    try {
      // Ensure description and name are within limits
      const safeDescription = description.substring(0, 255)
      const safeName = name.substring(0, 255)
      
      // Only set userEmail if user exists in database (foreign key constraint)
      // If user doesn't exist yet, set to null to avoid constraint violation
      const courseUserEmail = userEmail || null
      
      const results = await db.insert(courseTable).values({
        cid,
        name: safeName,
        description: safeDescription,
        noOfChapters: Number(formData.chapters) || course.chapters.length,
        includeVideo: formData.includeVideo === true,
        videoUrl: videoUrl || null,
        level: formData.difficulty || null,
        category: formData.category || null,
        courseJson: courseData,
        userEmail: courseUserEmail
      })

        console.log('Course created successfully:', { cid, includeVideo: formData.includeVideo, videoUrl })
      return NextResponse.json({ course: courseData, dbResult: results, cid })
    } catch (dbError: any) {
      console.error('Database insertion error:', dbError)
      throw dbError // Re-throw to be caught by outer catch block
    }
  } catch (error: any) {
    console.error('Error generating course:', error)
    
    // Handle specific error types
    if (error?.message?.includes('JSON')) {
      return NextResponse.json(
        { 
          error: 'Failed to parse course data from AI', 
          details: 'The AI response was not in the expected format. Please try again.',
          originalError: error.message
        },
        { status: 500 }
      )
    }
    
    if (error?.code === '23505' || error?.message?.includes('unique')) {
      return NextResponse.json(
        { 
          error: 'Course already exists', 
          details: 'A course with this name already exists. Please try a different name.'
        },
        { status: 409 }
      )
    }
    
    if (error?.message?.includes('DATABASE_URL') || error?.code === '42P01') {
      return NextResponse.json(
        { 
          error: 'Database error', 
          details: 'Database connection failed. Please check your DATABASE_URL configuration.'
        },
        { status: 503 }
      )
    }
    
    // Gemini API errors
    if (error?.status || error?.response?.status) {
      const status = error.status || error.response?.status
      const errorMessage = error.message || error.response?.data?.error?.message || 'Unknown API error'
      return NextResponse.json(
        { 
          error: 'AI service error', 
          details: `Gemini API returned error: ${errorMessage}`,
          status: status
        },
        { status: status >= 400 && status < 500 ? status : 502 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to generate course', 
        details: error instanceof Error ? error.message : 'Unknown error',
        errorType: error?.constructor?.name,
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}





