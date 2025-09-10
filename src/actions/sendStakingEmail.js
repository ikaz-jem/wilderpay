"use server";
import { formatCustomPrice } from "@/app/utils/formatPrice";
// lib/sendVerificationEmail.js

import { Resend } from "resend";

const url = "https://www.yieldium.app/dashboard/contracts";

const coinIcon = {
  sol: "https://www.yieldium.app/assets/images/crypto/solana.svg",
  bnb: "https://www.yieldium.app/assets/images/crypto/bnb.svg",
  usdt: "https://www.yieldium.app/assets/images/crypto/usdt.svg",
  matic: "https://www.yieldium.app/assets/images/crypto/matic.svg",
  eth: "https://www.yieldium.app/assets/images/crypto/eth.svg",
  btc: "https://www.yieldium.app/assets/images/crypto/btc.svg",
  xrp: "https://www.yieldium.app/assets/images/crypto/xrp.svg",
  yieldium: "https://www.yieldium.app/assets/images/crypto/logo.webp",
};

export async function sendStakingEmail(email, stake) {
  let key = process.env.NEXT_RESEND_KEY;
  if (!key) {
    return {
      success: false,
      message: "something went wrong please try again or later",
    };
  }

  const img = coinIcon[stake?.currency];
  console.log(img);
  const resend = new Resend(key);
  const dailyprofits = parseFloat(((stake?.amount * 0.5) / 100).toFixed(4));

  const html = `<body style="margin:0; padding:0; background-color:#010012; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#FFFFFF;">
  <table align="center" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">
    
    <!-- Logo -->
     <tr>
      <td align="center" style="padding: 20px 0">
        <img src="https://www.yieldium.app/assets/images/logo.webp" alt="Yieldium Logo" width="50" height="50" style="display: block;" />

      </td>
    </tr>
        
        <!-- Main Card -->
        <tr>
        <td style="background-color: #1A1A2E; border-radius: 10px; padding: 30px;">
        
        <!-- Heading -->
        <h1 style="font-size: 24px; color: #45E3FF; margin: 0 0 20px;">Your Staking Contract is Live 🎉</h1>
        
        <!-- Intro -->
        <p style="font-size: 16px; color: #CCCCCC; margin: 0 0 20px;">
        Congratulations! You have successfully created a staking contract.  
        Here are the details of your contract:
        </p>

        <!-- Contract Details -->
        <table width="100%" cellpadding="10" cellspacing="0" style="background:#0F0F1F; border-radius:8px; margin:20px 0;">
          <tr>
          
            <td style="color:#CCCCCC; font-size:14px;">Contract ID:</td>
            <td style="color:#FFFFFF; font-weight:bold; font-size:14px;">${stake?._id}</td>
          </tr>
          <tr>
            <td style="color:#CCCCCC; font-size:14px;">Amount Staked:</td>
            <td style="color:#FFFFFF; font-weight:bold; font-size:14px; text-transform:uppercase;">${stake?.amount} ${stake?.currency}</td>
          </tr>
          <tr>
            <td style="color:#CCCCCC; font-size:14px;">Duration:</td>
            <td style="color:#FFFFFF; font-weight:bold; font-size:14px;">${stake?.duration} days</td>
          </tr>
          <tr>
            <td style="color:#CCCCCC; font-size:14px;">Expected Daily Profits:</td>
            <td style="color:#45E3FF; font-weight:bold; font-size:14px; text-transform:uppercase;">${dailyprofits} ${stake?.currency}</td>
          </tr>
          <tr>
            <td style="color:#CCCCCC; font-size:14px;">Claim Date:</td>
            <td style="color:#FFFFFF; font-weight:bold; font-size:14px;">${stake?.unlocksAt}</td>
          </tr>
        </table>

        <!-- CTA -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="${url}" target="_blank" 
             style="background-color: #45E3FF; color: #010012; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size:15px;">
            View Your Contract
          </a>
        </div>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #777;">
        🔒 Yieldium will never ask for your private keys, password, or payment details over email.
        <br />
        Need help? <a href="mailto:support@yieldium.app" style="color: #45E3FF; text-decoration: none;">Contact Support</a>
        <br />
        <a href="https://yieldium.app" style="color: #45E3FF; text-decoration: none;">Visit yieldium.app</a>
      </td>
    </tr>
  </table>
</body>

`;

  const { data, error } = await resend.emails.send({
    from: "Yieldium <noreply@yieldium.app>",
    to: [email],
    subject: "Your New Contract Has Been Deployed on Yieldium 🎉",
    html,
  });

  return data;
}
