"use server";
import { formatCustomPrice } from "@/app/utils/formatPrice";
// lib/sendVerificationEmail.js

import { Resend } from "resend";

const url = "https://www.wilderpay.com/dashboard/account/transactions";



function getFormattedUTCDate() {
    const now = new Date();

    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const day = String(now.getUTCDate()).padStart(2, '0');
    const hours = String(now.getUTCHours()).padStart(2, '0');
    const minutes = String(now.getUTCMinutes()).padStart(2, '0');
    const seconds = String(now.getUTCSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (UTC)`;
}

export async function sendWithdrawEmail(email, amount,toAddress,hash) {

    const date = getFormattedUTCDate()

  let key = process.env.NEXT_RESEND_KEY;
  if (!key) {
    return {
      success: false,
      message: "something went wrong please try again or later",
    };
  }

  const resend = new Resend(key);

  const html = `<body style="margin:0; padding:0; background-color:#010012; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#C9BBCF;">
  <table align="center" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">

    <!-- Logo -->
    <tr>
      <td align="center" style="padding: 30px 0">
        <img src="https://www.wilderpay.com/assets/images/logo.webp" alt="Wilderpay Logo" width="60" height="60" style="display: block;" />
      </td>
    </tr>

    <!-- Main Card -->
    <tr>
      <td style="background-color: #1A1A2E; border-radius: 12px; padding: 40px;">

        <!-- Heading -->
        <h1 style="font-size: 26px; color: #C9BBCF; margin: 0 0 20px;">USDT Withdrawal Successful 🎉</h1>

        <!-- Intro -->
        <p style="font-size: 16px; color: #8f8f8f; margin: 0 0 25px;">
          Congratulations! You’ve successfully withdrawn <strong style="color:#F75270;">${formatCustomPrice(amount,2)} USDT</strong> from your Wilderpay account.
        </p>

        <!-- Withdrawal Details -->
        <table width="100%" cellpadding="10" cellspacing="0" style="background:#101020; border-radius:10px; margin:20px 0;">
          <tr>
            <td style="color:#8f8f8f; font-size:14px;">Amount:</td>
            <td style="color:#C9BBCF; font-weight:medium; font-size:14px;">${formatCustomPrice(amount,8)} USDT</td>
          </tr>
          <tr>
            <td style="color:#8f8f8f; font-size:14px;">Address:</td>
            <td style="color:#C9BBCF; font-weight:medium; font-size:14px;">${toAddress}</td>
          </tr>
          <tr>
            <td style="color:#8f8f8f; font-size:14px;">Transaction ID:</td>
            <td style="color:#C9BBCF; font-weight:medium; font-size:14px; text-transform:uppercase;">${hash}</td>
          </tr>
        </table>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="${url}" target="_blank"
            style="background-color: #10b981; color: #010012; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size:15px;">
            View Transaction
          </a>
        </div>
      </td>
    </tr>

    <!-- Blockchain Confirmation Note -->
    <tr>
      <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #8f8f8f;">
        <b>Disclaimer:</b> Please check with the receiving platform or wallet as the transaction is already confirmed on the blockchain explorer.
      </td>
    </tr>

    <!-- Legal Disclaimer -->
    <tr>
      <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #8f8f8f;">
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
    subject: `USDT Withdrawal Successful  🎉 ${date}`,
    html,
  });

  return data;
}
