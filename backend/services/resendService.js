import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const SENDER_NAME = process.env.RESEND_FROM_NAME || 'Voraeclat Kids';

const getResendClient = () => {
  const key = process.env.RESEND_API_KEY || RESEND_API_KEY;
  if (!key) {
    console.warn('[Resend Warning]: RESEND_API_KEY environment variable is not defined.');
    return null;
  }
  return new Resend(key);
};

/**
 * Send 4-digit verification OTP via Resend email service matching the exact customer brand design with toys & illustrated background
 */
export async function sendOtpEmail({ toEmail, otp, name }) {
  const recipientName = name || 'Saravanan';
  const cleanToEmail = toEmail.trim().toLowerCase();
  const resend = getResendClient();

  if (!resend) {
    return {
      success: false,
      message: 'Resend API key missing from environment'
    };
  }

  // Ensure 4 digits array
  const otpDigits = (otp || '').toString().slice(0, 4).split('');
  while (otpDigits.length < 4) {
    otpDigits.push('-');
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Your Voraeclat Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #FFF8EE; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #FFF8EE;">
          <tr>
            <td align="center" background="https://www.voraeclat.online/email-toys-clean-v2.jpg" style="background-color: #FFF8EE; background-image: url('https://www.voraeclat.online/email-toys-clean-v2.jpg'); background-repeat: no-repeat; background-position: center top; background-size: cover; padding: 36px 12px 46px;">
              
              <!-- Outer Table with Integrated Toys & Scene Decorations -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; width: 100%;">
                
                <!-- Top Toy Banner Row: Balloon & Plane -->
                <tr>
                  <td width="90" align="left" valign="top" style="padding-bottom: 6px;">
                    <img src="https://www.voraeclat.online/email-toy-balloon.png" alt="Hot Air Balloon" width="75" style="display: block; width: 75px; max-width: 100%; height: auto; border: 0;" />
                  </td>
                  <td align="center" valign="bottom" style="padding-bottom: 12px;">
                    <div style="font-size: 11px; letter-spacing: 5px; color: #D97706; font-weight: 700;">★ &nbsp; ☁️ &nbsp; ★</div>
                  </td>
                  <td width="90" align="right" valign="top" style="padding-bottom: 6px;">
                    <img src="https://www.voraeclat.online/email-toy-plane.png" alt="Paper Plane" width="85" style="display: block; width: 85px; max-width: 100%; height: auto; border: 0;" />
                  </td>
                </tr>

                <!-- Main Centered White Card Row -->
                <tr>
                  <td colspan="3" align="center">
                    
                    <table role="presentation" width="100%" style="max-width: 490px; background-color: #ffffff; border-radius: 26px; overflow: hidden; box-shadow: 0 16px 45px -10px rgba(11, 77, 70, 0.16); border: 1px solid #F0E6D8; border-collapse: separate;">
                      
                      <!-- Top Gold Accent Bar -->
                      <tr>
                        <td style="height: 6px; background-color: #D97706; padding: 0; border-radius: 26px 26px 0 0;"></td>
                      </tr>

                      <!-- Header with Official Voraeclat Logo -->
                      <tr>
                        <td align="center" style="padding: 32px 30px 16px; background-color: #ffffff;">
                          <a href="https://www.voraeclat.online" target="_blank" style="text-decoration: none; display: inline-block;">
                            <img
                              src="https://www.voraeclat.online/voraeclat-logo-enhanced.png"
                              alt="Voraeclat"
                              width="190"
                              style="display: block; max-width: 190px; width: 100%; height: auto; border: 0; outline: none; margin: 0 auto;"
                            />
                          </a>
                          <div style="margin-top: 10px; font-size: 11px; font-weight: 700; letter-spacing: 2.8px; color: #78350F; text-transform: uppercase; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                            L I T T L E &nbsp; T H I N G S , &nbsp; B I G &nbsp; D R E A M S
                          </div>
                        </td>
                      </tr>

                      <!-- Thin Separator Line -->
                      <tr>
                        <td style="padding: 0 32px;">
                          <div style="border-top: 1px solid #F1ECE4; width: 100%;"></div>
                        </td>
                      </tr>

                      <!-- Card Body Content -->
                      <tr>
                        <td style="padding: 26px 36px 16px;">
                          
                          <!-- Greeting -->
                          <h2 style="margin: 0 0 10px; font-size: 21px; font-weight: 800; color: #0F172A; letter-spacing: -0.3px;">
                            Hello ${recipientName},
                          </h2>
                          
                          <p style="margin: 0 0 22px; font-size: 14.5px; line-height: 1.6; color: #475569;">
                            Use the One-Time Password (OTP) below to securely verify your account access on <strong>Voraeclat.</strong>
                          </p>

                          <!-- Soft Yellow Rounded OTP Card -->
                          <div style="background-color: #FEF7E6; border: 1px solid #FDE68A; border-radius: 20px; padding: 22px 18px 18px; text-align: center; margin-bottom: 22px;">
                            <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #78350F; text-transform: uppercase; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              YOUR VERIFICATION CODE
                            </div>

                            <!-- 4 Separate Digit Boxes -->
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                              <tr>
                                ${otpDigits.map((digit) => `
                                  <td style="padding: 0 6px;">
                                    <div style="width: 52px; height: 60px; line-height: 60px; text-align: center; font-size: 30px; font-weight: 800; color: #2B1D15; background-color: #FFFFFF; border: 1.5px solid #D97706; border-radius: 12px; box-shadow: 0 2px 4px rgba(217, 119, 6, 0.08); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;">
                                      ${digit}
                                    </div>
                                  </td>
                                `).join('')}
                              </tr>
                            </table>

                            <div style="font-size: 12px; color: #854D0E; font-weight: 700; margin-top: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                              ⏰ Valid for 10 minutes &bull; Single use code
                            </div>
                          </div>

                          <!-- Light Mint/Cyan Security Tip Box -->
                          <div style="background-color: #EEF7F8; border: 1px solid #D5EBEE; border-radius: 14px; padding: 14px 16px; margin-bottom: 20px; text-align: left;">
                            <table role="presentation" border="0" cellspacing="0" cellpadding="0" width="100%">
                              <tr>
                                <td width="26" valign="top" style="font-size: 15px; line-height: 1.4;">
                                  🔐
                                </td>
                                <td style="font-size: 12px; line-height: 1.55; color: #0E4E58; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
                                  <strong>Security Tip:</strong> Voraeclat team members will never call or message asking for your verification code. Never share this OTP with anyone.
                                </td>
                              </tr>
                            </table>
                          </div>

                          <!-- Ignore Notice -->
                          <p style="margin: 0 0 20px; font-size: 12px; line-height: 1.5; color: #64748B; text-align: center;">
                            If you did not request this verification code, you can safely ignore this email.
                          </p>

                          <!-- Golden Crown Ornament Divider -->
                          <div style="text-align: center; margin: 0 0 16px;">
                            <span style="display: inline-block; width: 42px; height: 1px; background-color: #D1D5DB; vertical-align: middle;"></span>
                            <span style="display: inline-block; padding: 0 8px; font-size: 13px; color: #D97706; vertical-align: middle;">👑</span>
                            <span style="display: inline-block; width: 42px; height: 1px; background-color: #D1D5DB; vertical-align: middle;"></span>
                          </div>

                        </td>
                      </tr>

                      <!-- Bottom Deep Teal Curved Ribbon -->
                      <tr>
                        <td style="background-color: #0B4D46; height: 38px; border-radius: 0 0 24px 24px; padding: 0; text-align: center;">
                          <div style="font-size: 10.5px; font-weight: 600; color: #A7D8D2; letter-spacing: 0.5px; line-height: 38px;">
                            VORAECLAT KIDS &bull; <a href="https://www.voraeclat.online" target="_blank" style="color: #FBBF24; text-decoration: none;">WWW.VORAECLAT.ONLINE</a>
                          </div>
                        </td>
                      </tr>

                    </table>

                  </td>
                </tr>

                <!-- Bottom Toys Row: Teddy Bear (Left) & Rocking Horse (Right) -->
                <tr>
                  <td width="130" align="left" valign="bottom" style="padding-top: 14px;">
                    <img src="https://www.voraeclat.online/email-toy-teddy.png" alt="Teddy Bear with Gift" width="115" style="display: block; width: 115px; max-width: 100%; height: auto; border: 0;" />
                  </td>
                  <td align="center" valign="bottom" style="padding-top: 14px; padding-bottom: 8px;">
                    <div style="font-size: 11px; font-weight: 700; color: #78350F; letter-spacing: 1.5px; text-transform: uppercase;">
                      🧸 Asia's Baby &amp; Kids Superstore 🎠
                    </div>
                  </td>
                  <td width="130" align="right" valign="bottom" style="padding-top: 14px;">
                    <img src="https://www.voraeclat.online/email-toy-horse.png" alt="Rocking Horse" width="115" style="display: block; width: 115px; max-width: 100%; height: auto; border: 0;" />
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  const formattedFrom = `${SENDER_NAME} <${RESEND_FROM}>`;

  try {
    const data = await resend.emails.send({
      from: formattedFrom,
      to: cleanToEmail,
      subject: `${otp} is your Voraeclat Verification Code 🧸`,
      html: emailHtml
    });

    if (data.error) {
      console.warn('[Resend Warning]:', data.error);
      return {
        success: false,
        error: data.error,
        message: data.error.message || 'Failed to send email via Resend'
      };
    }

    console.log(`[Resend Success]: OTP email sent to ${cleanToEmail} from "${formattedFrom}" (ID: ${data.data?.id})`);
    return {
      success: true,
      id: data.data?.id,
      message: 'OTP email sent successfully'
    };
  } catch (err) {
    console.error('[Resend Error]:', err);
    return {
      success: false,
      error: err,
      message: err.message || 'Error communicating with Resend'
    };
  }
}
