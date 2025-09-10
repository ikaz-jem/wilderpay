"use server"
// lib/sendVerificationEmail.js

import { Resend } from 'resend';



export async function sendVerificationEmail(email, token) {
  let key = process.env.NEXT_RESEND_KEY
  if (!key){
    return {success:false,message:'something went wrong please try again or later'}
  }

  const resend = new Resend(key);
  const verificationUrl = `https://yieldium.app/verification?verify=${token}`;


const html = `
  <body style="margin:0; padding:0; background-color:#010012; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; color:#FFFFFF;">
    <table align="center" width="100%" style="max-width: 600px; margin: auto; padding: 20px;">
      <tr>
        <td align="center" style="padding: 20px 0;">
          <img src="https://www.yieldium.app/assets/images/logo.webp" alt="Yieldium Logo" width="50" height="50" style="display: block;" />
        </td>
      </tr>

      <tr>
        <td style="background-color: #1A1A2E; border-radius: 10px; padding: 30px;">
          <h1 style="font-size: 24px; color: #45E3FF; margin: 0 0 20px;">Verify Your Email</h1>
          <p style="font-size: 16px; color: #CCCCCC; margin: 0 0 20px;">
            Hello there, <br /><br />
            Please verify your email address to complete your Yieldium registration. Use the verification code below:
          </p>

          <div style="font-size: 28px; font-weight: bold; color: #EE66A6; text-align: center; margin: 30px 0;">
            ${token}
          </div>

          <p style="font-size: 14px; color: #999; text-align: center;">
            This code is valid for 48 hours.
          </p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${verificationUrl}" target="_blank" style="background-color: #45E3FF; color: #010012; padding: 12px 24px; border-radius: 5px; text-decoration: none; font-weight: bold;">
              Verify Now
            </a>
          </div>
        </td>
      </tr>

      <tr>
        <td style="text-align: center; padding: 20px 0; font-size: 12px; color: #777;">
          Yieldium will never ask for your password or payment details over email.
          <br />
          <a href="https://yieldium.app" style="color: #45E3FF; text-decoration: none;">Visit yieldium.app</a>
        </td>
      </tr>
    </table>
  </body>
`;



   const { data, error } =  await resend.emails.send({
    from: 'Yieldium <noreply@yieldium.app>',
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
