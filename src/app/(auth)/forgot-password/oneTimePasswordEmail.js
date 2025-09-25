"use server";
import { formatCustomPrice } from "@/app/utils/formatPrice";
// lib/sendVerificationEmail.js

import { Resend } from "resend";

const url = "https://www.wilderpay.com/login";



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

export async function oneTimePasswordEmail(email, password) {

    const date = getFormattedUTCDate()

  let key = process.env.NEXT_RESEND_KEY;
  if (!key) {
    return {
      success: false,
      message: "something went wrong please try again or later",
    };
  }

  const resend = new Resend(key);

  const html = `
<body
  style="margin:0; padding:0; background-color:#010012; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#C9BBCF;">
  <table align="center" width="100%" style="max-width:600px; margin:auto; padding:20px;">

    <!-- Logo -->
    <tr>
      <td align="center" style="padding:20px 0;">
        <img src="https://www.wilderpay.com/assets/images/logo.webp" alt="Wilderpay Logo" width="50" height="50" style="display:block;" />
      </td>
    </tr>

    <!-- Main Card -->
    <tr>
      <td style="background-color:#1A1A2E; border-radius:10px; padding:30px;">

        <!-- Heading -->
        <h1 style="font-size:24px; color:#F75270; margin:0 0 20px; text-align:center;">
          Password Reset Request
        </h1>

        <!-- Intro -->
        <p style="font-size:16px; color:#8f8f8f; margin:0 0 20px; text-align:center;">
          Please use the following one-time password to log in and reset your password in the Settings tab:
        </p>

        <!-- Password Code Box -->
        <table width="100%" cellpadding="10" cellspacing="0" style="background:#0F0F1F; border-radius:8px; margin:20px 0;">
          <tr>
            <td style="color:#C9BBCF; font-size:14px;">
              <div style="font-size:28px; font-weight:bold; color:#10b981; text-align:center; margin:30px 0;">
                ${password}
              </div>
            </td>
          </tr>
        </table>

        <!-- CTA -->
        <div style="text-align:center; margin-top:30px;">
          <a href="${url}" target="_blank"
            style="background-color:#10b981; color:#010012; padding:12px 24px; border-radius:5px; text-decoration:none; font-weight:bold; font-size:15px;">
            Login
          </a>
        </div>
      </td>
    </tr>

    <!-- Disclaimers -->
    <tr>
      <td style="text-align:center; padding:20px 0; font-size:12px; color:#8f8f8f;">
        <b>Disclaimer:</b> Please check with the receiving platform or wallet as the transaction is already confirmed on the blockchain explorer.
      </td>
    </tr>

    <tr>
      <td style="text-align:center; padding:0 20px 20px; font-size:12px; color:#8f8f8f;">
        <b>Disclaimer:</b> Digital asset prices are subject to high market risk and price volatility. The value of your investment may go down or up, and you may not get back the amount invested. You are solely responsible for your investment decisions and Wilderpay is not liable for any losses you may incur. Past performance is not a reliable predictor of future performance. You should only invest in products you are familiar with and where you understand the risks. Consider your investment experience, financial situation, objectives, and risk tolerance. Consult an independent financial adviser before investing. This material should not be construed as financial advice. For more info, see our <a href="https://wilderpay.com/terms" style="color:#F75270; text-decoration:none;">Terms of Use</a> and <a href="https://wilderpay.com/risk-warning" style="color:#F75270; text-decoration:none;">Risk Warning</a>.<br /><br />
        <b>Kindly note:</b> Please be aware of phishing sites and always make sure you are visiting the official <span style="color:#F75270; text-decoration:none;">wilderpay.com</span> website before entering sensitive data.
      </td>
    </tr>

    <tr>
      <td style="text-align:center; padding:20px 0; font-size:12px; color:#8f8f8f;">
        <hr style="border:none; border-top:1px solid #333; margin:20px 0;" />
        🔒 Wilderpay will never ask for your private keys, password, or payment details via email.<br />
        Need help? <a href="mailto:support@wilderpay.com" style="color:#F75270; text-decoration:none;">Contact Support</a><br />
        <a href="https://wilderpay.com" style="color:#F75270; text-decoration:none;">Visit wilderpay.com</a>
      </td>
    </tr>
  </table>
</body>


`;

  const { data, error } = await resend.emails.send({
    from: "Wilderpay <noreply@wilderpay.com>",
    to: [email],
    subject: `Password Reset  ${date}`,
    html,
  });

  return data;
}
