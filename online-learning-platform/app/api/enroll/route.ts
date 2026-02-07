import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/config/db'
import { enrollmentsTable } from '@/config/schema'
import { and, eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const courseCid = Number(body.courseCid)
    if (isNaN(courseCid)) return NextResponse.json({ error: 'Invalid courseCid' }, { status: 400 })

    const existing = await db.select().from(enrollmentsTable).where(and(eq(enrollmentsTable.userEmail, email), eq(enrollmentsTable.courseCid, courseCid)))
    if (existing.length > 0) return NextResponse.json({ success: true, alreadyEnrolled: true })

    await db.insert(enrollmentsTable).values({ userEmail: email, courseCid })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error enrolling:', error)
    return NextResponse.json(
      { error: 'Failed to enroll', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
