'use client'

import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { IoMdCopy } from "react-icons/io"
import { toast } from "sonner"
import { getReferrals } from "@/actions/getReferrals"
import { IoPersonAdd } from "react-icons/io5";
import BorderEffect from "../components/BorderEffect/BorderEffect"
import { formatCustomPrice, formatPrice } from "@/app/utils/formatPrice"
import { BsFillPeopleFill } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import axios from "axios"
import Loading from "@/app/components/Loading"
import { FaUserFriends } from "react-icons/fa";
import { MdMarkEmailRead } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { coinIcon } from "../staticData"
import {
  ClipLoader
} from 'react-spinners'
import { useRouter } from "next/navigation"






export default function AnalyticsPage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState(null)

  const router = useRouter()

  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [page, setPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(true);

  const limit = 10

  const user = session?.user
  const userId = session?.user?.id
  const referralLink = typeof window !== "undefined" && userId ? `${window.location.origin}/register?id=${user?.walletIndex}` : ""



  async function getData() {
    let data = await getReferrals(userId)
    setUserData(data)
  }


  async function getUsers() {
    if (!isAdmin) return
    const endpoint = `/api/users/leaders?page=${page}&limit=${limit}`
    let data = await axios.get(endpoint).then((res) => res.data)

    setUsers(data)
  }
  async function checkPermission() {
    const endpoint = `/api/users?id=${userId}`
    let data = await axios.get(endpoint).then((res) => {
      if (res.data.success) {
        return res.data.data.role == "admin"
      }
    })
    setIsAdmin(data)
    if (!data) {
      router.replace('/dashboard')
    }
    return data
  }

  

  async function getAnalytics() {
    if (!isAdmin) return
    const endpoint = `/api/analytics`
    let data = await axios.get(endpoint).then((res) => res.data)
    setAnalytics(data)
    setLoadingAnalytics(false)
  }

  useEffect(() => {
    if (userId) {
      getUsers()
    }
  }, [userId, page])

  useEffect(() => {
    if (userId) {
      checkPermission()
      getAnalytics()
    }
  }, [userId])


  useEffect(() => {
    if (userId) {
      getData()
    }
  }, [userId])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    toast.success("Referral link copied!")
  }


  const cardData = [
    {
      title: 'Total Users',
      value: formatCustomPrice(analytics?.totalUsers),
      icon: <BsFillPeopleFill className="text-neutral text-3xl" />,
      desc: 'All Platform Users '
    },
    {
      title: 'Total Stakings',
      value: formatCustomPrice(analytics?.totalStakings),
      icon: <FaChartArea className="text-neutral text-3xl" />,
      desc: 'Total valid Stakings '
    },
    {
      title: 'Total Transactions',
      value: formatCustomPrice(analytics?.txCount),
      icon: <GrTransaction className="text-neutral text-3xl" />,
      desc: 'Total Credited Transactions'
    },
  ]

  function getFixedPages(current, total, maxVisible = 3) {
    let start = Math.max(1, current - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }




  return (

    <div className="grid w-full space-y-5 ">

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5    w-full '>

        {
          cardData.map((card, idx) => <StatsCard key={idx} data={card} loadingAnalytics={loadingAnalytics} />)
        }




      </div>




      <div className="flex flex-col md:flex-row gap-5  ">
        <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded relative border border-primary/10">
          <BorderEffect />

          <div className="flex flex-col justify-center gap-1">
            <h1 className="text-lg tracking-wider uppercase">Leaders Onboard</h1>
          </div>


          {users?.users?.length > 0 ? (
            <div className="space-y-3">
              <p className="uppercase"> Leaders :  {users?.pagination?.total}</p>
              <div>
                <ul className="text-sm space-y-1">
                  {users?.users?.map((user, i) => (
                    <li key={i} className="bg-white/5 rounded p-5 text-xs ">
                      <div className="flex flex-col w-full">



                        <div className="flex items-center justify-between">

                          <p>
                            {user.email}
                          </p>

                          <div className="flex gap-1 items-center">

                            <div className="flex gap-1 items-center  p-2 ">
                              <FaUserFriends className="!text-green-500" />
                              <p>
                                {Object.values(user?.referralCounts)?.reduce((sum, count) => sum + count, 0)}
                              </p>
                            </div>
                            <div className="flex gap-1 items-center  p-2 ">
                              <FaUserFriends />
                              <p>
                                {user?.referredUsers?.length}
                              </p>
                            </div>

                            <div className="flex gap-1 items-center  p-2 ">
                              {
                                user?.emailVerified ?
                                  <MdMarkEmailRead className="text-green-500" />
                                  : <MdEmail className="text-orange-500" />
                              }
                            </div>
                            <p>
                              {user?.totalVolume} $
                            </p>

                          </div>

                        </div>

                        <div className="flex items-center gap-1 space-x-1 flex-wrap">
                          {Object.values(user?.referralCounts).map((val, idx) => <p  key={idx} className="text-xs flex items-center gap-1 bg-card rounded p-1">   <span className="!text-primary">Level {idx + 1} : </span> {val} <FaUserFriends /></p>)}
                        </div>

                      </div>

                    </li>
                  ))}
                </ul>
              </div>



              <div className="flex items-center gap-2 mt-4 flex-wrap">
                {/* Prev Button */}
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1 border border-primary/10 rounded disabled:opacity-50"
                >
                  Prev
                </button>

                {/* Page Numbers (always up to 6) */}
                {getFixedPages(page, users?.pagination?.totalPages || 1, 6).map((num) => (
                  <button
                    key={num}
                    onClick={() => setPage(num)}
                    className={`px-3 py-1 border border-primary/10 rounded ${page === num ? "bg-card-500 text-white" : ""
                      }`}
                  >
                    {num}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  disabled={page === users?.pagination?.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1 border border-primary/10 rounded disabled:opacity-50"
                >
                  Next
                </button>
              </div>


            </div>
          ) :

            <Loading />

          }
        </div>


        <div className="grid gap-5 w-full">


          <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded border border-primary/10">
            <BorderEffect />

            <div className="flex flex-col justify-center gap-1">
              <h1 className="text-lg tracking-wider uppercase">Currency Allocation</h1>
              <p className=" text-xs !text-neutral">Total Realtime Balances Held By Users By Currency </p>
            </div>


            {
              !loadingAnalytics ?


                <>
                  {analytics?.balances?.filter.length > 0 ? (
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm space-y-1 flex flex-wrap gap-1">
                          {analytics?.balances?.map((balance, i) => (
                            <div key={i} className="bg-white/5 rounded p-3  space-y-2 flex flex-col grow">
                              <div className="flex items-center gap-2 ">
                                <img src={coinIcon[balance?.currency]} className='text-neutral h-8 w-8' />
                                <div className="grid">
                                  <p className={`!text-xs truncate !text-green-500 uppercase '`}>  {formatCustomPrice(Number(balance.totalAmount))} {balance.currency}  </p>
                                  <p className={`!text-xs truncate flex items-center '`}> <FaUserFriends className="mr-2" /> {parseFloat(Number(balance.holdersCount.toFixed(4)))} </p>

                                </div>

                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                    :

                    (<div className="space-y-3">
                      <div>
                        <ul className="text-sm space-y-1">

                          <li className="bg-white/5 rounded p-5 w-full space-y-2">
                            <div className="flex items-center gap-2 ">
                              <p className={`truncate '`}>Nothing Yet !</p>
                            </div>
                          </li>

                        </ul>
                      </div>
                    </div>)

                  }

                </>
                :
                <Loading />


            }



          </div>







          <div className="p-5 mx-auto space-y-5 w-full backdrop-blur-xl bg-card rounded border border-primary/10">
            <BorderEffect />

            <div className="flex flex-col justify-center gap-1">
              <h1 className="text-lg tracking-wider  uppercase">Staking Analytics</h1>
              <p className=" text-xs !text-neutral">Profits Are credited Automatically to yieldium Wallet</p>
            </div>



            {!loadingAnalytics ?





              <>

                {analytics?.staking?.length > 0 ? (
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm space-y-1 flex  flex-wrap gap-1">
                        {analytics?.staking?.map((stake, i) => (
                          <div key={i} className="bg-white/5 rounded p-5 grow    space-y-2">
                            <div className="flex items-center gap-2 ">
                              <img src={coinIcon[stake?.currency]} className='text-neutral h-8 w-8' />
                              <div className="flex items-center justify-between w-full">
                                <p className={`!text-xs truncate !text-green-500 '`}> • {parseFloat(Number(stake.totalStaked.toFixed(4)))} {stake?.currency}</p>
                                <div className="flex items-center gap-1">
                                  <p className={`!text-xs truncate '`}>{stake?.holdersCount || ''}</p>
                                  <IoPersonAdd className='text-neutral' />
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className='!text-xs truncate uppercase'>Forcast 30 days : </p>
                              <p className='!text-xs truncate uppercase'>{formatCustomPrice(stake?.vaultForecast30Days)} {stake?.currency}</p>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className='!text-xs truncate uppercase'>Avg Daily pay : </p>
                              <p className='!text-xs truncate uppercase'>{formatCustomPrice(stake?.avgDailyPayment)} {stake?.currency}</p>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className='!text-xs truncate uppercase'>Avg lock : </p>
                              <p className='!text-xs truncate uppercase'>{formatCustomPrice(stake?.avgDuration)} {stake?.currency}</p>
                            </div>

                            <div className="flex justify-between items-center">
                              <p className='!text-xs truncate uppercase'>Avg claimed : </p>
                              <p className='!text-xs truncate uppercase'>{formatCustomPrice(stake?.avgClaimedProfitToDate)} {stake?.currency}</p>
                            </div>


                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )
                  :

                  (<div className="space-y-3">
                    <div>
                      <ul className="text-sm space-y-1">

                        <li className="bg-white/5 rounded p-5 w-full space-y-2">
                          <div className="flex items-center gap-2 ">
                            <p className={` truncate '`}>Nothing Yet !</p>
                          </div>
                        </li>

                      </ul>
                    </div>
                  </div>)

                }
              </>

              :
              <Loading />


            }
          </div>




        </div>
      </div>
    </div>
  )
}









function StatsCard({ data, loadingAnalytics }) {


  return (



    <div className='flex flex-col  w-full gap-5 border border-primary/10 p-5 bg-card rounded backdrop-blur-xl relative overflow-hidden '>
      <BorderEffect />


      {!loadingAnalytics ?
        <>
          <div className='flex  gap-5 items-center '>

            <div className='w-full flex justify-between'>
              <div className='flex flex-col gap-5 '>
                <h1 className="uppercase text-sm">{data.title}</h1>
                <p className='text-3xl tracking-wider font-light !text-primary'>{data.value}</p>
                {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
              </div>
              {data?.icon}
            </div>
          </div>

          <div className="flex justify-between ">
            <p className='text-xs'>{data.desc} </p>
          </div>
        </>
        :
        <div className="w-full h-20 flex items-center justify-center">

          <ClipLoader className='text-xs' color='var(--title)' size={25} />
        </div>


      }




    </div>

  )

}


// function StatsCard({data}) {


//   return (



//     <div className='flex flex-col max-w-md w-full gap-2 border border-primary/10 p-5 bg-card rounded backdrop-blur-xl relative overflow-hidden '>
//       <BorderEffect />

//       <div className='flex  gap-5 items-center '>

//         <img src={""} alt="" className='w-8 h-8' />
//         <div className='w-full flex justify-between'>
//           <div className='flex flex-col '>
//             <h1 className="uppercase">{data.title}</h1>
//             <p className='text-xs'>xxxxx   <span className="uppercase">xxx </span> </p>
//             {/* <p className='text-xs'>{balance?.prices[balance?.currency]}$</p> */}
//           </div>
//           <p className='text-sm !text-green-500'>xxxxxx <span className="uppercase">xxxxxxx </span></p>
//         </div>
//       </div>

//       <div className="flex justify-between ">
//         <p className='text-sm'>zzz </p>
//       </div>


//       <div className="flex justify-between ">

//         <p className='text-sm'>zzz </p>
//         <div className="flex items-center gap-2">
//           <p className='text-sm'>zzzz days </p>



//         </div>
//       </div>


//       <div className="flex gap-2">
//         {/* {disabled && <ForceUnlockModal contract={contract} />} */}
//       </div>

//     </div>

//   )

// }