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
import DashboardInvestments from '../DashboardInvestments/DashboardInvestments';

export default function ContractsSlider({ data }) {

  return (
    <>

      <Swiper slidesPerView={'auto'}
       
        spaceBetween={30} pagination={true} modules={[Pagination]} className=" flex gap-5 !z-0 max-w-xl h-20">
        <SwiperSlide className='!h-max'>
    
            <DashboardInvestments data={data} />
          
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

