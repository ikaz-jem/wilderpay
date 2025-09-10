import dbConnect from "@/app/lib/db"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { getServerSession } from "next-auth"
import StakingPreview from "./StakingPreview"
import { headers } from "next/headers"
import UserSchema from "@/app/models/userSchema/UserSchema"

async function getContracts() {
    "use server"
      const request = await headers();
   
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) return { success: false, message: 'Access denied !' }

    await dbConnect()
    const Staking = (await import('@/app/models/stacking/stakingSchema')).default

    const contracts = await Staking.find({ user: session.user.id }, {}).sort({ updatedAt: -1 });
    const EarningSchema = (await import('@/app/models/EarningSchema/EarningSchema')).default


    const user = await UserSchema.findById(session?.user?.id)
    const role =  JSON.parse(JSON.stringify(user))

    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    // Get the one record created today
    const today = await EarningSchema.findOne({
        createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    const startOfYesterday = new Date();
    startOfYesterday.setDate(startOfYesterday.getDate() - 1);
    startOfYesterday.setHours(0, 0, 0, 0);

    // Yesterday's end
    const endOfYesterday = new Date();
    endOfYesterday.setDate(endOfYesterday.getDate() - 1);
    endOfYesterday.setHours(23, 59, 59, 999);

    // Find the one record created yesterday
    const yesterday = await EarningSchema.findOne({
        createdAt: { $gte: startOfYesterday, $lte: endOfYesterday },
    });



  const percentages =  {
      yesterday: JSON.parse(JSON.stringify(yesterday)),
      today: JSON.parse(JSON.stringify(today)),
  }

    if (!contracts) {
        return { success: false, message: 'No available Investments' }
    }
    let data = await JSON.parse(JSON.stringify(contracts))
    return { succes: true, contracts: data, percentage: percentages , role: role?.role }


}



export default async function page() {
    const { contracts, percentage ,role } = await getContracts()
    // if (contracts?.length == 0) {
    //     return (
    //         <div className="w-full h-full">
    //             <h1 className="text-3xl ">Nothing To show</h1>
    //         </div>
    //     )
    // }

    return (

        <StakingPreview contracts={contracts} percentage={percentage} role={role}/>
    )
}
