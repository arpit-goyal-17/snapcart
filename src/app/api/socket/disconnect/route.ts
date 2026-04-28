import connectdb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
    try {
        await connectdb()
        const {userId}=await req.json()
        if(!userId)
            return NextResponse.json({success:false},{status:500})
        const user=await User.findByIdAndUpdate(userId,{isOnline:false,socketId:null})
        if(!user)
        {
            return NextResponse.json({success:false},{status:500})
        }
        return NextResponse.json({success:true},{status:200})
    } catch (error) {
        return NextResponse.json({message:`${error}`},{status:400})
    }
}