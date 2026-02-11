import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/config/db'
import { usersTable } from '@/config/schema'
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const email = user.primaryEmailAddress.emailAddress
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email))
    
    if (users.length === 0) {
      return NextResponse.json({ subscription: 'free' })
    }

    return NextResponse.json({ subscription: users[0].subscribtion || 'free' })
  } catch (error) {
    console.error('Error fetching subscription:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user?.primaryEmailAddress?.emailAddress) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { subscription } = await req.json()
    const validSubscriptions = ['free', 'pro', 'team']
    
    if (!validSubscriptions.includes(subscription)) {
      return NextResponse.json({ error: 'Invalid subscription plan' }, { status: 400 })
    }

    const email = user.primaryEmailAddress.emailAddress
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email))
    
    if (users.length === 0) {
      // Create user if doesn't exist
      await db.insert(usersTable).values({
        name: user.fullName || 'Unknown',
        email: email,
        age: 0,
        subscribtion: subscription
      })
    } else {
      // Update subscription
      await db.update(usersTable)
        .set({ subscribtion: subscription })
        .where(eq(usersTable.email, email))
    }

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    console.error('Error updating subscription:', error)
    return NextResponse.json(
      { error: 'Failed to update subscription', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
