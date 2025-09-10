import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';

const depositSolana = async (amount, senderPublicKey, receiverPublicKey) => {
  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
  const senderAccount = new PublicKey(senderPublicKey);
  const receiverAccount = new PublicKey(receiverPublicKey);

  const transaction = new Transaction().add(
    Token.createTransferInstruction(
      TOKEN_PROGRAM_ID,
      senderAccount,
      receiverAccount,
      senderAccount,  // Sender authority
      [],
      amount
    )
  );

  const signers = [senderAccount];  // Add required signers

  const txSignature = await connection.sendTransaction(transaction, signers);
  await connection.confirmTransaction(txSignature, 'confirmed');
  console.log('Solana deposit successful');
};
