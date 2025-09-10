async function handleWebhookEvent(event) {
  const { walletAddress, blockNumber, transactionHash, amount, tokenAddress, userId } = event;

  // Fetch last processed info
  const walletData = await db.getWallet(walletAddress);

  if (blockNumber < walletData.lastProcessedBlockNumber) {
    return 'Ignore old event';
  }
  
  if (blockNumber === walletData.lastProcessedBlockNumber && transactionHash === walletData.lastProcessedTxHash) {
    return 'Already processed';
  }
  
  // Check confirmations (assuming event.confirmations is provided)
  if (event.confirmations < MIN_CONFIRMATIONS) {
    return 'Wait for confirmations';
  }

  // Atomic update + credit user
  await db.transaction(async (trx) => {
    const currentWalletData = await trx.getWallet(walletAddress);
    if (blockNumber > currentWalletData.lastProcessedBlockNumber) {
      await trx.updateWallet(walletAddress, {
        lastProcessedBlockNumber: blockNumber,
        lastProcessedTxHash: transactionHash,
      });

      await trx.creditUser(userId, amount, tokenAddress);
    }
  });

  // Queue sweeping job for wallet
  queueSweepJob(walletAddress, privateKey);

  return 'Processed successfully';
}
