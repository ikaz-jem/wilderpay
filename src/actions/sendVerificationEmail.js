"use server"
// lib/sendVerificationEmail.js

import { Resend } from 'resend';



export async function sendVerificationEmail(email, token) {
  let key = process.env.NEXT_RESEND_KEY
  if (!key){
    return {success:false,message:'something went wrong please try again or later'}
  }

  const resend = new Resend(key);
  const verificationUrl = `https://wilderpay.com/verification?verify=${token}`;


const html = `
<body style="margin:0; padding:0; background-color:#010012; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#C9BBCF;">
  <table align="center" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">

    <!-- Logo -->
    <tr>
      <td align="center" style="padding: 30px 0;">
        <img src="https://www.wilderpay.com/assets/images/logo.webp" alt="Wilderpay Logo" width="60" height="60" style="display: block;" />
      </td>
    </tr>

    <!-- Main Card -->
    <tr>
      <td style="background-color: #1A1A2E; border-radius: 12px; padding: 40px;">

        <!-- Heading -->
        <h1 style="font-size: 26px; color: #C9BBCF; margin: 0 0 20px; text-align: center;">
          Verify Your Email
        </h1>

        <!-- Message -->
        <p style="font-size: 16px; color: #8f8f8f; margin: 0 0 25px; text-align: center;">
          Hello there, <br /><br />
          Please verify your email address to complete your Wilderpay registration. Use the verification code below:
        </p>

        <!-- Verification Code -->
        <div style="font-size: 30px; font-weight: bold; color: #F75270; text-align: center; margin: 30px 0;">
          ${token}
        </div>

        <!-- Expiry Note -->
        <p style="font-size: 14px; color: #8f8f8f; text-align: center;">
          This code is valid for 48 hours.
        </p>

        <!-- CTA Button -->
        <div style="text-align: center; margin-top: 30px;">
          <a href="${verificationUrl}" target="_blank" 
             style="background-color: #10b981; color: #010012; padding: 14px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; font-size: 15px;">
            Verify Now
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



   const { data, error } =  await resend.emails.send({
    from: 'WilderPay <noreply@wilderpay.com>',
    to: [email],
    subject: 'Verify Your Email',
    html
  //   html: `
  // <body style="background-color:#fff;color:#212121">
  //   <div
  //     style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
  //     Yieldium.app Email Verification
  //     <div>
  //        ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿ ‌​‍‎‏﻿
  //     </div>
  //   </div>
  //   <table
  //     align="center"
  //     width="100%"
  //     border="0"
  //     cellpadding="0"
  //     cellspacing="0"
  //     role="presentation"
  //     style="max-width:37.5em;padding:20px;margin:0 auto;background-color:#eee">
  //     <tbody>
  //       <tr style="width:100%">
  //         <td>
  //           <table
  //             align="center"
  //             width="100%"
  //             border="0"
  //             cellpadding="0"
  //             cellspacing="0"
  //             role="presentation"
  //             style="background-color:#fff">
  //             <tbody>
  //               <tr>
  //                 <td>
  //                   <table
  //                     align="center"
  //                     width="100%"
  //                     border="0"
  //                     cellpadding="0"
  //                     cellspacing="0"
  //                     role="presentation"
  //                     style="background-color:#252f3d;display:flex;padding:20px 0;align-items:center;justify-content:center">
  //                     <tbody>
  //                       <tr>
  //                         <td>
  //                           <img
  //                             alt="AWS&#x27;s Logo"
  //                             height="35"
  //                             src="https://www.yieldium.app/assets/images/logo.webp"
  //                             style="display:block;outline:none;border:none;text-decoration:none"
  //                             width="35" />
  //                         </td>
  //                       </tr>
  //                     </tbody>
  //                   </table>
  //                   <table
  //                     align="center"
  //                     width="100%"
  //                     border="0"
  //                     cellpadding="0"
  //                     cellspacing="0"
  //                     role="presentation"
  //                     style="padding:25px 35px">
  //                     <tbody>
  //                       <tr>
  //                         <td>
  //                           <h1
  //                             style="color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:20px;font-weight:bold;margin-bottom:15px">
  //                             Verify your email address
  //                           </h1>
  //                           <p
  //                             style="font-size:14px;line-height:24px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:24px 0;margin-bottom:24px;margin-top:24px;margin-right:0;margin-left:0">
  //                             Finish Your yieldium account Validation
  //                             . We want to make sure it&#x27;s really
  //                             you. Please enter the following verification code
  //                             when prompted.
  //                           </p>
  //                           <table
  //                             align="center"
  //                             width="100%"
  //                             border="0"
  //                             cellpadding="0"
  //                             cellspacing="0"
  //                             role="presentation"
  //                             style="display:flex;align-items:center;justify-content:center">
  //                             <tbody>
  //                               <tr>
  //                                 <td>
  //                                   <p
  //                                     style="font-size:14px;line-height:24px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:0;font-weight:bold;text-align:center;margin-top:0;margin-bottom:0;margin-left:0;margin-right:0">
  //                                     Verification code
  //                                   </p>
  //                                   <p
  //                                     style="font-size:18px;line-height:24px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:10px 0;font-weight:bold;text-align:center;margin-top:10px;margin-right:0;margin-bottom:10px;margin-left:0">
  //                                     ${token}
  //                                   </p>
  //                                   <p
  //                                     style="font-size:14px;line-height:24px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:0px;text-align:center;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px">
  //                                     (This code is valid for 48 hours)
  //                                   </p>
  //                                 </td>
  //                               </tr>
  //                             </tbody>
  //                           </table>
  //                         </td>
  //                       </tr>
  //                     </tbody>
  //                   </table>
  //                   <hr
  //                     style="width:100%;border:none;border-top:1px solid #eaeaea" />
  //                   <table
  //                     align="center"
  //                     width="100%"
  //                     border="0"
  //                     cellpadding="0"
  //                     cellspacing="0"
  //                     role="presentation"
  //                     style="padding:25px 35px">
  //                     <tbody>
  //                       <tr>
  //                         <td>
  //                           <p
  //                             style="font-size:14px;line-height:24px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:0px;margin-top:0px;margin-bottom:0px;margin-left:0px;margin-right:0px">
  //                             yieldium  will never email you and ask
  //                             you to disclose or verify your password, credit
  //                             card, or banking account number.
  //                           </p>
  //                         </td>
  //                       </tr>
  //                     </tbody>
  //                   </table>
  //                 </td>
  //               </tr>
  //             </tbody>
  //           </table>
  //           <p
  //             style="font-size:12px;line-height:24px;color:#333;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;margin:24px 0;padding:0 20px;margin-top:24px;margin-right:0;margin-bottom:24px;margin-left:0">
  //             This message was produced and distributed by <!-- -->
  //             <a
  //               href="https://yieldium.app"
  //               style="color:#2754C5;text-decoration-line:none;font-family:-apple-system, BlinkMacSystemFont, &#x27;Segoe UI&#x27;, &#x27;Roboto&#x27;, &#x27;Oxygen&#x27;, &#x27;Ubuntu&#x27;, &#x27;Cantarell&#x27;, &#x27;Fira Sans&#x27;, &#x27;Droid Sans&#x27;, &#x27;Helvetica Neue&#x27;, sans-serif;font-size:14px;text-decoration:underline"
  //               target="_blank"
  //               >yieldium.app</a
  //             >
  //           </p>
  //         </td>
  //       </tr>
  //     </tbody>
  //   </table>
  //   <!--/$-->
  // </body> `,
  });

  return data
 
}
