import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { Mail } from './entities/mail';
import { MailModule } from './mail/mail.module';
import { UserModule } from './user/user.module';
import { TYPEORM_CONFIG } from './utils/config';

@Module({
  imports: [TypeOrmModule.forRoot({ entities: [Mail], ...TYPEORM_CONFIG }), AuthModule, UserModule, MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
