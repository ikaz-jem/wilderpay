"use client"
import BrandsSlider from "./components/BrandsSlider/BrandsSlider"



export default function Hero() {






    return (
        <div className="h-[100vh] relative snap-center  ">
            <span className="bg-accent rounded-full h-[600px] w-[600px] blur-[400px] absolute -top-80 left-[35%] z-[-1] opacity-60"></span>
            <span className="bg-primary rounded- w-[300px] h-[800px] fixed -top-10 left-40 blur-[300px]  -rotate-45 z-[-2]" />
            <div className="container  ">
                {/* <Navbar />
                <NavbaMobile /> */}
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