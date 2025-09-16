import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react'
import { AnimatePresence, easeOut, motion } from 'framer-motion'
import { Fragment } from 'react'
import { FaChevronDown } from "react-icons/fa6";
export default function FeaturesAccordion() {

  const data = [
    {
      title: ' Can I withdraw at any time?',
      desc: 'You can withdraw weekly on Fridays. However, first-time deposits have a 7-day lock-in to maintain system stability.'
    },
    {
      title: 'Is there a risk involved?',
      desc: 'Yes. While our AI reduces risk significantly, crypto and trading always carry inherent risks. Only invest what you can afford to commit long-term.'
    },
    {
      title: 'How is AI used?',
      desc: 'Our AI engine uses real-time data, sentiment analysis, and trading strategies to execute trades automatically.'
    },
    {
      title: 'Is Yieldium audited?',
      desc: 'A smart contract audit is scheduled for Q3 2025. In the meantime, the platform uses internal and external security best practices.'
    },

  ]




  return (
    <>
      <div className="h-full w-full  ">
        <div className="mx-auto w-full space-y-2">
          {
            data?.map((faq, idx) => <div key={idx} className='border-white/10 p-[1px]  rounded-lg'>
              <Disclosure as="div" className="p-5 bg-white/5 backdrop-blur bg-clip-border rounded-lg" defaultOpen={idx==0 ?true:false}>
                {({ open }) => (
                  <>
                    <DisclosureButton className="group flex w-full items-center justify-between rounded-lg">
                      <span className=" font-medium text-white group-data-hover:text-white/80">
                        {faq?.title}
                      </span>
                      <div className='border border-primary/50 p-2 rounded'>

                      <FaChevronDown className="size-5 fill-primary/60 group-data-hover:fill-accent/50 group-data-open:rotate-180" />
                      </div>
                    </DisclosureButton>
                    <div className="overflow-hidden ">
                      <AnimatePresence>
                        {open && (
                          <DisclosurePanel static as={Fragment}>
                            <motion.div
                              initial={{ opacity: 0, y: -24 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -24 }}
                              transition={{ duration: 0.2, ease: easeOut }}
                              className="origin-top mt-2 text-sm/5 text-white/50 max-w-sm"
                            >
                              {faq?.desc}
                            </motion.div>
                          </DisclosurePanel>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                )}
              </Disclosure>
            </div>)
          }
        </div>
      </div>
    </>
  )

}