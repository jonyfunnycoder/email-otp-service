import { Injectable } from '@nestjs/common';
import { EmailOtpDto } from './dto/email-otp.dto';
import { MailService } from './mail/mail.service';
import { ISendOtpEmailResp } from './types/send-email.type';
import { IUserStoreMap, StoreService } from './store.service';
import { differenceInMinutes } from 'date-fns';

@Injectable()
export class AppService {
  constructor(
    private readonly mailService: MailService,
    private readonly storeService: StoreService,
  ) {}

  async sendOtpEmail(body: EmailOtpDto): Promise<ISendOtpEmailResp> {
    const otp = this.mailService.generateOtp();
    return new Promise((resolve, reject) => {
      if (this.mailService.isValidEmail(body.email)) {
        return reject({
          status: 'STATUS_EMAIL_INVALID',
        });
      }

      this.mailService
        .sendEmail({
          email: body.email,
          subject: 'OTP from domain.com',
          templateName: 'otp.template.ejs',
          context: {
            name: 'Name',
            otp: otp,
          },
        })
        .then(() => {
          this.storeService.setData({
            [body.email as string]: {
              email: body.email,
              otp: otp,
              sentTime: new Date(),
            },
          } as unknown as IUserStoreMap);
          resolve({
            status: 'STATUS_EMAIL_OK',
          });
        })
        .catch(() => {
          reject({
            status: 'STATUS_EMAIL_FAIL',
          });
        });
    });
  }

  async verifyOtpEmail(body: EmailOtpDto): Promise<ISendOtpEmailResp> {
    const user = this.storeService.getData(body.email);

    return new Promise((resolve) => {
      const timeout = Math.abs(
        differenceInMinutes(new Date(user.sentTime), new Date()),
      );

      if ((user && parseInt(user.otp as any) !== body.otp) || user.limit > 10) {
        this.storeService.setData({
          [body.email as string]: {
            ...user,
            limit: user.limit + 1,
          },
        } as unknown as IUserStoreMap);

        return resolve({
          status: 'STATUS_OTP_FAIL',
        });
      }

      if (timeout >= 1) {
        return resolve({
          status: 'STATUS_OTP_TIMEOUT',
        });
      } else {
        return resolve({
          status: 'STATUS_OTP_OK',
        });
      }
    });
  }
}
