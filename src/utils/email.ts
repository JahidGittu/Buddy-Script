import nodemailer from 'nodemailer';

// Validate environment variables
const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;

if (!emailUser || !emailPass) {
  throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required');
}

// Create transporter with explicit typing
let transporter: nodemailer.Transporter;

try {
  // Try createTransport first (most common)
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
} catch (error) {
  console.log('createTransport failed, trying createTransporter...');
  // Fallback to createTransporter
  transporter = nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
}

// Test transporter configuration
transporter.verify(function (error: Error | null, success: boolean) {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server is ready to take messages');
  }
});

export async function sendOTPEmail(email: string, otp: string, type: 'registration' | 'reset_password'): Promise<void> {
  const subject = type === 'registration' 
    ? 'Verify Your Email - Buddy Script'
    : 'Reset Your Password - Buddy Script';
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #1890FF; margin: 0;">Buddy Script</h2>
      </div>
      <p style="font-size: 16px; color: #333; margin-bottom: 16px;">Hello,</p>
      <p style="font-size: 16px; color: #333; margin-bottom: 16px;">Your verification code is:</p>
      <div style="background: #f8f9fa; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; border-radius: 6px; border: 1px dashed #dee2e6;">
        ${otp}
      </div>
      <p style="font-size: 14px; color: #666; margin-bottom: 8px;">This code will expire in 10 minutes.</p>
      <p style="font-size: 14px; color: #999; margin: 0;">If you didn't request this, please ignore this email.</p>
    </div>
  `;

  const mailOptions = {
    from: `"Buddy Script" <${emailUser}>`,
    to: email,
    subject,
    html,
  };

  try {
    // In development, log the OTP but still try to send email
    if (process.env.NODE_ENV === 'development') {
      console.log(`📧 OTP for ${email}: ${otp}`);
      console.log('📧 Email details:', {
        to: email,
        subject,
        from: mailOptions.from,
      });
    }

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully:', info.messageId);
    
  } catch (error: unknown) {
    console.error('❌ Error sending email:', error);
    
    // Fallback: log OTP if email fails
    console.log(`📝 OTP Fallback for ${email}: ${otp}`);
    
    throw new Error('Failed to send verification email');
  }
}