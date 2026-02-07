import { NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/config/db'
import { enrollmentsTable } from '@/config/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const rows = await db.select().from(enrollmentsTable).where(eq(enrollmentsTable.userEmail, email))
    return NextResponse.json(rows.map((r) => r.courseCid))
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch enrollments', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
