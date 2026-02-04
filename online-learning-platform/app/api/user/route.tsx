
import { NextResponse, NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    const {userEmail, name }  = await req.json()

    return NextResponse.json({})
}