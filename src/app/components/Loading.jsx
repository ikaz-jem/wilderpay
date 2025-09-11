

export default function Loading ({className}) {
    return (
        <div className={`h-80 w-full flex items-center justify-center ${className}`}>
                <div className='flex flex-col items-center justify-center gap-5'>
                                <img src="/assets/images/logo.webp" alt="" className='animate-spin duration-900 h-10 w-10' />
                           {/* <ClipLoader className='text-xs' color='var(--title)' size={25}/> */}
                        <p className='animate-pulse text-sm'>Loading ...</p>

                </div>
        </div>
    )
}