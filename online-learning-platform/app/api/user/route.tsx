
import { usersTable } from "@/config/schema";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
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
        return NextResponse.json((results))

    }


    return NextResponse.json(users[0]);
}