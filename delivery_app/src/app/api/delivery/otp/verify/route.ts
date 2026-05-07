import connectdb from "@/lib/db";
import emitEventHandler from "@/lib/emitEventHandler";
import DeliveryAssignment from "@/models/deliveryAssigment.model";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectdb()
        const {orderId,otp}=await req.json()
        if(!orderId||!otp){
            return NextResponse.json({message:"Incorrect Data"},{status:400})
        }
        const order=await Order.findById(orderId)
        if(!order){
            return NextResponse.json({message:"Order not found"},{status:400})
        }
        if(order.deliveryOtp!=otp){
            return NextResponse.json({message:"Incorrect or expired otp"},{status:400})
        }
        order.status="delivered"
        order.deliveredAt=new Date()
        order.deliveryOtpVerification=true
        order.save()
        await emitEventHandler("order-status-update",{orderId:order._id,status:order.status})
        await DeliveryAssignment.updateOne({order:orderId},{$set:{assignedTo:null,status:"completed"}})
        return NextResponse.json({message:"Delivery successfully"},{status:200})
    } catch (error) {
        return NextResponse.json({message:`Verify otp error ${error}`},{status:500})
    }
}