'use client'
import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { ArrowRight, Bike, User, UserCog } from 'lucide-react'
import axios from 'axios'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
function EditMobileRole() {
  const [roles,setRoles]=useState([
    {id:"user",label:"User",icon:User},
    {id:"delivery boy",label:"Delivery Boy",icon:Bike}
  ])
  const [selectedRole,setSelectedRole]=useState("")
  const [mobile,setMobile]=useState("")
  const router=useRouter()
  const {update}=useSession()
  const handleEdit=async ()=>{
    try {
      const result=await axios.post("/api/user/editRoleMobile",{
        role:selectedRole,
        mobile
      })
      await update({role:selectedRole})
      router.push("/")
    } catch (error) {
      console.log(error)
    }
  }
  useEffect(()=>{
    const checkForAdmin=async ()=>{
    try{
      const result=await axios.get('/api/checkForAdmin')
      if(!result.data.adminExist)
        setRoles(prev=>[...prev,{id:"admin",label:"Admin",icon:UserCog}])
    }
    catch(error){
      console.log(error)
    }
  }
  checkForAdmin()
  },[])
  return (
    <div className='flex flex-col items-center min-h-screen p-6 w-full'>
      <motion.h1
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.6
        }}
        className='text-3xl md:text-4xl font-extrabold text-green-700 text-center mt-8 '
      >
        Select your role
      </motion.h1>
      <div className='flex flex-col md:flex-row justify-center items-center gap-6 mt-10'>
        {roles.map((role)=>{
          const Icon=role.icon
          const isSelected=selectedRole==role.id
          return (
            <motion.div
            key={role.id}
            whileTap={{scale:0.9}}
            onClick={()=>setSelectedRole(role.id)}
            className={`flex flex-col items-center justify-center w-50 h-45 rounded-2xl border-2 
            transition-all ${
              isSelected?"border-green-600 bg-green-100 shadow-lg":
              "border-gray-300 bg-white hover:border-green-400"
          }`}>
              <Icon />
              <span>{role.label}</span>
            </motion.div>
          )
        })}
      </div>
      <motion.div
      initial={{
          opacity: 0
        }}
        animate={{
          opacity: 1
        }}
        transition={{
          duration: 0.6,
          delay:0.3
        }}
        className='flex flex-col items-center mt-10'
      >
        <label htmlFor='mobile' className='text-gray-700 font-medium mb-2'>Enter your Mobile No.</label>
        <input type='tel' id='mobile' placeholder='XXXXXXXXXX'
        onChange={(e)=>setMobile(e.target.value)}
         className='w-64 md:w-80 px-4 py-3 rounded-xl border border-gray-300
        focus:ring-2 focus:ring-green-500 focus:outline-none text-gray-800'/>
        <motion.button
        initial={{opacity:0,y:20}}
        animate={{opacity:1,y:0}}
        transition={{delay:0.7}}
        className={`inline-flex items-center mt-4 gap-2 font-semibold py-3 px-8 rounded-2xl shadow-md transition-all
          duration-200 ${
            selectedRole&&mobile.length==10?
            "bg-green-600 hover:bg-green-700 text-white":
            "bg-gray-300 text-gray-500 cursor-not-allowed"
          }
        `}
        disabled={!selectedRole||mobile.length!=10}
        onClick={handleEdit}>
          Go to home <ArrowRight />
        </motion.button>
      </motion.div>
    </div>
  )
}

export default EditMobileRole
