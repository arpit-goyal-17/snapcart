import connectdb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectdb
        const {userId,socketId}=await req.json()
        const user=await User.findByIdAndUpdate(userId,{
            socketID:socketId,
            isOnline:true
        },{new:true})
        if(!user)
            return NextResponse.json({message:"User not found"},{status:400})
        return NextResponse.json({sucess:true},{status:200})
    } catch (error) {
        return NextResponse.json({sucess:false},{status:500})
    }
}