import { auth } from "@/auth";
import connectdb from "@/lib/db";
import Grocery from "@/models/grocery.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectdb()
        const session=await auth()
        if(session?.user?.role!=="admin"){
            return NextResponse.json({
                message:"You are not admin"
            },{status:400})
        }
        const {groceryId}=await req.json()
        const grocery=await Grocery.findByIdAndDelete(groceryId,{new:true}
        )
        return NextResponse.json(
            grocery,{status:200}
        )
    } catch (error) {
        return NextResponse.json(
            {message:`Delete grocery error ${error}`},
            {status:500}
        )
    }
}