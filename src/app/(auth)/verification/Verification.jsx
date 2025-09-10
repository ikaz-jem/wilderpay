"use client"

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { useRouter, useSearchParams } from 'next/navigation';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import { isUuid } from 'uuidv4';
import { verifyEmailByToken } from '@/actions/verify-email';
import { appBaseRoutes } from '@/routes';
import { sendVerificationEmail } from '@/actions/sendVerificationEmail';
import { generateVerificationToken } from '@/app/lib/tokens';
import VerificationFormWraper from './VerificationFormWraper';
import { Suspense } from 'react';
import { renewUserVerificationToken } from '@/actions/renewUserVerificationToken';



export default function Verification() {

  const router = useRouter()

  const params = useSearchParams()
  const token = params?.get('verify')

  const [resend, setResend] = useState(false)
  const [verificationCode, setVerificationCode] = useState(token || '');


  const [isPending,startTransition] = useTransition()

  const handleVerify = async (e) => {
    startTransition(async ()=>{
      e.preventDefault();
      const code = isUuid(verificationCode)
      if (code) {
        const verified = await verifyEmailByToken(verificationCode)
        if (verified.email) {
          toast.warning(verified?.message)
           setResend(verified)
        } else if (verified.success) {
          toast.success(verified?.message)
          router.push(appBaseRoutes?.login)
        } else {
          toast.error(verified.message)
        }
      } else {
        toast.error('Please Enter a Valide Code !')
      }
    })
  };

  const handleChange = async (e) => {
    e.preventDefault()
    setVerificationCode(e.target.value)
  }

  const goToDashboard = async (e) => {
    router.push(appBaseRoutes?.dashboard)
  }

  const resendCode = async (e) => {

    startTransition(async ()=>{
      e.preventDefault()
      const tokenObject = generateVerificationToken()
      const updated = await renewUserVerificationToken(resend?.email,tokenObject)
      if (updated?.success){
        const data = await sendVerificationEmail(resend?.email, tokenObject?.token)
        setResend(false)
        //send email
        if (data) {
          toast.success('New Code Has Been Sent To your Email !')
        }
      }else {
        toast.warning(updated?.message)
        
        setResend(false)
      }
    })
  }

  return (
    <Suspense>
      <VerificationFormWraper router={router}>
        <div onSubmit={handleVerify} className=' gap-5 grid space-y-2'>
          <div className='grid gap-3'>
            <p className='text-sm font-semibold'>Verification Code</p>
            <div className='flex w-fullgap-2 bg-white/10 p-2 rounded gap-2'>
              {!resend ?
                <>
                  <input
                    className=' text-white  h-10 p-3 text-sm outline-none  w-full disabled:cursor-not-allowed disabled:text-white/50 '
                    name="verification"
                    type="text"
                    placeholder="eg : 1b817622-589e-4288-b788-7b8df83010a3"
                    value={verificationCode}
                    onChange={handleChange}
                    disabled={isPending}
                  />
                  <ButtonPrimary type="submit" onClick={handleVerify} loading={isPending}>Verify</ButtonPrimary>
                </>
                :
                <ButtonPrimary  className={'w-full'} onClick={resendCode} loading={isPending} >Resend Code</ButtonPrimary>
              }
            </div>
          </div>
          <div className='w-full gap-5 flex'>
            <ButtonSecondary onClick={goToDashboard}>Verify Later</ButtonSecondary>
          </div>
        </div>
      </VerificationFormWraper>
    </Suspense>
  );
}
