'use client'
import RegisterForm from '@/components/RegisterForm'
import Welcome from '@/components/Welcome'
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

function Register() {
  const [step,setStep]=useState(1)
  const session=useSession()
  if(session?.data)
    redirect("/")
  return (
    <div className='bg-linear-to-b from-green-100 to-white'>
      {step==1?<Welcome nextStep={setStep} />:<RegisterForm previousStep={setStep} />}
    </div>
  )
}

export default Register
