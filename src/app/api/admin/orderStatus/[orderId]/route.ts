import connectdb from "@/lib/db";
import DeliveryAssignment from "@/models/deliveryAssigment.model";
import Order from "@/models/order.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest,{params}:{params:{orderId:string}}){
    try {
        await connectdb()
        const {orderId}=await params
        const {status}=await req.json()
        const order=await Order.findById(orderId).populate("user")
        if(!order){
            return NextResponse.json({message:"Order not found"},{status:400})
        }
        order.status=status
        let deliveryBoysPayload:any=[]
        if(status=='out for delivery' && !order.assignment){
            const {latitude,longitude}=order.address
            if (!latitude || !longitude || typeof latitude !== 'number' || typeof longitude !== 'number') {
                return NextResponse.json({message: "Invalid order address coordinates"}, {status: 400});
            }
            const nearByDeliveryBoy=await User.find({
                role:"delivery boy",
                isOnline:true,
                location:{
                    $near:{
                        $geometry:{type:"Point",coordinates:[longitude,latitude]},
                        $maxDistance:10000
                    }
                }
            })
            const nearByIds=nearByDeliveryBoy.map((b)=>b._id)
            const busyIds=await DeliveryAssignment.find({
                assignedTo:{$in:nearByIds},
                status:{$nin:["broadcasted","completed"]}
            }).distinct("assignedTo")
            const busyIdsSet=new Set(busyIds.map((b)=>String(b)))
            const availableDeliveryBoys=nearByDeliveryBoy.filter(
                b=>!busyIdsSet.has(b._id.toString())
            )
            const candidates=availableDeliveryBoys.map(b=>b._id)
            if(candidates.length==0){
                await order.save()
                return NextResponse.json({message:"No Available Delivery Boy Found"},{status:200})
            }
            const deliveryAssignment=await DeliveryAssignment.create(
                {order:order._id,broadcastedTo:candidates,status:"broadcasted"}
            )
            order.assignment=deliveryAssignment._id
            deliveryBoysPayload=availableDeliveryBoys.map((boy)=>({
                id:boy._id,
                name:boy.name,
                mobile:boy.mobile,
                latitude:boy.location.coordinates[1],
                longitude:boy.location.coordinates[0]
            }))
            await deliveryAssignment.populate("order")
        }
        await order.save()
        await order.populate("user")
        return NextResponse.json({
            assigned:order.assignment?._id,
            availableBoys:deliveryBoysPayload
        },{status:200})
    } catch (error) {
        return NextResponse.json({
            message:`Update Status Error ${error}`
        },{status:500})
    }
}