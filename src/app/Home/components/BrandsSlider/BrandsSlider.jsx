// components/MarqueeSlider.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import './styles.css'

const logos = [
  "./assets/images/crypto/avalanch.svg",
  "./assets/images/crypto/bnb.svg",
  "./assets/images/crypto/usdc.svg",
  "./assets/images/crypto/arbitrum.svg",
  "./assets/images/crypto/solana.svg",
  "./assets/images/crypto/matic.svg",
  "./assets/images/crypto/xrp.svg",
  "./assets/images/crypto/usdt.svg",
  "./assets/images/crypto/op.svg",
  // Add more logos
];

export default function BrandsSlider() {
  return (
    <div className=" !m-0 p-0 !bg-transparent  h-max mask-x-from-50% mask-x-to-100%  ">
      <Swiper
        modules={[Autoplay]}
        spaceBetween={0}
        loop={true}
        slidesPerView="auto"
        speed={4000}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        freeMode={true}
        grabCursor={false}
        allowTouchMove={false}
        className="w-full !bg-transparent p-0 m-0 h-max"
      
      >
        
        {logos.concat(logos).map((src, i) => (
          <SwiperSlide
            key={i}
            className="!w-auto px-6 flex items-center justify-center !bg-transparent  "
          >
            <img
              src={src}
              alt="logo"
              className="h-10 w-auto opacity-50  hover:opacity-100 transition !bg-transparent "
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
