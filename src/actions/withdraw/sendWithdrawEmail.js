"use server";
import { formatCustomPrice } from "@/app/utils/formatPrice";
// lib/sendVerificationEmail.js

import { Resend } from "resend";

const url = "https://www.yieldium.app/dashboard/account/transactions";



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

  const html = `<body
  style="margin:0; padding:0; background-color:#010012; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#FFFFFF;">
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
        <h1 style="font-size: 24px; color: #45E3FF; margin: 0 0 20px;">USDT Withdrawal Successful 🎉</h1>

        <!-- Intro -->
        <p style="font-size: 16px; color: #CCCCCC; margin: 0 0 20px;">
          Congratulations! You’ve successfully withdrawn ${formatCustomPrice(amount,2)} USDT from your account.

        </p>

        <!-- Contract Details -->
        <table width="100%" cellpadding="10" cellspacing="0"
          style="background:#0F0F1F; border-radius:8px; margin:20px 0;">
          <tr>

            <td style="color:#CCCCCC; font-size:14px;">Amount:</td>
            <td style="color:#FFFFFF; font-weight:medium; font-size:14px;">${formatCustomPrice(amount,8)} USDT</td>
          </tr>
          <tr>

            <td style="color:#CCCCCC; font-size:14px;">Address:</td>
            <td style="color:#FFFFFF; font-weight:medium; font-size:14px;">${toAddress}</td>
          </tr>
          <tr>
            <td style="color:#CCCCCC; font-size:14px;">Transaction ID :</td>
            <td style="color:#FFFFFF; font-weight:medium; font-size:14px; text-transform:uppercase;">${hash}
             </td>
          </tr>

      
        
        </table>

        <!-- CTA -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="${url}" target="_blank"
            style="background-color: #45E3FF; color: #010012; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold; font-size:15px;">
            View Transaction
          </a>
        </div>
      </td>
    </tr>
      <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #777;">
    <b>Disclaimer:</b>
Please check with the receiving platform or wallet as the transaction is already confirmed on the blockchain explorer.  
        <br />
      </td>

    <!-- Footer -->
    <tr>
      <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #777;">
    <b>Disclaimer:</b>
         Digital asset prices are subject to high market risk and price volatility. The value of your
        investment may go down or up, and you may not get back the amount invested. You are solely responsible for your
        investment decisions and Yieldium is not liable for any losses you may incur. Past performance is not a reliable
        predictor of future performance. You should only invest in products you are familiar with and where you
        understand the risks. You should carefully consider your investment experience, financial situation, investment
        objectives and risk tolerance and consult an independent financial adviser prior to making any investment. This
        material should not be construed as financial advice. For more information, see our Terms of Use and Risk
        Warning.
      <b> Kindly note:</b>
        Please be aware of phishing sites and always make sure you are visiting the official  <span style="color: #45E3FF; text-decoration: none;">yieldium.app</span> 
        website when entering sensitive data. 

        <br />
      </td>
    </tr>
    <tr>
      <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #777;">
        <hr />
        🔒 Yieldium will never ask for your private keys, password, or payment details over email.
        <br />
        Need help? <a href="mailto:support@yieldium.app" style="color: #45E3FF; text-decoration: none;">Contact
          Support</a>
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
    subject: `USDT Withdrawal Successful  🎉 ${date}`,
    html,
  });

  return data;
}
