import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mail } from 'src/entities/mail';
import { MAIL_QUEUE_TPS, REDIS_HOST, REDIS_PASS, REDIS_PORT } from 'src/utils/config';
import { MailService, VERIFICATION_QUEUE } from './mail.service';
import { MailProcessor, MAILERS_TOKEN } from './mail.processor';
import { Mailer } from './mailer';
import * as mg from 'nodemailer-mailgun-transport';
import { createTransport } from 'nodemailer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Mail], 'default'),
    BullModule.registerQueue({
      name: VERIFICATION_QUEUE,
      limiter: {
        max: MAIL_QUEUE_TPS,
        duration: 1000,
      },
      redis: {
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASS,
      },
    }),
  ],
  providers: [
    MailService,
    MailProcessor,
    {
      provide: MAILERS_TOKEN,
      // add mailer transport here, we don't use config because we might
      // have different transport supplier, which is hard to config.
      useValue: [
        new Mailer(
          createTransport({
            host: 'smtp-relay.sendinblue.com',
            port: 587,
            secure: false,
            auth: {
              user: 'ichneumon.hu@foxmail.com',
              pass: 'Eynp08R3MhrbP4xA',
            },
          }),
          'noreply@fdxk.info',
          300,
          100,
        ),
        new Mailer(
          createTransport(
            mg({
              auth: {
                api_key: '086c39cf2c69d7961ae659800e267a20-d5e69b0b-937f6cad',
                domain: 'mail.fdxk.info',
              },
            }),
          ),
          'noreply@mail.fdxk.info',
          1000,
          300,
        ),
      ],
    },
  ],
  exports: [TypeOrmModule, MailService, BullModule],
})
export class MailModule {}
