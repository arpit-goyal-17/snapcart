'use client'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowLeft, Package } from 'lucide-react'
import UserOrderCard from '@/components/UserOrderCard'
import { useRouter } from 'next/navigation'
import ManageOrdersCard from '@/components/ManageOrdersCard'
import { getSocket } from '@/lib/socket'
import { IUser } from '@/models/user.model'
interface IOrder{
    _id?:string
    user:string
    items:[
        {
            grocery:string,
            quantity:number,
            name:string,
            price:string,
            unit:string,
            image:string
        }
    ]
    totalAmount:number
    paymentMethod:"cod"|"online"
    address:{
        fullname:string,
        city:string,
        state:string,
        pinCode:string,
        fullAddress:string,
        mobile:string,
        latitude:number,
        longitude:number
    }
    isPaid:boolean
    assignment:string
    assignedDeliveryBoy?:IUser
    status:"pending"|"out for delivery"|"delivered"
    createdAt?:Date
    updatedAt?:Date
}
function page() {
    const [orders, setOrders] = useState<IOrder[]>()
    useEffect(() => {
        const getorders = async () => {
            try {
                const results = await axios.get('/api/admin/getOrders')
                setOrders(results.data)
            } catch (error) {
                console.log(error)
            }
        }
        getorders()
    }, [])
    useEffect(():any=>{
        const socket=getSocket()
        socket.on("new-order",(newOrder)=>{
            setOrders((prev)=>[newOrder,...prev!])
        })
        socket.on("order-assigned",({orderId,assignedDeliveryBoy})=>{
            setOrders((prev)=>prev?.map((o)=>(o._id==orderId?{...o,assignedDeliveryBoy}:o)))
        })
        socket.on("order-status-update",(data)=>{
        setOrders(orders?.map((o)=>
            {
                if(o._id?.toString()==data.orderId)
                    return {...o,status:data.status}
                else
                    return o
            }))
      })
        return ()=>{socket.off("new-order")
            socket.off("order-assigned")
            socket.off("order-status-update")
        }
    },[])
    const router = useRouter()
    return (
        <div className='min-h-screen bg-gray-50 w-full'>
            <div className='fixed top-0 left-0 w-full backdrop-blur bg-white/70 shadow-sm border-b z-50'>
                <div className='max-w-3xl mx-auto flex items-center gap-4 px-4 py-3'>
                    <button className='p-2 bg-gray-100 rounded-full hover:bg-gray-200 active:scale-95 transition' onClick={() => router.push("/")}>
                        <ArrowLeft size={24} className='text-green-700' />
                    </button>
                    <h1 className='text-xl font-bold text-gray-800'>Manage Orders</h1>
                </div>
            </div>
            <div className='max-w-6xl mx-auto px-4 pt-24 pb-16 space-y-8'>
            <div className='space-y-6'>
                {orders?.map((order, index) => (
                    <div key={index}>
                        <ManageOrdersCard order={order} />
                    </div>
                ))}
            </div>
            </div>
        </div>
    )
}

export default page
