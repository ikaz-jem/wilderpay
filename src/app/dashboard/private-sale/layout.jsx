
// app/referrals/page.tsx (or layout.tsx if it applies to all subpages)

export const metadata = {
  title: "WilderPay Private Sale",
  description: "Build a better financial future",
  openGraph: {
    title: "WilderPay Private Sale ",
    description: "Build a better financial future",
    images: [
      {
        url: "https://wilderpay.com/assets/images/referral-banner.png", // must be absolute URL
        width: 1200,
        height: 630,
        alt: "Referral Program Banner",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WilderPay Private Sale",
    description: "Build a better financial future",
    images: ["https://wilderpay.com/assets/images/referral-banner.png"],
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



