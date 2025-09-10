
import { GiHamburgerMenu } from "react-icons/gi";
import { IoCloseSharp } from "react-icons/io5";
import ButtonPrimary from "@/app/components/ButtonPrimary";
import { useRouter } from 'next/navigation'


import { useState } from 'react'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, TransitionChild, DisclosureButton } from '@headlessui/react'
let navigation = [

  {
    title: 'How it Works',
    href: 'https://yieldium.gitbook.io/yieldium/',
  },
]

function NavbaMobile() {
const Router = useRouter()
const login = ()=>Router.push('/login')

  const [open, setOpen] = useState(false)
  return (
    <>
      <GiHamburgerMenu className="text-4xl text-white hover:text-primary transition-all cursor-pointer md:hidden flex " onClick={() => setOpen(true)} />
      <Dialog open={open} onClose={setOpen} className="relative z-10">

        <DialogBackdrop
          transition
          className="fixed inset-0  sepia-80 backdrop-blur transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <DialogPanel
                transition
                className="pointer-events-auto relative w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-scroll bg-background py-6 shadow-xl">

                  <TransitionChild>
                    <div className=" flex  duration-500 ease-in-out data-closed:opacity-0 sm:-ml-10 sm:pr-4 justify-end px-5">
                      <button
                        type="button"
                        onClick={() => setOpen(false)}
                        className="relative rounded-md text-gray-300 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden"
                      >
                        <span className="absolute -inset-2.5" />
                        <span className="sr-only">Close panel</span>
                        <IoCloseSharp aria-hidden="true" className="size-6" />
                      </button>
                    </div>
                  </TransitionChild>

                  <div className="px-4 sm:px-6">
                    <DialogTitle className="text-base font-semibold text-gray-900">

                      <div className="flex items-center gap-2 ">
                        <img src="/assets/images/logo.png" alt="" loading="lazy" className="rounded-full h-10 w-10" />
                      </div>

                    </DialogTitle>
                  </div>
                  <div className="w-full h-full p-5">
                    <ul className="grid gap-5 ">
                      {
                        navigation?.map((link, idx) => <li key={idx} className="cursor-pointer hover:text-primary bg-white/5 p-2 rounded"> <a href={link.href} target="_blank">{link?.title}</a> </li>)
                      }
                    </ul>

                  </div>

                  <div className="relative mt-6 flex-1 px-4 sm:px-6">{/* Your content */}</div>
                  <div className="flex justify-center p-5">
                    <ButtonPrimary onClick={login} className='w-full'>Get Started</ButtonPrimary>
                  </div>
                </div>
              </DialogPanel>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  )
}



export default function Navbar() {

  const Router = useRouter()
  const login = ()=>Router.push('/login')
  return (

    <div className="  absolute top-0  w-[calc(100vw-15px)] backdrop-blur-lg  ">

      <div className="  container mx-auto  ">
        <div className="  flex w-full items-center justify-between  px-5 ">
          <div className="flex items-center gap-2 ">
            <img src="/assets/images/logo.webp" alt="" loading="lazy" className="rounded-full h-10 w-10" />
          </div>

          <ul className="md:flex hidden gap-5">
            {
                        navigation?.map((link, idx) => <li key={idx} className="cursor-pointer hover:text-primary  p-2 rounded"> <a href={link.href} target="_blank">{link?.title}</a> </li>)
            }
          </ul>

          <ButtonPrimary onClick={login} className="md:flex hidden items-center justify-center">Get Started</ButtonPrimary>
          <NavbaMobile />
        </div>
      </div>
    </div>
  )

}