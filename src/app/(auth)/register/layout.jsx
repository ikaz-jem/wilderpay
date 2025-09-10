import CaptchaProvider from '@/providers/CaptchProvider'
import React from 'react'

export default function layout({children}) {
  return (
    <CaptchaProvider>{children}</CaptchaProvider>
  )
}
