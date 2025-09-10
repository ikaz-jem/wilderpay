"use client"
import React, { useRef, useState } from 'react';
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';
import BalanceChart from '../charts/BalanceChart';
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

import './styles.css';

// import required modules
import { Pagination } from 'swiper/modules';
import ActivityChart from '../charts/ActivityChart.';
import AssetDistributionChart from '../charts/AssetsDistribution';
import DepositHistoryChart from '../charts/DepositHistoryChart';

export default function App({ data }) {

  return (
    <>

      <Swiper slidesPerView={'auto'}
        centeredSlides={true}
        spaceBetween={30} pagination={true} modules={[Pagination]} className=" flex gap-5 !z-0 max-w-xl">
        <SwiperSlide>
          <div className='flex flex-col gap-3 w-full'>
            <div className="flex items-center justify-between">
              <h1 className="!text-neutral !text-sm" >Balance Allocation</h1>
              <p className="text-xs !text-primary cursor-pointer">Deposit</p>
            </div>
            <AssetDistributionChart user={data} />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <DepositHistoryChart user={data} />
        </SwiperSlide>
        <SwiperSlide>
          <BalanceChart />
        </SwiperSlide>
        <SwiperSlide>
          <ActivityChart />
        </SwiperSlide>


      </Swiper>
    </>
  );
}

