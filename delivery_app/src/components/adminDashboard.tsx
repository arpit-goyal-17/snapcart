import React from 'react'
import AdminDashboardClient from './adminDashboardClient'
import connectdb from '@/lib/db'
import Order from '@/models/order.model'
import Grocery from '@/models/grocery.model'
import User from '@/models/user.model'
async function  AdminDashboard() {
  await connectdb()
  const orders=await Order.find()
  const users=await User.find({role:"user"})
  const grocerys=await Grocery.find()
  const totalOrders=orders.length
  const totalCustomers=users.length
  const pendingOrders=orders.filter((o)=>o.status=='pending').length
  const totalRevenue=orders.reduce((sum,o)=>sum+=(o.totalAmount||0),0)
  const today=new Date()
  const startOfToday=new Date(today)
  startOfToday.setHours(0,0,0,0)
  const sevenDaysAgo=new Date(today)
  sevenDaysAgo.setDate(today.getDate()-6)
  const todayRevenue=orders.filter((o)=>new Date(o.createdAt)>=startOfToday).reduce((sum,o)=>sum+=(o.totalAmount||0),0)
  const sevenDaysRevenue=orders.filter((o)=>new Date(o.createdAt)>=sevenDaysAgo).reduce((sum,o)=>sum+=(o.totalAmount||0),0)
  const stats=[
    {title:"Total Orders",value:totalOrders},
    {title:"Total Customers",value:totalCustomers},
    {title:"Pending Deliveries",value:pendingOrders},
    {title:"Total Revenue",value:totalRevenue}
  ]
  const chartData=[]
  for(let i=6;i>=0;i--){
    const date=new Date()
    date.setDate(date.getDate()-i)
    date.setHours(0,0,0,0)
    const nextDate=new Date(date)
    nextDate.setDate(date.getDate()+1)
    const ordersCount=orders.filter((o)=>new Date(o.createdAt)>=date&&new Date(o.createdAt)<=nextDate).length
    chartData.push({
      day:date.toLocaleDateString("en-us",{weekday:"short"}),
      orders:ordersCount
    })
  }
  return (
    <div>
      <AdminDashboardClient earning={{today:todayRevenue,sevenDays:sevenDaysRevenue,total:totalRevenue}}
      stats={stats} chartData={chartData}/>
    </div>
  )
}

export default AdminDashboard
