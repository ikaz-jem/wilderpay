import { getWalletClient } from '@wagmi/core'
import { walletClientToSigner } from '@reown/appkit-adapter-wagmi'
import { ethers } from 'ethers'

export const depositERC20 = async (tokenAddress, amount, toAddress) => {
  try {
    const walletClient = await getWalletClient()

    if (!walletClient) {
      throw new Error('Wallet not connected')
    }

    // ✅ Use Reown's walletClientToSigner
    const signer = await walletClientToSigner(walletClient)

    // ✅ Define ERC20 token ABI
    const erc20Abi = [
      'function transfer(address to, uint256 amount) public returns (bool)',
      'function decimals() public view returns (uint8)',
    ]

    // ✅ Create token contract
    const tokenContract = new ethers.Contract(tokenAddress, erc20Abi, signer)

    const decimals = await tokenContract.decimals()
    const parsedAmount = ethers.parseUnits(amount.toString(), decimals)

    const tx = await tokenContract.transfer(toAddress, parsedAmount)
    await tx.wait()

    console.log('✅ Transfer successful', tx.hash)
    return tx.hash
  } catch (error) {
    console.error('❌ Error in depositERC20:', error)
    throw error
  }
}
