import React from 'react'
import { Suspense } from 'react'
const Verification = React.lazy(()=>import('./Verification'))



export default function ValidateEmail() {
  return (
    <Suspense>
    <Verification/>
    </Suspense>
  )
}
