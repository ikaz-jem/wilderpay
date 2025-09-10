"use client"

import { useState } from 'react';
import { toast } from 'sonner';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { useRouter, useSearchParams } from 'next/navigation';
import ButtonSecondary from '@/app/components/ButtonSecondary';
import { isUuid } from 'uuidv4';
import { verifyEmailByToken } from '@/actions/verify-email';
import { appBaseRoutes } from '@/routes';
import { sendVerificationEmail } from '@/actions/sendVerificationEmail';
import { generateVerificationToken } from '@/app/lib/tokens';
import { useTransition } from 'react';
import { resetPasswordEmail } from '@/actions/resetPasswordEmail';
import { FaCheckCircle } from "react-icons/fa";
import ResetPasswprdWrapper from './ResetPasswprdWrapper';
import { Suspense } from 'react';



export default function ForgotPassword() {

    const router = useRouter()

    const params = useSearchParams()
    const token = params?.get('verify')

    const [sent, setSent] = useState(false)
    const [email, setEmail] = useState('');
    const [isPending, startTransition] = useTransition()


    const handleVerify = async (e) => {
        e.preventDefault();

        const verificationSent = await resetPasswordEmail(email)

        if (verificationSent.success) {
            setSent(true)
            toast.success('email has been Sent !')
        }

    };

    const handleChange = async (e) => {
        e.preventDefault()
        setEmail(e.target.value)
    }

    const goToDashboard = async (e) => {
        router.push(appBaseRoutes?.dashboard)
    }


    return (
        <Suspense >
            <ResetPasswprdWrapper sent={sent}>
                <form onSubmit={handleVerify} className=' gap-5 grid space-y-2'>
                    <div className='grid gap-3'>
                        {!sent ?
                            <>
                                <p className='text-sm font-semibold'>Email Address</p>
                                <div className='flex w-fullgap-2 bg-white/10 p-2 rounded gap-2'>
                                    <input
                                        className=' text-white  h-10 p-3 text-sm outline-none  w-full  '
                                        name="email"
                                        type="email"
                                        placeholder="example@yieldium.app"
                                        value={email}
                                        onChange={handleChange}
                                        required
                                    />
                                    <ButtonPrimary type="submit" >Reset</ButtonPrimary>
                                </div>
                            </>
                            :
                            <div className='flex items-center gap-5 justify-center'>
                                <FaCheckCircle className='text-3xl text-green-500/80' />
                            </div>
                        }
                    </div>

                </form>
            </ResetPasswprdWrapper>
        </Suspense>

    );
}
