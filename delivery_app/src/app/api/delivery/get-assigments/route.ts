import { auth } from "@/auth";
import connectdb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssigment.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectdb()
        const session=await auth()
        const assignments=await DeliveryAssignment.find({
            brodcastedTo:session?.user?.id,
            status:"broadcasted"
        }).populate("order")
        return NextResponse.json(assignments,{status:200})
    } catch (error) {
        return NextResponse.json({message:`Get Assignment error ${error}`},{status:400})
    }
}