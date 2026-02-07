
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

        // here we selecting the user if already exist 
        const users = await db.select().from(usersTable)
        .where(eq(usersTable.email, email))


        // otherwise insert to table 

        if(users?.length == 0){
            const results = await db.insert(usersTable).values({
                name: name || 'Unknown',
                email: email,
                age: 0,
                subscribtion: 'free'
            }) 
            console.log(results)
            return NextResponse.json({ success: true, user: { email, name } })

        }


        return NextResponse.json(users[0]);
    } catch (error) {
        console.error('Error in user API:', error)
        const message = error instanceof Error ? error.message : 'Unknown error'
        if (message.includes('DATABASE_URL')) {
            return NextResponse.json(
                { error: 'Database not configured', details: 'Add DATABASE_URL to .env.local (e.g. from Neon.tech or your Postgres provider).' },
                { status: 503 }
            )
        }
        return NextResponse.json({ error: 'Internal server error', details: message }, { status: 500 })
    }
}