import { Body, Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { EmailOtpDto } from './dto/email-otp.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/v1/send/email-otp')
  async emailOtp(@Body() body: EmailOtpDto): Promise<any> {
    return this.appService.sendOtpEmail({
      email: body.email,
    });
  }

  @Post('/v1/verify/email-otp')
  async verifyEmailOtp(@Body() body: EmailOtpDto): Promise<any> {
    return this.appService.verifyOtpEmail({
      otp: body.otp,
      email: body.email,
    });
  }
}
