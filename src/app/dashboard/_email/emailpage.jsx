"use client"
import { sendVerificationEmail } from '@/actions/sendVerificationEmail'
import ButtonPrimary from '@/app/components/ButtonPrimary'
import { generateVerificationToken } from '@/app/lib/tokens'
import React from 'react'

export default function page() {


    const handleSubmit= async()=> {
    const { token, expiresAt } = generateVerificationToken()


        await sendVerificationEmail('ikazjem@gmail.com',token)
    }


  return (
    <div className='container'>
    <ButtonPrimary onClick={handleSubmit}>Send Email</ButtonPrimary>
    </div>
  )
}
