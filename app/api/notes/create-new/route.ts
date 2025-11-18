import { prisma } from "@/app/db/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const {searchParams} = new URL(request.url);
    const userId = searchParams.get('userId') || "";
    
    if(!userId){
        return NextResponse.json({errorMessage: "User ID is required"}, {status: 400});
    }

    const {id} = await prisma.note.create({
        data: {
            authorId: userId,
            text: "",
        }
    });

    return NextResponse.json({noteId: id});
}
