
export default function VerificationFormWraper({ children, router }) {
    return (
        <div className='h-[100vh] w-[100vw] flex items-center justify-center  '>
            <div className='bg-[url(/assets/images/3.png)] bg-contain bg-no-repeat bg-center w-screen h-screen absolute top-0 z-[-1] grayscale-40 opacity-80 mask-b-from-0'>
                <span className="bg-pink-500 rounded-full h-[300px] w-[300px] blur-[250px] absolute top-0 left-0 z-0 "></span>
                <span className="bg-primary rounded-full h-[300px] w-[300px] blur-[250px] absolute bottom-0 right-0 z-0 "></span>
            </div>
            <div className='bg-black/5 backdrop-blur-xl p-10 pb-10 rounded-xl max-w-xl w-full space-y-10 border border-primary/10  shadow-xl shadow-black m-2 '>
                <div className="flex items-center gap-2 justify-center cursor-pointer " onClick={() => router.push('.')}>
                    <img src="/assets/images/logo.png" alt="" loading="lazy" className="rounded-full h-10 w-10" />
                    <h5 className="font-light  tracking-wide text-xl ">Yieldium</h5>
                </div>
                <div className='grid gap-2 text-center'>

                    <h1 className='text-2xl font-semibold'>Check Your Email ! 📧
                    </h1>
                    <p className='text-sm !text-white/50'>we have sent you an email with a Verification code !
                    </p>
                </div>
                {children}
            </div>
        </div>
    )
}
