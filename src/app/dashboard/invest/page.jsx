"use client"



import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react'

import BorderEffect from '../components/BorderEffect/BorderEffect';
import PackageViewer from './PackageViewer';


export default function page() {




    function Staking() {
        return (
            <div className="  w-full  pt-5 ">
                <div className="w-full flex items-center justify-center">
                    <TabGroup className='w-full max-w-lg'>
                        <TabPanels className="mt-3 w-full  ">
                            <TabPanel className="rounded-xl bg-card backdrop-blur-xl w-full  ">
                                <BorderEffect />

                                    <PackageViewer  />
                            </TabPanel>
                        </TabPanels>
                    </TabGroup>
                </div>
            </div>
        )
    }



    return (
        <>
            <div className='w-full mx-auto  '>
                <Staking />
            </div>

        </>
    )
}