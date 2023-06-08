import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmailOtpDto } from './dto/email-otp.dto';
import { IUserStore, StoreService } from './store.service';
import { AppModule } from './app.module';

describe('AppController', () => {
  let appController: AppController;
  let appService: AppService;
  let storeService: StoreService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [AppController],
      providers: [StoreService, AppService],
    }).compile();

    appController = moduleRef.get<AppController>(AppController);
    appService = moduleRef.get<AppService>(AppService);
    storeService = moduleRef.get<StoreService>(StoreService);
  });

  describe('sendOtpEmail', () => {
    const emailBody: EmailOtpDto = {
      email: 'testing@gmail.com',
      name: 'Testing',
    };

    it('should return STATUS_EMAIL_INVALID when invalid email', async () => {
      const result = {
        status: 'STATUS_EMAIL_INVALID',
      };

      jest.spyOn(appService, 'sendOtpEmail').mockResolvedValueOnce(result);
      expect(await appController.emailOtp(emailBody)).toBe(result);
    });

    it('should return STATUS_EMAIL_OK when email', async () => {
      emailBody.email = 'testing@dso.org.sg';
      const result = {
        status: 'STATUS_EMAIL_OK',
      };

      jest.spyOn(appService, 'sendOtpEmail').mockResolvedValueOnce(result);
      expect(await appController.emailOtp(emailBody)).toBe(result);
    });

    it('should return STATUS_EMAIL_FAIL when failed', async () => {
      emailBody.email = 'testing@dso.org.sg';
      const result = {
        status: 'STATUS_EMAIL_FAIL',
      };

      jest.spyOn(appService, 'sendOtpEmail').mockResolvedValueOnce(result);
      expect(await appController.emailOtp(emailBody)).toBe(result);
    });
  });

  describe('verifyEmailOtp', () => {
    const verifyEmailBody: EmailOtpDto = {
      email: 'testing@@dso.org.sg',
      otp: 123456,
    };

    it('should return STATUS_OTP_OK when valid otp and email', async () => {
      const result = {
        status: 'STATUS_OTP_OK',
      };

      jest
        .spyOn(appService, 'verifyOtpEmail')
        .mockReturnValue(Promise.resolve(result));
      expect(await appController.verifyEmailOtp(verifyEmailBody)).toBe(result);
    });

    it('should return STATUS_OTP_FAIL when invalid otp', async () => {
      verifyEmailBody.otp = 123451;

      const result = {
        status: 'STATUS_OTP_FAIL',
      };

      const otpData: IUserStore = {
        email: verifyEmailBody.email,
        otp: verifyEmailBody.otp,
        sentTime: new Date(),
        limit: 0,
      };

      storeService.setData({
        [verifyEmailBody.email]: otpData,
      });

      jest.spyOn(storeService, 'getData').mockReturnValue(otpData);

      jest.spyOn(appService, 'verifyOtpEmail').mockResolvedValueOnce(result);
      expect(await appController.verifyEmailOtp(verifyEmailBody)).toBe(result);
    });

    it('should return STATUS_OTP_TIMEOUT when otp sent time is greater than 1 minutes', async () => {
      verifyEmailBody.email = 'testing@dso.org.sg';

      const result = {
        status: 'STATUS_OTP_TIMEOUT',
      };

      const otpData: IUserStore = {
        email: verifyEmailBody.email,
        otp: verifyEmailBody.otp,
        sentTime: new Date('07/06/2023, 21:46:30'),
        limit: 0,
      };

      storeService.setData({
        [verifyEmailBody.email]: otpData,
      });

      jest.spyOn(appService, 'sendOtpEmail').mockResolvedValueOnce(result);
      expect(await appController.emailOtp(verifyEmailBody)).toBe(result);
    });
  });
});
