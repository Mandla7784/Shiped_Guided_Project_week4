
import { usersTable } from "@/config/schema";
import { NextResponse, NextRequest } from "next/server";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";


export async function POST(req: NextRequest) {
    const {userEmail, name }  = await req.json()

    // here we selecting the user if already exist 
    const users = await db.select().from(usersTable)
    .where(eq(usersTable.email, userEmail))


    // otherwise insert to table 

    if(users?.length == 0){
        const results = await db.insert(usersTable).values({
            name,
            email: userEmail,
            age: 0,
            subscribtion: 'free'
        })

    }


    return NextResponse.json({})
}