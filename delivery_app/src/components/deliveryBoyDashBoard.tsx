import React from 'react'
import DeliveryBoy from './DeliveryBoy'
import { auth } from '@/auth'
import connectdb from '@/lib/db'
import Order from '@/models/order.model'

async function DeliveryBoyDashBoard() {
  await connectdb()
  const session=await auth()
  const deliveryId=session?.user?.id
  const orders=await Order.find({assignedDeliveryBoy:deliveryId,deliveryOtpVerification:true})
  const today=new Date().toDateString()
  const todayOrders=orders.filter((o)=>new Date(o.deliveredAt).toDateString()===today).length
  const todayEarning=todayOrders*40
  return (
    <>
      <DeliveryBoy earning={todayEarning}/>
    </>
  )
}

export default DeliveryBoyDashBoard
