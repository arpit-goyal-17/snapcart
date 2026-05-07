import connectdb from "@/lib/db";
import { sendMail } from "@/lib/mailer";
import Order from "@/models/order.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    try {
        await connectdb()
        const {orderId}=await req.json()
        const order=await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json({message:"Order not found"},{status:400})
        }
        const otp=Math.floor(Math.random()*9000+1000).toString()
        order.deliveryOtp=otp
        await order.save()
        await sendMail(order.user.email,"Your Delivery OTP",
            `<h2>Your delivery otp is <strong>${otp}</strong></h2>`
        )
        return NextResponse.json({message:"OTP sent successfully"},{status:200})
    } catch (error) {
        console.log(error)
        return NextResponse.json({message:`Send otp error ${error}`},{status:500})
    }
}