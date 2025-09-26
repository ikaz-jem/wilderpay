"use server";
import { formatCustomPrice } from "@/app/utils/formatPrice";
// lib/sendVerificationEmail.js

import { Resend } from "resend";

const url = "https://www.wilderpay.app/dashboard/contracts";

const coinIcon = {
  sol: "https://www.wilderpay.com/assets/images/crypto/solana.svg",
  bnb: "https://www.wilderpay.com/assets/images/crypto/bnb.svg",
  usdt: "https://www.wilderpay.com/assets/images/crypto/usdt.svg",
  matic: "https://www.wilderpay.com/assets/images/crypto/matic.svg",
  eth: "https://www.wilderpay.com/assets/images/crypto/eth.svg",
  btc: "https://www.wilderpay.com/assets/images/crypto/btc.svg",
  xrp: "https://www.wilderpay.com/assets/images/crypto/xrp.svg",
  yieldium: "https://www.wilderpay.com/assets/images/crypto/logo.webp",
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

  const html = `<body style="margin:0; padding:0; background-color:#010012; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#C9BBCF;">
  <table align="center" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">

    <!-- Logo Section -->
    <tr>
      <td align="center" style="padding: 30px 0;">
        <img src="https://www.wilderpay.com/assets/images/logo.webp" alt="Wilderpay Logo" width="60" height="60" style="display: block;" />
      </td>
    </tr>

    <!-- Main Card -->
    <tr>
      <td style="background-color: #1A1A2E; border-radius: 12px; padding: 40px; box-shadow: 0 0 10px rgba(0,0,0,0.5);">
        
        <!-- Heading -->
        <h1 style="font-size: 26px; color: #C9BBCF; margin: 0 0 20px; text-align:center;">
          🎉 Your Staking Contract is Live!
        </h1>

        <!-- Intro -->
        <p style="font-size: 16px; color: #8f8f8f; margin: 0 0 25px; text-align: center;">
          Congratulations! You've successfully created a staking contract on Wilderpay.
          Here's a summary of your staking details:
        </p>

        <!-- Contract Details -->
        <table width="100%" cellpadding="12" cellspacing="0" style="background:#101020; border-radius:10px; margin: 20px 0;">
          <tr>
            <td style="color:#8f8f8f; font-size:14px;">Contract ID:</td>
            <td style="color:#C9BBCF; font-weight:bold; font-size:14px;">${stake?._id}</td>
          </tr>
          <tr>
            <td style="color:#8f8f8f; font-size:14px;">Amount Staked:</td>
            <td style="color:#C9BBCF; font-weight:bold; font-size:14px; text-transform:uppercase;">${stake?.amount} ${stake?.currency}</td>
          </tr>
          <tr>
            <td style="color:#8f8f8f; font-size:14px;">Duration:</td>
            <td style="color:#C9BBCF; font-weight:bold; font-size:14px;">${stake?.duration} days</td>
          </tr>
          <tr>
            <td style="color:#8f8f8f; font-size:14px;">Claim Date:</td>
            <td style="color:#C9BBCF; font-weight:bold; font-size:14px;">${stake?.unlocksAt}</td>
          </tr>
        </table>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="${url}" target="_blank" 
             style="background-color: #10b981; color: #010012; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size:15px; display:inline-block;">
            View Your Contract
          </a>
        </div>

      </td>
    </tr>

    <!-- Disclaimers -->
    <tr>
      <td style="text-align: center; padding: 25px 0; font-size: 12px; color: #8f8f8f;">
        <b>Disclaimer:</b> Digital asset prices are subject to high market risk and price volatility. The value of your investment may go down or up, and you may not get back the amount invested. You are solely responsible for your investment decisions and Wilderpay is not liable for any losses you may incur. Past performance is not a reliable predictor of future performance.

        <br /><br />
        You should only invest in products you are familiar with and understand the risks of. Carefully consider your financial situation and consult an independent financial advisor before making any investment decisions. This material should not be construed as financial advice.

        <br /><br />
        <b>Kindly note:</b> Please be aware of phishing sites and always ensure you're visiting the official <span style="color: #F75270; text-decoration: none;">wilderpay.com</span> website when entering sensitive data.
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #8f8f8f;">
        <hr style="border: 0; border-top: 1px solid #2c2c3d; margin: 20px auto; max-width: 300px;" />
        🔒 Wilderpay will never ask for your private keys, password, or payment details via email.
        <br />
        Need help? <a href="mailto:support@wilderpay.com" style="color: #F75270; text-decoration: none;">Contact Support</a>
        <br />
        <a href="https://wilderpay.com" style="color: #F75270; text-decoration: none;">Visit wilderpay.com</a>
      </td>
    </tr>

  </table>
</body>



`;

  const { data, error } = await resend.emails.send({
    from: "WilderPay <noreply@wilderpay.com>",
    to: [email],
    subject: "Your New Contract Has Been Deployed on Wilderpay 🎉",
    html,
  });

  return data;
}
