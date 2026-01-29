import { ArrowLeft, EyeIcon, EyeOff, Key, Leaf, Loader2, Lock, LogIn, Mail, User } from 'lucide-react'
import React, { useState } from 'react'
import {motion} from 'motion/react'
import Image from 'next/image'
import google from '@/assets/2a5758d6-4edb-4047-87bb-e6b94dbbbab0-cover.png'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
type propType={
    previousStep:(s:number)=>void
}
function RegisterForm({previousStep}:propType) {
  let [name,setName]=useState("")
  let [email,setEmail]=useState("")
  let [password,setPassword]=useState("")
  let [show,setShow]=useState(false)
  let [loading,setLoading]=useState(false)
  const handleRegister=async (e:React.FormEvent)=>{
    e.preventDefault()
    setLoading(true)
    try{
      const result=await axios.post("/api/auth/register",{
        name,email,password
      })
      router.push("/login")
      setLoading(false)
    }
    catch(error){
      console.log(error)
      setLoading(false)
    }
  }
  const router=useRouter()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen px-6 py-10 bg-white relative'>
      <button
      className='absolute top-6 left-6 flex items-center gap-2 text-white bg-green-400 hover:bg-green-500 transition-colors cursor-pointer
      rounded-2xl py-2 px-2'
      onClick={()=>previousStep(1)}>
        <ArrowLeft className='w-5 h-5'/>
        <span className='font-medium'>Back</span>
      </button>
      <motion.h1
      initial={{y:-10,opacity:0}}
      animate={{y:0,opacity:1}}
      transition={{duration:0.6}}
       className='text-4xl font-extrabold text-green-700 mb-2'>
        Create account
      </motion.h1>
      <br></br>
      <motion.p className='text-gray-500 flex items-center gap-1'
      initial={{y:-10,opacity:0}}
      animate={{y:0,opacity:1}}
      transition={{duration:0.6}}
      >Join Snapcart today <Leaf className='w-5 t-5 text-green-600'/></motion.p>
      <br></br>
      <motion.form
      onSubmit={handleRegister}
      initial={{opacity:0}}
      animate={{opacity:1}}
      transition={{duration:0.6}}
       className='flex flex-col gap-5 w-full max-w-sm'>
        <div className='relative'>
          <User className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
          className='w-full border border-gray-400 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2
          focus:ring-green-500 focus:outline-none'
           type='text' placeholder='Enter Your Name' 
           onChange={(e)=>{setName(e.target.value)}}
           value={name}/>
        </div>
        <div className='relative'>
          <Mail className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
          className='w-full border border-gray-400 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2
          focus:ring-green-500 focus:outline-none'
           type='email' placeholder='Enter Your Email' 
           onChange={(e)=>{setEmail(e.target.value)}}
           value={email}/>
        </div>
        <div className='relative'>
          <Lock className='absolute left-3 top-3.5 w-5 h-5 text-gray-400' />
          <input
          className='w-full border border-gray-400 rounded-xl py-3 pl-10 pr-4 text-gray-800 focus:ring-2
          focus:ring-green-500 focus:outline-none'
           type={show?"text":"password"} placeholder='Enter Your Password' 
           onChange={(e)=>{setPassword(e.target.value)}}
           value={password}/>
           {show?<EyeOff className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer
           ' onClick={()=>setShow(false)}/>:<EyeIcon className='absolute right-3 top-3.5 w-5 h-5 text-gray-500 cursor-pointer'
           onClick={()=>setShow(true)}/>}
        </div>
        {(()=>{
          const formValidation=name!==""&& email!=="" && password!==""
          return <button disabled={!formValidation||loading} className={`w-full font-semibold py-3 rounded-xl transition-all duration-200 shadow-md
          inline-flex items-center justify-center gap-2 ${
            formValidation? 'bg-green-600 hover:bg-green-700 text-white':
            'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}>
            {loading?<Loader2 className='w-5 h-5 animate-spin'/>:"Register"}
          </button>
        })()}
        <div className='flex items-center gap-2 text-gray-400 text-sm mt-2'>
          <span className='flex-1 h-px bg-gray-200'></span>
          OR
          <span className='flex-1 h-px bg-gray-200'></span>
        </div>
      </motion.form>
        <button className='max-w-sm w-full flex items-center justify-center gap-3 border
        border-gray-300 hover:bg-gray-50 py-3 rounded-xl text-gray-700 font-medium
        transition-all duration-200'
        onClick={()=>{signIn("google",{callbackUrl:"/"})}}>
          <Image src={google} width={40} height={40} alt="google"/>
          Continue With Google
        </button>
      <p className='text-gray-600 mt-6 
      text-sm flex items-center gap-1'
      onClick={()=>{router.push('/login')}}
      >Already have an account?<LogIn className='w-4 h-4'/> <span className='text-green-600 cursor-pointer'> Sign In</span></p>
    </div>
  )
}

export default RegisterForm
