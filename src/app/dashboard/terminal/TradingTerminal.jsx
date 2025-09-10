'use client'

import { useEffect, useRef, useState } from 'react'

import { Geist, Geist_Mono, Inter, Poppins, Mona_Sans, JetBrains_Mono } from "next/font/google";

const inter = JetBrains_Mono({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"]
});


let socket = null

export default function TradingTerminal() {
  const [logs, setLogs] = useState([])
  const terminalRef = useRef(null)

  useEffect(() => {
    if (socket?.readyState !== "open") {
      socket = new WebSocket(
        'wss://stream.binance.com:9443/stream?streams=btcusdt@trade/ethusdt@trade/solusdt@trade'
      )

    }
    console.log(socket?.readyState)


    socket.onopen = () => {
      setLogs((prev) => [...prev, '✅ Connected to Yieldium Bot Events...'])
    }

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data)

      if (message?.data) {
        const { s: symbol, p: price, T: time, e: type, m: marketMaker, q: quantity } = message.data

        if (marketMaker) return

        if (Number(quantity) < 2 && Number(quantity) > 0.5 && symbol !== "BTCUSDT" && symbol !== "ETHUSDT") {
          const date = new Date(time).toLocaleTimeString()
          const log = `[${date}] ${symbol}: $${parseFloat(price).toFixed(2)} BUY ${parseFloat(quantity).toFixed(2)}`
          setLogs((prev) => [...prev.slice(-50), log]) // keep last 50 logs
          return
        }
        if (Number(quantity) >2 && Number(quantity) < 5 && symbol !== "BTCUSDT" && symbol !== "ETHUSDT"){
          const date = new Date(time).toLocaleTimeString()
          const log = `[${date}] ${symbol}: $${parseFloat(price).toFixed(2)} SELL ${parseFloat(quantity).toFixed(2)}`
          setLogs((prev) => [...prev.slice(-50), log]) // keep last 50 logs
          return
        }
        if (Number(quantity) < 0.1 && Number(quantity) >0.05 && (symbol == "BTCUSDT" || symbol == "ETHUSDT")) {
          const date = new Date(time).toLocaleTimeString()
          const log = `[${date}] ${symbol}: $${parseFloat(price).toFixed(2)} BUY ${parseFloat(quantity).toFixed(2)}`
          setLogs((prev) => [...prev.slice(-50), log]) // keep last 50 logs
          return
        }
        if (Number(quantity) >0.05 && Number(quantity) < 0.1 && (symbol !== "BTCUSDT" || symbol !== "ETHUSDT")){
          const date = new Date(time).toLocaleTimeString()
          const log = `[${date}] ${symbol}: $${parseFloat(price).toFixed(2)} SELL ${parseFloat(quantity).toFixed(2)}`
          setLogs((prev) => [...prev.slice(-50), log]) // keep last 50 logs
          return
        }
        const date = new Date(time).toLocaleTimeString()
        const log = `[${date}] ${symbol}: $${parseFloat(price).toFixed(2)} Scanning ...`
        setLogs((prev) => [...prev.slice(-50), log]) // keep last 50 logs
      }
    }

    socket.onerror = () => {
      setLogs((prev) => [...prev, '❌ Disconnected error occurred'])
    }

    socket.onclose = () => {
      setLogs((prev) => [...prev, '🔌 Disconnected from Yieldium Server '])
    }

    return () => {
      socket.close()
    }
  }, [])

  // Auto-scroll to bottom
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [logs])

  return (
    <div className="w-full rounded-xl overflow-hidden h-80 bg-black border border-neutral-800">
      {/* Header */}
      <div className="w-full bg-neutral-800 p-3 flex items-center justify-center relative">
        <div className="flex items-center gap-2 absolute top-3 left-3">
          <span className="w-3 h-3 rounded-full bg-gradient-to-t from-red-400 to-red-600"></span>
          <span className="w-3 h-3 rounded-full bg-gradient-to-t from-yellow-400 to-yellow-600"></span>
          <span className="w-3 h-3 rounded-full bg-gradient-to-t from-green-400 to-green-600"></span>
        </div>
        <p className={`text-xs font-mono ${inter.className || ''}`}>Terminal.exe</p>
      </div>

      {/* Terminal body */}
      <div
        ref={terminalRef}
        className="w-full h-full p-5 overflow-y-auto text-green-400 text-xs font-mono space-y-1"
      >
        {logs.length === 0 ? <p>Connecting...</p> : logs.map((log, idx) => <p key={idx} className={`${inter?.className} ${log.includes('BUY') && "!text-green-500" } ${log.includes('SELL') && "!text-red-500" }   ` }>{log}</p>)}
      </div>
    </div>
  )
}
