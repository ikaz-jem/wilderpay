import React from 'react'
import ButtonSecondary from '@/app/components/ButtonSecondary'
import { FcGoogle } from "react-icons/fc";



export default function LoginFormWrapper({ children, signUp, data, googleLogin, router, loading }) {

  return (
    <div className='h-[100vh] w-[100vw] flex items-center justify-center  '>

      <div className='bg-[url(/assets/images/3.png)] bg-contain bg-no-repeat bg-center w-screen h-screen absolute top-0 z-[-1] grayscale-40 opacity-80 mask-b-from-0'>
        <span className="bg-pink-500 rounded-full h-[300px] w-[300px] blur-[250px] absolute top-0 left-0 z-0 "></span>
        <span className="bg-primary rounded-full h-[300px] w-[300px] blur-[250px] absolute bottom-0 right-0 z-0 "></span>
      </div>


      <div className='bg-black/5 backdrop-blur-xl p-10 pb-10 rounded-xl max-w-md w-full space-y-5 border border-primary/10 shadow-xl shadow-black m-2 '>
        <div className="flex items-center gap-2 justify-center cursor-pointer" onClick={() => router.push('.')} >
          <img src="/assets/images/logo.webp" alt="" loading="lazy" className="rounded-full h-10 w-10" />
          <h5 className="font-light  tracking-wide text-xl "></h5>
        </div>
        <div className='grid gap-2 text-center'>

          <h1 className='text-2xl font-semibold'>Login
          </h1>
          <p className='text-sm'>Enter your email below to login to your account
          </p>

        </div>


        {children}

        {/* <ButtonSecondary className={'w-full'} Icon={FcGoogle} onClick={googleLogin} loading={loading && !data?.password}>Continue with Google  </ButtonSecondary> */}
        <p className='text-xs text-center !text-white/80'>Don't have an account ? <span className='text-xs !text-primary/50 hover:!text-primary cursor-pointer' onClick={signUp}> Sign up</span> </p>

      </div>
    </div>)
}
