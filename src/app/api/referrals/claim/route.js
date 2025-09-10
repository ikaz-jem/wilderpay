// import mongoose from "mongoose";
// import { connectDb } from "../../../db/db";
// import { User } from "@/app/models/user/user";
// import { Connection, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
// import { Transaction as newTx } from "@/app/models/Transaction/Transaction";
// import { LAMPORTS_PER_SOL } from "@solana/web3.js";
// import bs58 from 'bs58'
// import { IcoTransaction } from "@/app/models/ico/ico";
// import { cookies } from "next/headers";
// // import { origins } from "../../origins";
// const ConfirmTransaction = async (signature,connection) => {
//     let done = false;
//     let status = null;
//     let confirmed = false
//     while (!done) {
//         status = await connection.getSignatureStatus(signature);
//         if (status && status.value) {
//             if (!confirmed && status.value.confirmationStatus === 'confirmed') {
//                 confirmed = true
//             }
//             if (status.value.confirmationStatus === 'finalized') {
//                 done = true;
//                 return true; 
//             }
//             if (status.value.err) {
//                 console.error("Transaction failed or reverted:", status.value.err);
//                 done = true;
//                 return false; 
//             }
//         }
//         await new Promise(resolve => setTimeout(resolve, 1000));
//     }
//     return false; 
// };

// async function claimReward(amount,userWallet) {
//     const RPC_URL = process.env.RPC_URL 
//     const connection = new Connection(RPC_URL,"confirmed")
//     let privateKey = process.env.PRIVATE_KEY
//     const wallet = Keypair.fromSecretKey(bs58.decode(privateKey));
//     try {
//         const transaction = new Transaction().add(
//           SystemProgram.transfer({
//             fromPubkey: wallet.publicKey,
//             toPubkey: userWallet,
//             lamports: amount * LAMPORTS_PER_SOL,
//           })
//         );
//         const signature = await sendAndConfirmTransaction(connection, transaction, [wallet]);
//         let sig = await ConfirmTransaction(signature,connection)
//         if (sig) {
//             return signature
//         }else {
//             return false
//         }
//       } catch (error) {
//         console.error('Error sending referral reward:', error);
//        return false
//       }
// }



// export async function POST(req) {

//   let headers = await req.headers
//   let origin = await headers.get('origin')
  
//   if (!origins.includes(origin)) {
//     await mongoose.disconnect()
//     return Response.json({ succes: true, message: 'origin Blocked from the server' }, { status: 401 })
//   }
//   let apiKey = process.env.API_KEY
//   const uiKey = await headers.get('authorization') 

  
//   if (apiKey !== uiKey) {
//     return Response.json({ succes: true, message: 'unauthorized' }, { status: 200 })
//   } 
  
//   try {
//     // 🔹 Get the token from cookies
//     // const token = cookies().get("token")?.value;

//     // // 🔹 If no token, return unauthorized
//     // if (!token) {
//     //   return Response.json({ message: "Unauthorized " }, { status: 401 });
//     // }

//     // 🔹 Verify token

//     const { address } = await req.json();

//     await connectDb();
  
//     console.log('sending transaction ....')
//     const existingUser = await User.findOne({ address });
//     if (!existingUser) return Response.json({ error: "User Not Found" },{status:500});

//   let amountToClaim = existingUser.referralBalance 
  
//   if(amountToClaim == 0) return Response.json({succes:false, message:'No enough Balance'},{status:200})
//       let prevClaim = existingUser.claimedBalance
//       let prevBalance = existingUser.referralBalance
  
//       existingUser.referralBalance = 0
//       await existingUser.save()
  
//   let isPaid = await claimReward(amountToClaim,address)
  
//   if (isPaid) {
//       let transaction =  await newTx.create({
//           txHash:isPaid,
//           address,
//           solAmount:amountToClaim,
//           type:'withdraw',
//       })
//       existingUser.claimedBalance =prevClaim+ amountToClaim
//       existingUser.transactions.push(transaction._id)
//       await existingUser.save()
//         let updatedData = await User.findOne({ address: address }).populate([
//             "referredUsers",
//             "transactions",
//             "icoTransactions",
//           ]);   
//       return Response.json({succes:true,data:updatedData})
//   }else {
//       existingUser.claimedBalance = prevClaim
//       existingUser.referralBalance = prevBalance
//       await existingUser.save()
//       Response.json({succes:false,message:'could not perform transaction please retry later'})
//   }


//   } catch (error) {
//     return Response.json({ message: "Invalid or Expired Token" }, { status: 401 });
//   }






// }
