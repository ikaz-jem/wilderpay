import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import UserSchema from "@/app/models/userSchema/UserSchema";
import { getServerSession } from "next-auth";

import { IoArrowForward } from "react-icons/io5";
import { appBaseRoutes } from "@/routes"
import Link from "next/link"
import { formatPrice } from "@/app/utils/formatPrice"
import { BsFillPeopleFill } from "react-icons/bs";
import { FaChartArea } from "react-icons/fa";
import { GrTransaction } from "react-icons/gr";
import BorderEffect from "../components/BorderEffect/BorderEffect";

import { unstable_cache } from "next/cache";
import { headers } from 'next/headers';
import dbConnect from "@/app/lib/db";
import { ClipLoader } from "react-spinners";
// app/referrals/page.tsx (or layout.tsx if it applies to all subpages)

export const metadata = {
  title: "WilderPay Private Sale",
  description: "Build a better financial future",
  openGraph: {
    title: "Referrals",
    description: "Build a better financial future",
    images: [
      {
        url: "https://yourdomain.com/images/referral-banner.png", // must be absolute URL
        width: 1200,
        height: 630,
        alt: "Referral Program Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Referrals",
    description: "Build a better financial future",
    images: ["https://yourdomain.com/images/referral-banner.png"],
  },
};





export default async function TransferLayout({ children }) {



  return (
    <>
      <div className="grid w-full space-y-5 ">




        {children}
      </div>
    </>
  )


}



