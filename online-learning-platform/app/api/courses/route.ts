import { NextResponse } from 'next/server'
import { db } from '@/config/db'
import { courseTable } from '@/config/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  try {
    // Check database connection
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured', details: 'DATABASE_URL is missing' },
        { status: 503 }
      )
    }
    
    const courses = await db.select().from(courseTable).orderBy(desc(courseTable.cid))
    return NextResponse.json(courses || [])
  } catch (error: any) {
    console.error('Error fetching courses:', {
      message: error?.message,
      code: error?.code,
      stack: error?.stack
    })
    
    if (error?.message?.includes('does not exist') || error?.code === '42P01') {
      return NextResponse.json(
        { 
          error: 'Database table not found', 
          details: 'The courses table does not exist. Please run: npx drizzle-kit push' 
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch courses', 
        details: error instanceof Error ? error.message : 'Unknown error',
        code: error?.code
      },
      { status: 500 }
    )
  }
}
