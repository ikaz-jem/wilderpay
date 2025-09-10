import React from 'react'
import { Suspense } from 'react'

const ForgotPassword = React.lazy(() => import('./ForgotPassword'))


export default function ResetPassword() {
  return (
    <Suspense fallback='loading ...' >
      <ForgotPassword />
    </Suspense >
  )
}
