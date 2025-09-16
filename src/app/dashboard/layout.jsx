
import DashboardNavMobile from './components/DashboardNavMobile/DashboardNavMobile';
import DashboardHeaderMobile from './components/DashboardHeaderMobile/DashboardHeaderMobile';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import AnnouncementBanner from './components/AnnouncementBanner/AnnouncementBanner';
// import DashboardNav from './components/DahsboardNav/DashboardNav';


export default async function DashboardLayout({ children }) {

    const session = await getServerSession(authOptions)

    // const cookieStore =await cookies();
    //   const token =  cookieStore.get('path')
    return (
        <div  className=' h-full overflow-hidden   flex justify-between items-center flex-col transition-all' >
            <div className=' bg-gradient-to-b from-primary/20 to-transparent from-1% to-25%  h-screen w-full z-[-1] absolute top-0 left-0 mask-radial-at-top mask-radial-from-50%'></div>
            <div className=' bg-gradient-to-t from-accent/15 to-transparent from-1% to-25%  h-full w-full z-[-1] fixed bottom-0 left-0 mask-radial-at-bottom mask-radial-from-50%'></div>
            <div className='bg-[url(/assets/images/bg.png)] bg-contain bg-no-repeat bg-center w-full h-full absolute top-0 z-[-1] grayscale-40 opacity-80 mix-blend-color-overlay mask-radial-to-70% duration-[ 20s]'>
            </div>
            <div className=' space-y-5 container p-5 pb-20 '>
                {/* <DashboardNav session={session} /> */}
                <AnnouncementBanner/>
                <DashboardHeaderMobile session={session} />
                {children}
            </div>
            {/* <DashboardNavMobile /> */}
        </div>
    )
}
