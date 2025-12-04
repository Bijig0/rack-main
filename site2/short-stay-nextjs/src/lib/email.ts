import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  name: string;
  otp: string;
}

export class Email {
  private to: string;
  private name: string;
  private otp: string;
  private from: string;

  constructor(options: EmailOptions) {
    this.to = options.to;
    this.name = options.name;
    this.otp = options.otp;
    this.from = process.env.EMAIL_SENDER || 'Short Stay <noreply@shortstay.com>';
  }

  private createTransport() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async sendRegisterOtp(): Promise<void> {
    const transporter = this.createTransport();

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Verify Your Email - Short Stay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Welcome to Short Stay!</h2>
          <p>Hello ${this.name},</p>
          <p>Your verification code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #6366f1; letter-spacing: 8px; margin: 0;">${this.otp}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Short Stay Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }

  async sendPasswordReset(): Promise<void> {
    const transporter = this.createTransport();

    const mailOptions = {
      from: this.from,
      to: this.to,
      subject: 'Password Reset - Short Stay',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #6366f1;">Password Reset Request</h2>
          <p>Hello ${this.name},</p>
          <p>Your password reset code is:</p>
          <div style="background-color: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
            <h1 style="color: #6366f1; letter-spacing: 8px; margin: 0;">${this.otp}</h1>
          </div>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <br>
          <p>Best regards,<br>Short Stay Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  }
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
