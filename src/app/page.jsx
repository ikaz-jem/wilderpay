

// import dynamic from "next/dynamic";

// const Scene = dynamic(() => import('./Scene'), {
//   ssr: true,
// });
import HomePage from "./Home/HomePage";

export default function Home() {
  return (
    <>
    
      <div  className=" container" >

        {/* <Scene /> */}
        <HomePage/>
      </div>

    </>
  );
}
