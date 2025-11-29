import { createWalletClient, createPublicClient, http} from 'viem'
import { mainnet, bsc, bscTestnet, polygon } from 'viem/chains'

const bscRpc = "https://bnb-mainnet.g.alchemy.com/v2/iG6BiNVyf6NpZSpWiWxlig5X4R1PMSpJ"

export async function getClient(chain) {


  if (chain == "bscTestnet") {

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
      transport: http(bscRpc)
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
  if (chain == "bscTestnet") {
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
    transport: http(bscRpc),
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

