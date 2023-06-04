import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from './database/database.module';
import { MailModule } from './mail/mail.module';
import { StoreService } from './store.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    DatabaseModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [AppService, StoreService],
})
export class AppModule {}
