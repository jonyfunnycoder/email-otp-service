import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { generate } from 'otp-generator';
import { ISendEMailConfType } from 'src/types/send-email.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  generateOtp(): string {
    return generate(6, {
      specialChars: false,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      digits: true,
    });
  }

  isValidEmail(email: string): boolean {
    const pattern = new RegExp(/^[A-Za-z0-9._%+-]+@dso.org\.sg$/);
    return !pattern.test(email);
  }

  async sendEmail(conf: ISendEMailConfType): Promise<any> {
    this.mailerService.sendMail({
      to: conf.email,
      subject: conf.subject,
      html: `<!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Email otp</title>
      </head>
      <body>
        <p>Hey ${conf.context.name},</p>
        <p>You OTP Code is ${this.generateOtp()}. The code is valid for 1 minute</p>
      </body>
      </html>`,
    });
  }
}
