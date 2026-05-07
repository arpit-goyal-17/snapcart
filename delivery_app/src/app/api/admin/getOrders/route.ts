import connectdb from "@/lib/db";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest){
    try{
        await connectdb()
        const result=await Order.find({}).populate("user").populate("assignedDeliveryBoy").sort({createdAt:-1})
        return NextResponse.json(result,{status:200})
    }catch(error){
        return NextResponse.json({message:`Get Orders Error ${error}`},{status:500})
    }
}