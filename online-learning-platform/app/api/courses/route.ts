import { NextResponse } from 'next/server'
import { db } from '@/config/db'
import { courseTable } from '@/config/schema'

export async function GET() {
  try {
    const courses = await db.select().from(courseTable).orderBy(courseTable.cid)
    return NextResponse.json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch courses', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
