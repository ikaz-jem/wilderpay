"use client"

import { useState, useEffect, Suspense, lazy } from 'react'
import { Canvas } from '@react-three/fiber'
import { useProgress } from '@react-three/drei'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from './Home/components/Navbar/Navbar'
import Loading from './components/Loading'
import SectionBento from './Home/components/SectionBento'

// Lazy-load Experience component
const Experience = lazy(() => import('./Experience'))

// Inline Loader component


export default function Scene() {
  const [showLoader, setShowLoader] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setShowLoader(false), 2000)
    return () => clearTimeout(timer)
  }, [])




  return (
    <>
      {/* Fullscreen overlay loader (before clipPath animation) */}
      <AnimatePresence >
        {showLoader && (
          <motion.div
            className='flex flex-col items-center justify-center fixed inset-0 z-50 bg-black text-white text-2xl'
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >

            <Loading className={'!h-max'} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reveal animation with framer-motion */}
      <motion.div
        initial={{ clipPath: 'circle(0% at 50% 50%)' }}
        animate={{ clipPath: 'circle(150% at 50% 50%)' }}
        transition={{ duration: 4, delay: 2, ease: 'easeInOut' }}
        className="absolute inset-0 z-10 bg-transparent"
      >
        <Canvas
          dpr={0.8}
          gl={{ powerPreference: 'high-performance', antialias: false, stencil: false }}
          shadows
          camera={{ position: [0, 0, 10], zoom: 1, fov: 90 }}

        >
          <Suspense fallback={''}>
            <Experience />
          </Suspense>
        </Canvas>

        <Navbar />
      </motion.div>
    </>
  )
}

