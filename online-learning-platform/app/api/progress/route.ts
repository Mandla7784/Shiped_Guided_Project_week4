import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { db } from '@/config/db'
import { progressTable } from '@/config/schema'
import { and, eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const courseCid = searchParams.get('courseCid')
    if (!courseCid) return NextResponse.json({ error: 'courseCid required' }, { status: 400 })

    const cid = Number(courseCid)
    const rows = await db.select().from(progressTable).where(and(eq(progressTable.userEmail, email), eq(progressTable.courseCid, cid)))
    const completedChapters = rows.map((r) => r.chapterIndex)
    return NextResponse.json({ completedChapters })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Failed to fetch progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress
    if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { courseCid, chapterIndex } = await req.json()
    const cid = Number(courseCid)
    const idx = Number(chapterIndex)
    if (isNaN(cid) || isNaN(idx) || idx < 0) return NextResponse.json({ error: 'Invalid courseCid or chapterIndex' }, { status: 400 })

    const existing = await db.select().from(progressTable).where(and(eq(progressTable.userEmail, email), eq(progressTable.courseCid, cid), eq(progressTable.chapterIndex, idx)))
    if (existing.length > 0) return NextResponse.json({ success: true, alreadyCompleted: true })

    await db.insert(progressTable).values({ userEmail: email, courseCid: cid, chapterIndex: idx })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving progress:', error)
    return NextResponse.json(
      { error: 'Failed to save progress', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
