'use client'
import { IOrder } from '@/models/order.model'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import OrderSuccess from '@/app/user/order-success/page'
import { ChevronDown, ChevronUp, CreditCard, MapPin, Package, Phone, Truck, UserIcon } from 'lucide-react'
import { userAgent } from 'next/server'
import Image from 'next/image'
import axios from 'axios'

function ManageOrdersCard({ order }: { order: IOrder }) {
  const statusOptions = ["pending", "out for delivery"]
  const [status,setStatus]=useState<string>(order.status)
  const [expanded, setExpanded] = useState(false)
  const updateStatus=async (orderId:string,status:string)=>{
    try 
    {
      const result=await axios.post(`/api/admin/orderStatus/${orderId}`,{status})
      console.log(result.data)
      setStatus(status)
    }
    catch(error){
      console.log(error)
    }
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className='bg-white shadow-md hover:shadow-lg border border-gray-100 rounded-2xl p-6 transition-all'>
      <div className='flex flex-col md:flex-row md:items-start md:justify-between gap-4'>
        <div className='space-y-1'>
          <p className='flex font-bold text-lg items-center gap-2 text-green-700'>
            <Package size={20} />
            Order #{order._id?.toString().slice(-6)}
          </p>
          <span className={`inline-block text-xs font-semibold py-1 px-3 rounded-full border ${order.isPaid ? "bg-green-100 text-green-700 border-green-300"
            : "bg-red-100 text-red-700 border-red-300"
            }`}>
            {order.isPaid ? "Paid" : "Unpaid"}
          </span>
          <p className='text-gray-500 text-sm'>
            {new Date(order.createdAt!).toLocaleString()}
          </p>
          <div className='mt-3 space-y-1 text-gray-700 text-sm'>
            <p className='flex items-center gap-2 font-semibold'>
              <UserIcon size={16} className='text-green-600' />
              {order.address.fullname}
            </p>
            <p className='flex items-center gap-2 font-semibold'>
              <Phone size={16} className='text-green-600' />
              {order.address.mobile}
            </p>
            <p className='flex items-center gap-2 font-semibold'>
              <MapPin size={16} className='text-green-600' />
              {order.address.fullAddress}
            </p>
          </div>
          <p className='mt-3 flex items-center gap-2 font-sm text-gray-700'>
            <CreditCard size={16} className='text-green-600' />
            {order.paymentMethod == 'cod' ? "Cash on Delivery" : "Online payment"}
          </p>
        </div>
        <div className='flex flex-col items-start md:items-end gap-2'>
          <span className={`text-xs font-semibold py-1 px-3 rounded-full capitalize ${status == 'delivered' ? "bg-green-100 text-green-700" :
            status == 'out for delivery' ? "bg-blue-100 text-blue-700" :
              "bg-yellow-100 text-yellow-700"
            }`}>
            {status}
          </span>
          <select className='border border-gray-300 rounded-lg px-3 py-1 shadow-lg outline-none focus:ring-2 focus:ring-green-500 hover:border-green-400 transition' onChange={(e)=>
            updateStatus(order._id?.toString()!,e.target.value)}
            value={status}>
            {statusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className='border-t border-gray-200 mt-3 pt-3'>
        <button onClick={() => setExpanded(prev => !prev)}
          className='w-full flex justify-between items-center text-sm font-medium text-gray-700 hover:text-green-700 transition'>
          <span className='flex gap-2 items-center'>
            <Package size={16} className='text-green-600' />
            {expanded ? "Hide Order Items" : `View ${order.items.length} items`}
          </span>
          {expanded ? <ChevronUp size={16} className='text-green-600' /> :
            <ChevronDown size={16} className='text-green-600' />}
        </button>
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ height: expanded ? "auto" : 0, opacity: expanded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          className='overflow-hidden'>
          <div className='mt-3 space-y-3'>
            {order.items.map((item, index) => (
              <div className='flex justify-between items-center bg-gray-50 rounded-xl px-3 py-2 hover:bg-gray-100 transition' key={index}>
                <div className='flex items-center gap-3'>
                  <Image src={item.image} alt={item.name} width={48} height={48} className='rounded-lg object-cover border border-gray-200' />
                  <div>
                    <p className='text-sm font-medium text-gray-800'>{item.name}</p>
                    <p className='text-xs text-gray-500'>{item.quantity} x {item.unit}</p>
                  </div>
                </div>
                <div>
                  <p className='text-sm font-medium text-gray-800'>₹{Number(item.price) * item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        <div className='border-t pt-3 flex justify-between items-center text-sm font-semibold text-gray-800 mt-3'>
          <div className='flex gap-2 items-center text-gray-700 text-sm'>
            <Truck size={16} className='text-green-600' />
            <span>Delivery: <span className='text-green-700 font-semibold'>{status}</span></span>
          </div>
          <div>
            Total: <span className='text-green-700 font-bold'>₹{order.totalAmount}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ManageOrdersCard
