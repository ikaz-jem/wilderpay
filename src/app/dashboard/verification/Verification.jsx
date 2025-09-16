"use client"

import { useEffect, useState, useTransition } from 'react';
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
import { useSession } from 'next-auth/react';
import axios from 'axios';



export default function Verification() {

  const router = useRouter()
  const session = useSession()
  const params = useSearchParams()
  const token = params?.get('verify')
  const user = session?.data?.user


  
  const [resend, setResend] = useState(false)
  const [verificationCode, setVerificationCode] = useState(token || '');


  const [isPending, startTransition] = useTransition()


  async function getUser(id) {
    const res = await axios.get(`/api/users?id=${id}`).then((res) => res?.data?.data?.emailVerified)
    console.log(res)
    if (res) {
      router.push('/dashboard')
    }
  }


  useEffect(() => {
    if (user?.id) {
      getUser(user?.id)
    }
  }, [user])


  const handleVerify = async (e) => {
    startTransition(async () => {
      e.preventDefault();
      const code = isUuid(verificationCode)
      if (code) {
        const verified = await verifyEmailByToken(verificationCode)
        if (verified.email) {
          toast.warning(verified?.message)
          setResend(verified)
        } else if (verified.success) {
          toast.success(verified?.message)
          router.push(appBaseRoutes?.dashboard)
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


    startTransition(async () => {
      e.preventDefault()
      const tokenObject = generateVerificationToken()
      const updated = await renewUserVerificationToken(user?.email, tokenObject)
      if (updated?.success) {
        const data = await sendVerificationEmail(user?.email, tokenObject?.token)
        setResend(true)
        //send email
        if (data) {
          toast.success('New Code Has Been Sent To your Email !')
        }
      } else {
        toast.warning(updated?.message)

        setResend(false)
      }
    })
  }

  return (
    <Suspense>
      <VerificationFormWraper router={router} user={user}>
        <div onSubmit={handleVerify} className=' gap-5 grid space-y-2'>
          <div className='grid gap-3'>
            <p className='text-sm font-semibold'>Verification Code</p>
            <div className='flex w-fullgap-2 bg-white/10 p-2 rounded gap-2'>
              {
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

              }
            </div>
          </div>
          <div className='w-full gap-5 flex'>
            {!resend && <ButtonSecondary onClick={resendCode} loading={isPending} >Resend Code</ButtonSecondary>}
          </div>
        </div>
      </VerificationFormWraper>
    </Suspense>
  );
}
