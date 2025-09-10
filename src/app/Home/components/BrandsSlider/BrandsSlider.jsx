// components/MarqueeSlider.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import './styles.css'

const logos = [
  "./assets/images/brands/paypal.svg",
  "./assets/images/brands/btc.svg",
  "./assets/images/brands/stripe.svg",
  "./assets/images/brands/bank.svg",
  "./assets/images/brands/usdt.svg",
  "./assets/images/brands/solana.svg",
  "./assets/images/brands/bnb.svg",
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
              className="h-10 w-auto opacity-30 invert hover:opacity-100 transition !bg-transparent"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
