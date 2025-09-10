

import dynamic from "next/dynamic";

const Scene = dynamic(() => import('./Scene'), {
  ssr: true,
});
export default function Home() {
  return (
    <>
    
      <div  style={{ width: '100vw', height: '100vh', margin: 0, padding: 0 }}>

        <Scene />
      </div>

    </>
  );
}
