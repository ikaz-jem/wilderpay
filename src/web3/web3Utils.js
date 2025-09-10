import { createWalletClient, createPublicClient, http} from 'viem'
import { mainnet, bsc, bscTestnet, polygon } from 'viem/chains'

export async function getClient(chain) {


  if (chain == "testnet") {

    const publicClient = createPublicClient({
      chain: bscTestnet,
      transport: http()
    })

    return publicClient
  }
  if (chain == "mainnet") {
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http()
    })

    return publicClient
  }
  if (chain == "bsc") {
    const publicClient = createPublicClient({
      chain: bsc,
      transport: http()
    })

    return publicClient
  }
  if (chain == "polygon") {
    const publicClient = createPublicClient({
      chain: polygon,
      transport: http()
    })

    return publicClient
  }
}






export async function getWalletClient(chain , account) {
  if (chain == "testnet") {
  const walletClient = createWalletClient({
    account,
    chain: bscTestnet,
    transport: http(),
  })

    return walletClient
  }
  if (chain == "mainnet") {
  const walletClient = createWalletClient({
    account,
    chain: mainnet,
    transport: http(),
  })
    return walletClient
  }
  if (chain == "bsc") {
  const walletClient = createWalletClient({
    account,
    chain: bsc,
    transport: http(),
  })

    return walletClient
  }
  if (chain == "polygon") {
      const walletClient = createWalletClient({
    account,
    chain: polygon,
    transport: http(),
  })
    return walletClient
  }
}

