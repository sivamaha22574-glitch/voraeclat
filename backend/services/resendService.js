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
 * Send 4-digit verification OTP via Resend email service with high-definition brand logo and luxury layout
 */
export async function sendOtpEmail({ toEmail, otp, name }) {
  const recipientName = name || 'Valued Customer';
  const cleanToEmail = toEmail.trim().toLowerCase();
  const resend = getResendClient();

  if (!resend) {
    return {
      success: false,
      message: 'Resend API key missing from environment'
    };
  }

  // Ensure digits array for 4-box layout
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
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 32px -8px rgba(15, 23, 42, 0.08); border: 1px solid #e2e8f0; border-collapse: separate;">
                
                <!-- Top Gold Accent Ribbon -->
                <tr>
                  <td style="height: 5px; background: linear-gradient(90deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%); padding: 0;"></td>
                </tr>

                <!-- Brand Logo Header -->
                <tr>
                  <td align="center" style="padding: 32px 30px 22px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;">
                    <a href="https://www.voraeclat.online" target="_blank" style="text-decoration: none; display: inline-block;">
                      <img
                        src="https://www.voraeclat.online/voraeclat-logo-enhanced.png"
                        alt="Voraeclat - Little Things, Big Dreams"
                        width="180"
                        style="display: block; max-width: 190px; width: 100%; height: auto; border: 0; outline: none; margin: 0 auto;"
                      />
                    </a>
                    <div style="margin-top: 10px; font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #b45309; text-transform: uppercase;">
                      Little Things, Big Dreams
                    </div>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 32px 36px 26px;">
                    <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: -0.3px;">
                      Hello ${recipientName},
                    </h2>
                    <p style="margin: 0 0 24px; font-size: 14.5px; line-height: 1.6; color: #475569;">
                      Use the One-Time Password (OTP) below to securely verify your account access on <strong>Voraeclat</strong>:
                    </p>

                    <!-- OTP Luxury Display Card -->
                    <div style="background: linear-gradient(180deg, #fffbeb 0%, #fef3c7 100%); border: 1.5px solid #fde68a; border-radius: 18px; padding: 26px 20px 22px; text-align: center; margin-bottom: 26px; box-shadow: inset 0 1px 2px rgba(251, 191, 36, 0.2);">
                      <div style="font-size: 11px; font-weight: 800; letter-spacing: 2px; color: #92400e; text-transform: uppercase; margin-bottom: 16px;">
                        YOUR VERIFICATION CODE
                      </div>

                      <!-- 4 Distinct Digit Blocks -->
                      <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin: 0 auto;">
                        <tr>
                          ${otpDigits.map((digit) => `
                            <td style="padding: 0 6px;">
                              <div style="width: 52px; height: 62px; line-height: 62px; text-align: center; font-size: 32px; font-weight: 900; color: #78350f; background: #ffffff; border: 2px solid #f59e0b; border-radius: 14px; box-shadow: 0 4px 10px rgba(217, 119, 6, 0.15); font-family: 'Courier New', Courier, monospace;">
                                ${digit}
                              </div>
                            </td>
                          `).join('')}
                        </tr>
                      </table>

                      <div style="font-size: 12px; color: #b45309; font-weight: 700; margin-top: 16px;">
                        ⏰ Valid for 10 minutes &bull; Single-use code
                      </div>
                    </div>

                    <!-- Security Advice -->
                    <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border-radius: 12px; padding: 14px 16px; margin-bottom: 20px; border: 1px solid #edf2f7;">
                      <tr>
                        <td style="font-size: 12.5px; line-height: 1.5; color: #64748b;">
                          🔒 <strong>Security Tip:</strong> Voraeclat team members will never call or message asking for your verification code. Never share this OTP with anyone.
                        </td>
                      </tr>
                    </table>

                    <p style="margin: 0; font-size: 12.5px; line-height: 1.5; color: #94a3b8;">
                      If you did not request this verification code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #0f172a; padding: 24px 30px; text-align: center;">
                    <p style="margin: 0 0 6px; font-size: 13px; font-weight: 800; color: #ffffff; letter-spacing: 0.5px;">
                      🧸 Voraeclat Kids Wear
                    </p>
                    <p style="margin: 0 0 12px; font-size: 11.5px; color: #94a3b8;">
                      100% Baby-Safe &bull; GOTS Certified Organic &bull; Express Shipping
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #64748b;">
                      &copy; ${new Date().getFullYear()} Voraeclat Online Store. All rights reserved.
                      <br />
                      <a href="https://www.voraeclat.online" target="_blank" style="color: #f59e0b; text-decoration: none; font-weight: 600;">www.voraeclat.online</a>
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;

  // Sender formatted with clean display name so email clients show "Voraeclat Kids"
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
