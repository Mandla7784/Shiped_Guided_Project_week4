import { usersTable } from "@/config/schema";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
    try {
        const {email, name }  = await req.json()

        // here we selecting the user if already exist 
        const users = await db.select().from(usersTable)
        .where(eq(usersTable.email, email))


        // otherwise insert to table 

        if(users?.length == 0){
            const results = await db.insert(usersTable).values({
                name,
                email: email,
                age: 0,
                subscribtion: 'free'
            }).returning()
            console.log('Insert results:', results)
            return NextResponse.json(results)

        }


        return NextResponse.json(users[0]);
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 })
    }
}