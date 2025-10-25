import { createAppKit } from '@reown/appkit/react'

import { WagmiProvider } from 'wagmi'
import {
  mainnet,
  arbitrum,
  sepolia,
  solana,
  solanaTestnet,
  solanaDevnet,
  bsc,
  polygon,
  optimism, 
  avalanche ,
  bscTestnet
} from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { SolanaAdapter } from '@reown/appkit-adapter-solana'
import { cookieStorage, createStorage, createConfig, http } from '@wagmi/core'





// 0. Setup queryClient
const queryClient = new QueryClient()

// 1. Get projectId from https://dashboard.reown.com
const projectId = '208a29f428575f3b4c759867e1b59b18'

// 2. Create a metadata object - optional
const metadata = {
  name: 'WilderPay',
  description: 'Yield , Grow !',
  url: 'https://wilderpay.com', // Use dynamic URL to avoid mismatch
  icons: ['/assets/images/logo.webp']
}

// 3. Set the networks
const networks = [mainnet, arbitrum, sepolia, solana, bsc ,polygon,optimism, avalanche,bscTestnet]

// 4. Create Wagmi Adapter
const solanaWeb3JsAdapter = new SolanaAdapter()

const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  networks,
  projectId,
  ssr: false
})



// 5. Create modal
createAppKit({

  themeMode: "dark",
  adapters: [wagmiAdapter, solanaWeb3JsAdapter],
  networks,
  projectId,
  metadata,
  features: {
    email: false,
    socials: false,
    swaps: false,
    onramp: true,
    analytics: false,
  },
   themeVariables: {
    "--w3m-color-mix": "#0000",
    "--w3m-color-mix-strength": 40,
    "--w3m-font-family": 'var(--font-poppins)',
    "--w3m-accent": 'var(--color-primary)',
    "--w3m-font-size-master": "10px",
    "--w3m-border-radius-master": "3px",
    "--w3m-z-index": 9999
    
  },

})



export const web3Config = createConfig({
  chains: networks,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
    [arbitrum.id]: http(),
    [solana.id]: http(),
    [bsc.id]: http(),
    [polygon.id]: http(),
    [optimism.id]: http(),
    [avalanche.id]: http(),
    [bscTestnet.id]: http(),
  },
})



export function Web3Provider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}