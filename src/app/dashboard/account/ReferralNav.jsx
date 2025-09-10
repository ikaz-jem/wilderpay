'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appBaseRoutes } from '@/routes';

export default function ReferralNav() {
  const pathname = usePathname();

  const isActive = (href) => pathname === href;

  const linkClass = (href) =>
    `px-4 py-2 rounded-md text-neutral text-xs uppercase mask-b-from-50%  ${
      isActive(href) ? 'bg-accent/40 text-white ' : ' bg-card  hover:text-accent underline'
    }`;

  return (
    <div className="flex gap-3 items-center w-full">
      <Link className={linkClass(appBaseRoutes.referrals)} href={appBaseRoutes.referrals}>
        Summary
      </Link>
      <Link
        className={linkClass(`${appBaseRoutes.referrals}/referrals`)}
        href={`${appBaseRoutes.referrals}/referrals`}
      >
        Referrals
      </Link>
      <Link
        className={linkClass(`${appBaseRoutes.referrals}/transactions`)}
        href={`${appBaseRoutes.referrals}/transactions`}
      >
        Transactions
      </Link>
      {/* <Link
        className={linkClass(`${appBaseRoutes.referrals}/rebates`)}
        href={`${appBaseRoutes.referrals}/rebates`}
      >
        Rebates
      </Link> */}
    </div>
  );
}
