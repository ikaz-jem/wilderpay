
export default function VerificationFormWraper({ children, router ,user}) {
    return (
        <div className=' flex items-center justify-center  '>
           
            <div className='bg-black/5 backdrop-blur-xl p-10 pb-10 rounded-xl max-w-xl w-full space-y-10 border border-primary/10  shadow-xl shadow-black m-2 '>
                <div className="flex items-center gap-2 justify-center cursor-pointer " onClick={() => router.push('.')}>
                    <img src="/assets/images/logo.webp" alt="" loading="lazy" className="rounded-full h-10 w-10" />
                    <h5 className="font-light  tracking-wide text-xl ">Yieldium</h5>
                </div>
                <div className='grid gap-2 text-center'>

                    <h1 className='text-2xl font-semibold'>Check Your Email ! 📧
                    </h1>
                    <p className='text-sm !text-white/50'>we have sent you an email with a Verification code !
                    </p>
                    <p className='text-sm !text-white/50'>{user?.email}
                    </p>
                </div>
                {children}
            </div>
        </div>
    )
}
