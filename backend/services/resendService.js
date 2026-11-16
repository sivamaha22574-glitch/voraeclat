import { Resend } from 'resend';

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

const getResendClient = () => {
  const key = process.env.RESEND_API_KEY || RESEND_API_KEY;
  if (!key) {
    console.warn('[Resend Warning]: RESEND_API_KEY environment variable is not defined.');
    return null;
  }
  return new Resend(key);
};

/**
 * Send 4-digit verification OTP via Resend email service
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

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Voraeclat Verification Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" max-width="520" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.08); border: 1px solid #e2e8f0;">
                <!-- Header -->
                <tr>
                  <td style="background-color: #0f172a; padding: 32px 30px; text-align: center;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">
                      🧸 Voraeclat<span style="color: #f59e0b;">.</span>
                    </h1>
                    <p style="margin: 6px 0 0; color: #94a3b8; font-size: 13px; font-weight: 500; letter-spacing: 0.5px;">
                      PREMIUM KIDS WEAR &amp; BABY ESSENTIALS
                    </p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 36px 32px 28px;">
                    <h2 style="margin: 0 0 12px; font-size: 20px; font-weight: 700; color: #0f172a;">
                      Hello ${recipientName},
                    </h2>
                    <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #475569;">
                      Use the One-Time Password (OTP) below to verify your login or account access on <strong>Voraeclat</strong>:
                    </p>

                    <!-- OTP Code Display Card -->
                    <div style="background: linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%); border: 2px dashed #f59e0b; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                      <div style="font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #b45309; text-transform: uppercase; margin-bottom: 8px;">
                        YOUR VERIFICATION CODE
                      </div>
                      <div style="font-size: 38px; font-weight: 900; letter-spacing: 8px; color: #78350f; font-family: 'Courier New', Courier, monospace;">
                        ${otp}
                      </div>
                      <div style="font-size: 12px; color: #92400e; font-weight: 600; margin-top: 8px;">
                        ⏰ Valid for the next 10 minutes
                      </div>
                    </div>

                    <p style="margin: 0 0 16px; font-size: 13px; line-height: 1.5; color: #64748b;">
                      If you did not request this verification code, please ignore this email. Never share your OTP with anyone.
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background-color: #f1f5f9; padding: 20px 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                    <p style="margin: 0 0 4px; font-size: 12px; font-weight: 600; color: #475569;">
                      &copy; ${new Date().getFullYear()} Voraeclat Online Store. All rights reserved.
                    </p>
                    <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                      Visit us at <a href="https://www.voraeclat.online" style="color: #f59e0b; text-decoration: none; font-weight: 600;">www.voraeclat.online</a>
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

  try {
    const data = await resend.emails.send({
      from: RESEND_FROM,
      to: cleanToEmail,
      subject: `${otp} is your Voraeclat Verification Code`,
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

    console.log(`[Resend Success]: OTP email sent to ${cleanToEmail} (ID: ${data.data?.id})`);
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
