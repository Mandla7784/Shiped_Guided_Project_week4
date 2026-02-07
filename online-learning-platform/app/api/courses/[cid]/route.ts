import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/config/db'
import { courseTable } from '@/config/schema'
import { eq } from 'drizzle-orm'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ cid: string }> }
) {
  try {
    const cid = Number((await params).cid)
    if (isNaN(cid)) return NextResponse.json({ error: 'Invalid course id' }, { status: 400 })
    const rows = await db.select().from(courseTable).where(eq(courseTable.cid, cid))
    const course = rows[0]
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    return NextResponse.json(course)
  } catch (error) {
    console.error('Error fetching course:', error)
    return NextResponse.json(
      { error: 'Failed to fetch course', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
