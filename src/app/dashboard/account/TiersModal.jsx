import { Button, Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState } from 'react'
import BorderEffect from '../components/BorderEffect/BorderEffect'
import ButtonPrimary from '@/app/components/ButtonPrimary'
import { formatCustomPrice } from '@/app/utils/formatPrice'

export default function TiersModal({ title = "", text }) {
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
            className="rounded-md bg-black/20 px-4 py-2 text-sm font-medium text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-black/30"
          >
            Open dialog
          </Button>

      }



      <Dialog open={isOpen} as="div" className="relative z-50 focus:outline-none" onClose={close}>
        <div className="fixed inset-0 z-50 w-screen overflow-y-auto ">
          <div className="flex min-h-full items-center justify-center p-4 backdrop-blur-md ">
            <DialogPanel
              transition
              className="w-full max-w-4xl rounded border border-primary/10 bg-card p-6 backdrop-blur-4xl duration-300 ease-out data-closed:transform-[scale(95%)] data-closed:opacity-0 relative"
            >
              <BorderEffect />
              <DialogTitle as="h3" className="text-base/7 font-medium text-white">
                {title}
              </DialogTitle>
              <div className='flex flex-col gap-2'>

                <p className="text-sm  text-center !text-primary">Referral Commissions</p>
                <TiersTable />
                <p className=" text-xs !text-neutral capitalize">Referral Comissions Paid  instantly , Bonuses are claimable and withdrawable upon unlocking new Rank </p>

                <p className="text-sm  text-center !text-primary">Daily Rebates</p>
                <RebateTiers />
                <p className=" text-xs !text-neutral">Rebates Paid And credited  Daily </p>
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






const tiers = [
  {  name: "Volume", levels:["5K","50K","100K","500K","1M"] },
  {  name: "Unranked", levels:[2, 0.25, 0.15, 0.05, 0.01] },
  {  name: "Vanguard", levels:[3, 0.35, 0.2, 0.1, 0.05] },
  {  name: "Pioneer", levels:[5, 0.5, 0.35, 0.15, 0.1] },
  {  name: "Master", levels:[7, 0.75, 0.5, 0.2, 0.15] },
  {  name: "Titan", levels:[9, 1, 0.75, 0.35, 0.2] },
  {  name: "Legend", levels:[12, 1.5, 1, 0.5, 0.25] },

];

function TiersTable() {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/10  shadow-sm">
      <table className="w-full divide-y divide-primary/10">
        <thead className="bg-primary/10">
          <tr>

            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Tier
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Unranked
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Vanguard
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Pioneer
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Master
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Titan
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          
          <tr className="">
            <td className="text-xs px-2 py-2  !text-neutral">Bonus  </td>
            <td className="px-2 py-2">
              <div className="flex items-center gap-3">
                <span className="text-xs !text-neutral">
                  50 USDT
                </span>

              </div>
            </td>
            <td className="px-2 py-2">
              <div className="flex items-center gap-3">
                <span className="text-xs !text-neutral">
                  500 USDT
                </span>

              </div>
            </td>
            <td className="px-2 py-2">
              <div className="flex items-center gap-3">
                <span className="text-xs !text-neutral">
                  1000 USDT
                </span>

              </div>
            </td>
            <td className="px-2 py-2">
              <div className="flex items-center gap-3">
                <span className="text-xs !text-neutral">
                  5000 USDT
                </span>

              </div>
            </td>
            <td className="px-2 py-2">
              <div className="flex items-center gap-3">
                <span className="text-xs !text-neutral">
                  10,000 USDT
                </span>

              </div>
            </td>
          </tr>
          {tiers.map((tier) => (
            <tr key={tier.name} className="">
              <td className="text-xs px-2 py-2  !text-neutral">{tier.name}  </td>
              
                {
                  tier?.levels?.map((level,idx)=><td className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs !text-neutral">
                    {level} {typeof level == "number" && "%"}
                  </span>

                </div>
              </td>)
                }

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


const rebatesTiers = [
  { name: "Direct", percent: 3 },
  { name: "Level 2", percent: 2 },
  { name: "level 3", percent: 1.5 },
  { name: "level 4", percent: 1 },
  { name: "level 5", percent: 0.8 },
  { name: "level 6", percent: 0.6 },
  { name: "level 7", percent: 0.4 },
  { name: "level 8", percent: 0.3 },
  { name: "level 9", percent: 0.2 },
  { name: "level 10", percent: 0.2 },
];

function RebateTiers() {
  return (
    <div className="overflow-hidden rounded-xl border border-primary/10 shadow-sm">
      <table className="w-full divide-y divide-primary/10">
        <thead className="bg-primary/10">
          <tr>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Tier
            </th>
            <th
              scope="col"
              className="px-2 py-2 text-left text-xs  uppercase  !text-neutral"
            >
              Percentage
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-primary/10">
          {rebatesTiers.map((tier) => (
            <tr key={tier.name} className="">
              <td className="text-xs px-2 py-2 !text-neutral">{tier.name}</td>
              <td className="px-2 py-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs !text-neutral">
                    {tier.percent}%
                  </span>

                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
