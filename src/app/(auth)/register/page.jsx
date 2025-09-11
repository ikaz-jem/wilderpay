"use client"

import { Suspense, useState ,useEffect} from 'react';
import { toast } from 'sonner';
import ButtonPrimary from '@/app/components/ButtonPrimary';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import { appBaseRoutes } from '@/routes';
import { useTransition } from 'react';
import { FaEye } from "react-icons/fa6";


function Login() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const router = useRouter()
  const [data, setData] = useState({ email: '', password: '', referredBy: id || null , invite:'' });
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


  const handleCreateAccount = async (e) => {
    e.preventDefault();

    const isPass = handleCheck()
    if (!isPass) {
      setNum1(Math.floor(Math.random() * 10));
      setNum2(Math.floor(Math.random() * 15));
      return toast.error('invalid credentials')
    }

    startTransition(async () => {
      const res = await axios.post('api/users/register', data).then((res) => res.data)
      if (res.success) {
        toast.success(res.message + " Please Check Your Email !");
        router.push(`${appBaseRoutes?.verification}?email=${data?.email}`);
      } else {
        toast.error(res.message);
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



  const login = async (e) => {
    router.push(appBaseRoutes?.login)
  }



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
    <div className='h-[100vh] w-[100vw] flex items-center justify-center  '>



      <div className='bg-[url(/assets/images/3.png)] bg-contain bg-no-repeat bg-center w-screen h-screen absolute top-0 z-[-1] grayscale-40 opacity-80 mask-b-from-0  '>
        <span className="bg-pink-500 rounded-full h-[300px] w-[300px] blur-[250px] absolute top-0 left-0 z-0 "></span>
        <span className="bg-primary rounded-full h-[300px] w-[300px] blur-[250px] absolute bottom-0 right-0 z-0 "></span>
      </div>


      <div className='bg-black/5 backdrop-blur-xl p-10 pb-10 rounded-xl max-w-md w-full space-y-5 border border-primary/10  shadow-xl shadow-black m-2 '>
        <div className="flex items-center gap-2 justify-center cursor-pointer " onClick={() => router.push('.')}>
          <img src="/assets/images/logo.webp" alt="" loading="lazy" className="rounded-full h-10 w-10" />
          {/* <h5 className="font-light  tracking-wide text-xl ">Yieldium</h5> */}
        </div>
        <div className='grid gap-2 text-center'>

          <h1 className='text-2xl font-semibold'>Create New Account
          </h1>
          <p className='text-sm'>Create your Account in 10S
          </p>

        </div>

        <form onSubmit={handleCreateAccount} className=' gap-5 grid space-y-5'>
          <div className='grid gap-3'>

            <p className='text-sm font-semibold'>Email</p>
            <input
              className='bg-white/10 placeholder:text-xs text-white rounded h-10 p-3 text-sm outline-none focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-500/60'
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
              <p className='text-xs !text-primary/50 hover:!text-primary cursor-pointer' onClick={() => router.push(appBaseRoutes?.resetPassword)}>Forgot Password ?</p>
            </div>

            <div className={`flex items-center rounded focus:border-primary/50 focus:border  bg-white/10 ${isPending && "!bg-neutral-400/40 cursor-not-allowed"} `}>

              <input
                className=' text-white w-full h-10 p-3 text-sm outline-none disabled:cursor-not-allowed  placeholder:text-xs'
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


            <div className='grid gap-3'>

            <p className='text-sm font-semibold'>Invitation</p>
            <input
              className='bg-white/10 text-white placeholder:text-xs rounded h-10 p-3 text-sm outline-none focus:border-primary/50 focus:border disabled:cursor-not-allowed disabled:bg-neutral-500/60'
              name="invite"
              type="text"
              placeholder="invitation ID (Optional)"
              value={data?.invite}
              onChange={handleChange}
              disabled={isPending}
            />

          </div>



          </div>
          <div className='w-full'>


            <div className='grid space-y-3 pb-5'>
              <p className='text-sm font-semibold'>Solve to verify you're human:</p>
              <strong className='!text-red-500'>{num1} + {num2} = {userAnswer}</strong>
              <Keyboard />
            </div>

            <ButtonPrimary className={'w-full'} type="submit" loading={isPending}>Create Account</ButtonPrimary>
          </div>
        </form>
        <p className='text-xs text-center !text-white/80'>Already Have an Account ? <span className='text-xs !text-primary/50 hover:!text-primary cursor-pointer' onClick={login}> Login</span> </p>

      </div>
    </div>
  );
}



export default function LoginPage() {


  return (
    <Suspense fallback='loading ...'>
      <Login />
    </Suspense>

  )

}