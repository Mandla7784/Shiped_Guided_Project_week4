
import { usersTable } from "@/config/schema";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
    try {
        const {email, name }  = await req.json()

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 })
        }

        // Check database connection
        if (!process.env.DATABASE_URL) {
            return NextResponse.json(
                { error: 'Database not configured', details: 'DATABASE_URL is missing from environment variables.' },
                { status: 503 }
            )
        }

        // Try to select the user if already exists 
        let users: Array<{ id: number; name: string; email: string; age: number; subscribtion: string }> = []
        try {
            users = await db.select().from(usersTable).where(eq(usersTable.email, email))
        } catch (selectError: any) {
            console.error('Error selecting user:', {
                message: selectError?.message,
                code: selectError?.code,
                stack: selectError?.stack
            })
            // If table doesn't exist, provide helpful error
            if (selectError?.message?.includes('does not exist') || selectError?.code === '42P01') {
                return NextResponse.json(
                    { 
                        error: 'Database table not found', 
                        details: 'The users table does not exist. Please run database migrations: npx drizzle-kit push or npx drizzle-kit migrate',
                        code: selectError?.code
                    },
                    { status: 503 }
                )
            }
            // Re-throw with more context
            throw new Error(`Database query failed: ${selectError?.message || 'Unknown error'}`)
        }

        // If user doesn't exist, insert to table 
        if(users?.length === 0){
            try {
                await db.insert(usersTable).values({
                    name: name || 'Unknown',
                    email: email,
                    age: 0,
                    subscribtion: 'free'
                }) 
                return NextResponse.json({ success: true, user: { email, name: name || 'Unknown' } })
            } catch (insertError: any) {
                console.error('Error inserting user:', insertError)
                // If it's a unique constraint violation, try to fetch again
                if (insertError?.code === '23505' || insertError?.message?.includes('unique')) {
                    const existingUsers = await db.select().from(usersTable).where(eq(usersTable.email, email))
                    if (existingUsers.length > 0) {
                        return NextResponse.json(existingUsers[0])
                    }
                }
                throw insertError
            }
        }

        return NextResponse.json(users[0]);
    } catch (error: any) {
        console.error('Error in user API:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        const errorCode = error?.code || ''
        const errorDetails = error?.message || String(error)
        
        if (message.includes('DATABASE_URL') || !process.env.DATABASE_URL) {
            return NextResponse.json(
                { error: 'Database not configured', details: 'Add DATABASE_URL to .env.local (e.g. from Neon.tech or your Postgres provider).' },
                { status: 503 }
            )
        }
        
        // Ensure we always return a proper error object
        const errorResponse = {
            error: 'Internal server error',
            details: errorDetails || 'An unexpected error occurred',
            code: errorCode || 'UNKNOWN_ERROR',
            message: message || 'Unknown error occurred'
        }
        
        console.error('User API error response:', errorResponse)
        return NextResponse.json(errorResponse, { status: 500 })
    }
}