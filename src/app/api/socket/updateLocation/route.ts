import connectdb from "@/lib/db";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectdb
        const {userId,location}=await req.json()
        if(!userId||!location)
            return NextResponse.json({messgae:"Missing userId or location"},{status:400})
        const user=await User.findByIdAndUpdate(userId,{location},{new:true})
        if(!user){
            return NextResponse.json({message:"User not found"},{status:400})
        }
        return NextResponse.json({message:"Location Updated"},{status:200})
    } catch (error) {
        return NextResponse.json({message:`${error}`},{status:500})
    }
}