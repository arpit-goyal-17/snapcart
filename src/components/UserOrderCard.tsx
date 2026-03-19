import { IOrder } from '@/models/order.model'
import React from 'react'
import {motion} from 'motion/react'
import { CreditCard, Truck } from 'lucide-react'
function UserOrderCard({order}:{order:IOrder}) {
  const getStatusColor=(status:string)=>{
    switch(status){
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300"
      case "out for delivery":
        return "bg-blue-100 text-blue-700 border-blue-300"
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300"
      default:
        return "bg-gray-100 text-gray-700 border-gray-300"
    }
  }
  return (
    <motion.div className='bg-white rounded-2xl border border-gray-100 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden'
    initial={{opacity:0,y:15}}
    animate={{opacity:1,y:0}}
    transition={{duration:0.4}}>
      <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-3 border-b border-gray-100 px-5 py-4 bg-linear-to-r from-green-50 to-white'>
        <div>
          <h3 className='text-large font-bold text-gray-700'>Order <span className='text-green-700 font-bold'>#{order?._id?.toString()?.slice(-6)}</span></h3>
          <p className='text-xs text-gray-500 mt-1'>{new Date(order.createdAt!).toLocaleString()}</p>
        </div>
        <div className='flex flex-wrap items-center gap-2'>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
            order.isPaid?"bg-green-100 text-green-700 border-green-300":
            "bg-red-100 text-red-700 border-red-300"
          }`}>
            {order.isPaid?"Paid":"Unpaid"}
          </span>
          <span className={`px-3 py-1 text-xs font-semibold border rounded-full ${getStatusColor(order.status)}`}>
            {order.status}
          </span>
        </div>
        </div>
        <div className='p-5 space-y-4'>
          {order.paymentMethod=='online'?
          <div className='flex items-center gap-2 text-gray-700 text-xs'>
            <CreditCard size={16} className='text-green-600'/>
            <span>Online Payment</span>
          </div>
          :
          <div className='flex items-center gap-2 text-gray-700 text-xs'>
            <Truck size={16} className='text-green-600'/>
            <span>Cash On Delivery</span>
          </div>
          }
        </div>
    </motion.div>
  )
}

export default UserOrderCard
