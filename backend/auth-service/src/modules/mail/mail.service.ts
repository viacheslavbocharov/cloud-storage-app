import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendVerificationLink(to: string, token: string) {
    const link = `${this.configService.get('FRONTEND_URL')}/auth/verify-registration?token=${token}`;

    const mailOptions = {
      from: `"Cloud Storage App"`,
      to,
      subject: 'Confirm your registration',
      html: `
        <p>Click the link below to complete your registration:</p>
        <a href="${link}">${link}</a>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: `"Cloud Storage App"`,
      to,
      subject: 'Reset Your Password',
      html: `
        <p>Hello! You requested a password reset.</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>This link will expire in 15 minutes.</p>
      `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
