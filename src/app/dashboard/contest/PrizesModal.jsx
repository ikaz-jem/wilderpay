import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import BorderEffect from '../components/BorderEffect/BorderEffect'
import ButtonPrimary from '@/app/components/ButtonPrimary'
import { formatCustomPrice } from '@/app/utils/formatPrice'

export default function PrizesModal({ title = "", text }) {
  let [isOpen, setIsOpen] = useState(false)

  function open() {
    setIsOpen(true)
  }

  function close() {
    setIsOpen(false)
  }


  return (
    <>
      {
        text ? <p className=" text-xs !text-primary cursor-pointer hover:!underline hover:!text-accent" onClick={open} >{text}</p>

          :
          <Button
            onClick={open}
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
          >
            Prizes
          </Button>

      }



      <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 backdrop-blur-md ">
            <DialogPanel
              transition
              className="w-full max-w-4xl rounded border border-primary/10 bg-black p-6 backdrop-blur-4xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 relative"
            >
              <BorderEffect />
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                {title}
              </DialogTitle>
              <div className='flex flex-col gap-2'>

                {/* <TiersTable /> */}

                <p className="text-sm  text-center !text-primary">Prizes By Rank</p>
                <RebateTiers />
                <p className=" text-xs !text-neutral">Shipped To your House !</p>
              </div>
              <div className="mt-4">
                <ButtonPrimary
                  className="inline-flex items-center gap-2 rounded-md bg-gray-700 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-600 data-open:bg-gray-700"
                  onClick={close}
                >
                  Close
                </ButtonPrimary>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  )
}








  const prizes = [
    {
      rank: 1,
      prize: "IPHONE 17 PRO MAX",
      package: "1000 USDT"
    },
    {
      rank: 2,
      prize: "IPHONE 17 PRO MAX",
      package: "500 USDT"
    },
    {
      rank: 3,
      prize: "IPHONE 17 PRO MAX",
      package: "250 USDT"
    },
    {
      rank: 4,
      prize: "IPHONE 17",
      package: "100 USDT"
    },
    {
      rank: 5,
      prize: "IPHONE 17",
      package: "100 USDT"
    },
    {
      rank: 6,
      prize: "-",
      package: "1500 USDT"
    },
    {
      rank: 7,
      prize: "-",
      package: "1000 USDT"
    },
    {
      rank: 8,
      prize: "-",
      package: "500 USDT"
    },
    {
      rank: 9,
      prize: "-",
      package: "500 USDT"
    },
    {
      rank: 10,
      prize: "-",
      package: "500 USDT"
    },

    
  ]


function RebateTiers() {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/10 shadow-sm space-y-5">

<div className='flex items-center justify-evenly gap-5 p-5 bg-gradient-to-bl from-neutral to-neutral-200 rounded-lg'>

    <p className='text-2xl font-semibold capitalize !text-black'>100K Score</p>

            <img src="/assets/images/car.webp" className='w-80' alt="" />
    <p className='text-2xl font-semibold capitalize !text-black'>1 Winner</p>
</div>


      <table className="w-full divide-y divide-primary/10">
        <thead className="bg-primary/10">
          <tr>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Rank
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Prize
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Investment Package
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {prizes.map((prize) => (
            <tr key={prize.rank} className="">
              <td className="text-sm px-2 py-2 !text-neutral">{prize.rank}</td>
              <td className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm !text-neutral">
                    {prize.prize}
                  </span>

                </div>
              </td>
              <td className="text-sm px-2 py-2 !text-neutral">{prize.package}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
