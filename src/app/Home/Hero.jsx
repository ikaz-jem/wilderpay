"use client"
import BrandsSlider from "./components/BrandsSlider/BrandsSlider"
import Navbar from "./components/Navbar/Navbar"


export default function Hero() {






    return (
        <div className=" relative snap-center  ">
            <span className="bg-accent rounded-full md:h-[600px] md:w-[600px] h-[400px] w-[400px] blur-[400px] absolute md:-top-80 top-0 md:left-[35%] left-0 z-[-1] opacity-60"></span>
            <span className="bg-highlight rounded- md:w-[300px] md:h-[800px] :w-[300px] :h-[400px] fixed md:-top-10 top-0 md:left-40 left-0 blur-[300px]  -rotate-45 z-[-5] opacity-60" />
            <div className="container mx-auto ">
                <Navbar />
                        <img src="/assets/images/3.png" alt="" className="w-80 h-80" />
            </div>
            <div className="absolute bottom-0 w-full ">
                <div className="container mx-auto pb-20  ">
                    <div className="w-full h-20 bg-forground">
                        <BrandsSlider />
                    </div>
                </div>
            </div>
        </div>

    )
}