
// app/referrals/page.tsx (or layout.tsx if it applies to all subpages)

export const metadata = {
  title: "WilderPay Contest",
  description: "Win A Mercedes GLE 350 Coupe !",
  openGraph: {
    title: "Wilderpay Contest ",
    description: "Win A Mercedes GLE 350 Coupe !",
    images: [
      {
        url: "https://wilderpay.com/assets/images/car.wepb", // must be absolute URL
        width: 1200,
        height: 630,
        alt: "Referral Program Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wilderpay Contest",
    description: "Win A Mercedes GLE 350 Coupe !",
    images: ["https://wilderpay.com/assets/images/car.webp"],
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



