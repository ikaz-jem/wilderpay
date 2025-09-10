"use client"
import React, { useRef ,useEffect,useState} from 'react'
import { extend, useFrame } from '@react-three/fiber'
import { ScrollControls, Scroll, MeshTransmissionMaterial, Environment, useScroll, Text} from '@react-three/drei'
import * as THREE from 'three'
import { Image } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { lerp } from 'three/src/math/MathUtils'
const HomePage = React.lazy(()=>import('./Home/HomePage'))
extend({ MeshTransmissionMaterial })



function useResponsivePages(sectionHeight = 1, numberOfSections = 8) {
  const { height: viewportHeight } = useThree((state) => state.viewport)
  const [pages, setPages] = useState(numberOfSections)

  useEffect(() => {
    // Fallback if something breaks
    let effectiveSectionHeight = sectionHeight

    // Adjust for mobile layout (shorter sections)
    if (window.innerHeight < 768) {
      effectiveSectionHeight = sectionHeight * 1.45 // or tweak as needed
    }
    if (window.innerHeight > 768 &&window.innerHeight <= 844) {
      effectiveSectionHeight = sectionHeight * 1.187 // or tweak as needed
    }
    if (window.innerHeight > 844 &&window.innerHeight <= 896) {
      effectiveSectionHeight = sectionHeight * 1.122 // or tweak as needed
    }
    if (window.innerHeight > 896 &&window.innerHeight <= 915) {
      effectiveSectionHeight = sectionHeight * 1.103 // or tweak as needed
    }
    if (window.innerHeight > 915 &&window.innerHeight <= 932) {
      effectiveSectionHeight = sectionHeight * 1.07 // or tweak as needed
    }
    if (window.innerHeight > 932 &&window.innerHeight <= 1080) {
      effectiveSectionHeight = sectionHeight * 1 // or tweak as needed
    }


    const totalScrollDistance = numberOfSections * effectiveSectionHeight
    const calculatedPages = totalScrollDistance / viewportHeight

    setPages(calculatedPages)
  }, [viewportHeight, numberOfSections, sectionHeight])

  return pages
}





export default function Experience() {

    const { width, height } = useThree(state => state.viewport);
    const pages = useResponsivePages(20,8)

    const three = useThree()
    const camera = three?.camera

    const scaleElement = (baseWidth = 1980, baseHeight = 900) => {
        const scale = Math.min(width, height);
        return Number(scale)
    };

    const MyImage = (props) => {
        return <Image url="/assets/images/3.png" scale={scaleElement()}  position={[0, 0, -10]}   transparent opacity={1} />
    }

    const Knot = (props) => {
        const knotRef = useRef(null)
        const scroll = useScroll()
        useFrame((state) => {
            const t = scroll.offset;
            if (!knotRef.current) return;
            knotRef.current.rotation.x = lerp(knotRef.current.rotation.x, state.clock.elapsedTime, 0.1);
            knotRef.current.rotation.y = lerp(knotRef.current.rotation.y, state.clock.elapsedTime, 0.1);
            if (width < 25) return;
          
            if (t < 0.5&& width > 25) {
                knotRef.current.position.y = lerp(knotRef.current.position.y, t * 60, 0.1);
                knotRef.current.position.z = lerp(knotRef.current.position.z, t * 100, 0.5);
            }
            if (t < 0.8 &&  t > 0.5 && width > 25) {
                knotRef.current.position.z = -40
                knotRef.current.position.y = 0
            }
            if (t > 0.8) {
                knotRef.current.position.y = 2
                knotRef.current.position.z = 25
            }
            if (t < 0.3) {
                camera.position.z = lerp(camera.position.z, 10 + t * 10, 0.1);
            }
            if (t > 0.4) {
                camera.position.z = lerp(camera.position.z, t * 50, 0.5);
            }
            
        });


        return (
            <mesh receiveShadow  position={[0, 0, -2]} scale={scaleElement()*0.03} ref={knotRef}  >
                <torusKnotGeometry args={[3, 1, 150, 30]} />
                <MeshTransmissionMaterial backside backsideThickness={0.7} emissive={0.2} thickness={0.5} roughness={0.2} />
            </mesh>
        )
    }

    return (
        <>
            <Environment preset='city' />
            <ambientLight intensity={5} />
            <directionalLight position={[2, 2, 10]} intensity={5} />
            <ScrollControls  damping={0.1} pages={pages}>
                <Scroll html > 
                    <HomePage data={scroll} />
                </Scroll>
                <Knot />
                <Text scale={scaleElement()*0.3} position={[0, 0, -4]} >
                    Yieldium
                </Text>
                <MyImage />
            </ScrollControls>
        </>
    )
}
