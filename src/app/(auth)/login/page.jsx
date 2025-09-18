"use client"

import { signIn } from 'next-auth/react';
import { useState, useTransition, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { loginSchema } from './validation';
import { toast } from 'sonner';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { useRouter } from 'next/navigation';
import LoginFormWrapper from './LoginFormWrapper';
import { appBaseRoutes } from '@/routes';
import { FaEye } from "react-icons/fa6";

export default function LoginPage() {
  const router = useRouter()

  const [data, setData] = useState({ email: '', password: '' });
  const [formErrors, setFormErrors] = useState({});
  const [isPending, startTransition] = useTransition()
  const [view, setView] = useState('password');
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');


  useEffect(() => {
    // Generate 2 random numbers when component loads
    setNum1(Math.floor(Math.random() * 10));
    setNum2(Math.floor(Math.random() * 10));
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // const isPass = handleCheck()
    // if (!isPass) {
    //   setNum1(Math.floor(Math.random() * 10));
    //   setNum2(Math.floor(Math.random() * 15));
    //   return toast.error('invalid credentials')
    // }



    startTransition(async () => {

      let result = loginSchema?.safeParse(data)

      if (!result.success) {
        const fieldErrors = result.error.format();

        if (!result.success) {
          const fieldErrors = result.error.format();
          setFormErrors({
            email: fieldErrors.email?._errors[0],
            password: fieldErrors.password?._errors[0]
          });
        }


        if (fieldErrors.password) {
          toast.error(fieldErrors.password?._errors[0])
        }
        if (fieldErrors.email) {
          toast.error(fieldErrors.email?._errors[0])
        }
      } else {
        toast.info('signing in ...')
        const res = await signIn('credentials', {
          redirect: false,
          email: data?.email?.toLowerCase(),
          password: data?.password,
          // callbackUrl: '/dashboard'
        });
        if (res?.ok) {
          // Force a page reload or session refresh
          // window.location.href = '/dashboard'; // hard reload
          // OR (less reliable):
          // router.refresh(); if using app router
        }
        if (res?.error) {
          toast.error('Sign-in failed. Please try again.');
        } else {
          toast.success('Connected ! Loading Dashboard ..');
          router.push('/dashboard') 
        }
        // Proceed with login API call
      }

    })
  };



  const handleChange = async (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const googleLogin = async (e) => {
    await signIn('twitter');
    e.preventDefault();
  }

  const signUp = async (e) => {
    router.push(appBaseRoutes?.singUp)
  }

  const forgotPasword = (value) => {
    router.push(appBaseRoutes?.resetPassword)
  };






  const correctAnswer = num1 + num2;

  const handleCheck = () => {
    if (parseInt(userAnswer) === correctAnswer) {

      return true // inform parent
    } else {
      return false
    }
  };

  function Keyboard() {

    const handleKeyPress = (val) => {
      if (val === 'del') {
        setUserAnswer((prev) => prev.slice(0, -1));
      } else {
        setUserAnswer((prev) => prev + val);
      }
    };

    const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'del'];

    return (
      <div className='gap-2 flex flex-wrap justify-center'>

        {keys.map((key, i) => (
          <button
            id={Math.floor(Math.random() * 600 + i)}
            key={key}
            onClick={() => handleKeyPress(key)}
            className='bg-neutral-700 w-10 rounded text-lg p-2 cursor-pointer hover:bg-neutral-600'
          >
            {key === 'del' ? '⌫' : key}
          </button>
        ))}

      </div>
    )

  }


 

  return (
    <LoginFormWrapper signUp={signUp} data={data} googleLogin={googleLogin} router={router} loading={isPending} >
      <form onSubmit={handleSubmit} className=' gap-5 grid space-y-5 relative'>
        <div className='grid gap-3'>
          <p className='text-sm font-semibold'>Email</p>
          <input
            className='bg-white/10  placeholder:text-xs aria-selected:bg-none auto text-white rounded h-10 p-3 text-sm outline-none focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-400/30'
            name="email"
            type="email"
            placeholder="Email"
            value={data?.email}
            onChange={handleChange}
            required
            disabled={isPending}
          />
        </div>
        <div className='grid gap-3'>

          <div className='flex justify-between items-baseline'>
            <p className='text-sm font-semibold'>Password</p>
            <p className='text-xs !text-primary/50 hover:!text-primary cursor-pointer' onClick={forgotPasword} >Forgot Password ?</p>
          </div>

          <div className='flex items-center rounded focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-400/30 bg-white/10 '>

            <input

              className='w-full text-white placeholder:text-xs  h-10 p-3 text-sm outline-none '
              name="password"
              type={view}
              placeholder="Password"
              value={data?.password}
              onChange={handleChange}
              required
              disabled={isPending}

            />
            <FaEye className='text-2xl text-neutral mx-5 cursor-pointer hover:text-primary' onMouseOver={() => setView('text')} onMouseOut={() => setView('password')} />

          </div>

        </div>
        <div className='w-full'>

          {/* <div className='grid space-y-3 pb-5'>
            <p className='text-sm font-semibold'>Solve to verify you're human:</p>
            <strong className='!text-red-500'>{num1} + {num2} = {userAnswer}</strong>
            <Keyboard />
          </div> */}

          <ButtonPrimary className={'w-full'} loading={isPending} type="submit">Login</ButtonPrimary>
        </div>
      </form>


    </LoginFormWrapper>

  );
}
