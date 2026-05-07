import { auth } from "@/auth";
import connectdb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssigment.model";
import { NextResponse } from "next/server";

export async function GET(){
    try {
        await connectdb()
        const session=await auth()
        const deliveryBoyId=session?.user?.id
        const deliveryAssignement=await DeliveryAssignment.findOne({assignedTo:deliveryBoyId,status:"assigned"}).populate({path:"order",populate:{path:"address"}}).lean()
        if(!deliveryAssignement)
            return NextResponse.json({active:false},{status:200})
        return NextResponse.json({active:true,assignment:deliveryAssignement},{status:200})
    } catch (error) {
        return NextResponse.json({message:`current order error ${error}`},{status:200})
    }
}