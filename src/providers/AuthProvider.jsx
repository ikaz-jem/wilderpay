
"use client"
import React from 'react'
import { SessionProvider } from 'next-auth/react'
import { Session } from "next-auth";


export default function AuthProvider({ children }) {
  return (
    <SessionProvider session={Session}>{children}</SessionProvider>
  )
}
