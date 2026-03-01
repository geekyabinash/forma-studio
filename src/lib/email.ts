import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
})

const FROM_NAME = 'Forma Studio'
const FROM_EMAIL = process.env.GMAIL_USER

function emailWrapper(content: string): string {
  return `
    <div style="font-family: 'Georgia', serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background-color: #141B2B; color: #F5E6D0;">
      <div style="text-align: center; margin-bottom: 32px; border-bottom: 1px solid rgba(245, 230, 208, 0.1); padding-bottom: 24px;">
        <h1 style="font-size: 28px; font-weight: 400; margin: 0; color: #F5E6D0; letter-spacing: 1px;">Forma Studio</h1>
        <p style="font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #D4B896; margin: 8px 0 0;">Admin Portal</p>
      </div>
      ${content}
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(245, 230, 208, 0.1); text-align: center;">
        <p style="font-size: 12px; color: rgba(212, 184, 150, 0.6); margin: 0;">This is an automated message from Forma Studio Admin</p>
      </div>
    </div>
  `
}

export async function sendPasswordResetEmail(
  to: string,
  resetUrl: string
): Promise<void> {
  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 400; color: #F5E6D0; margin: 0 0 16px;">Password Reset Request</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #D4B896; margin: 0 0 24px;">
      We received a request to reset your admin password. Click the button below to set a new password. This link expires in 1 hour.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="${resetUrl}" style="display: inline-block; padding: 14px 32px; background-color: #D4654A; color: #ffffff; text-decoration: none; font-size: 13px; letter-spacing: 1px; text-transform: uppercase; border-radius: 8px;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 12px; line-height: 1.6; color: rgba(212, 184, 150, 0.6); margin: 0;">
      If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
    </p>
  `)

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: 'Password Reset - Forma Studio Admin',
    html,
  })
}

export async function sendMfaOtp(to: string, code: string): Promise<void> {
  const html = emailWrapper(`
    <h2 style="font-size: 20px; font-weight: 400; color: #F5E6D0; margin: 0 0 16px;">Verification Code</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #D4B896; margin: 0 0 24px;">
      Use the following code to complete your authentication. This code expires in 5 minutes.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <div style="display: inline-block; padding: 16px 40px; background-color: rgba(212, 101, 74, 0.1); border: 1px solid rgba(212, 101, 74, 0.3); border-radius: 8px;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #D4654A; font-family: monospace;">${code}</span>
      </div>
    </div>
    <p style="font-size: 12px; line-height: 1.6; color: rgba(212, 184, 150, 0.6); margin: 0;">
      If you didn't request this code, please secure your account immediately.
    </p>
  `)

  await transporter.sendMail({
    from: `"${FROM_NAME}" <${FROM_EMAIL}>`,
    to,
    subject: `${code} - Forma Studio Verification Code`,
    html,
  })
}
