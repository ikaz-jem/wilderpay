import { Suspense } from "react";
import SectionBento from "./components/SectionBento";
import Footer from "./Footer";
import Hero from "./Hero";
import SectionFaq from "./SectionFaq";
import { lazy } from "react";
import Featuresslider from "./components/Featuresslider/Featuresslider";


const SectionFeatures = lazy(() => import('./SectionFeatures'))
const SectionHowItWorks = lazy(() => import('./SectionHowItWorks'))
const SectionCta = lazy(() => import('./SectionCta'))
const SectionFeatures2 = lazy(() => import('./SectionFeatures2'))
const SectionCalculator = lazy(() => import('./SectionCalculator'))


export default function HomePage() {


    return (
        <>
            <div className="!w-screen h-full  relative ">
                <Hero />
                <Suspense fallback='loading'>
                    <SectionFeatures />
                    <SectionFeatures2 />
                    <SectionBento />
                    <div className='md:h-[100vh] h-full '>
                        <Featuresslider />
                    </div>
                    <SectionHowItWorks />
                    <SectionCta />
                    {/* <SectionCalculator /> */}
                </Suspense>
                <Footer />
                {/* <SectionFaq /> */}
            </div>
        </>
    )
}