import { getTemplate, render } from './template';
import * as winston from 'winston';
import { OnQueueActive, OnQueueCompleted, OnQueueFailed, Process, Processor } from '@nestjs/bull';
import { SendMailJob, VERIFICATION_QUEUE } from './mail.service';
import { Job } from 'bull';
import Mail = require('nodemailer/lib/mailer');
import { Inject } from '@nestjs/common';
import { Mailer } from './mailer';

export const MAILERS_TOKEN = 'PROCESSOR_MAILERS';

@Processor(VERIFICATION_QUEUE)
export class MailProcessor {
  private readonly logger = winston.loggers.get('customLogger');

  constructor(@Inject(MAILERS_TOKEN) private readonly mailers: Mailer[]) {}

  @Process()
  async send(job: Job<SendMailJob>) {
    this.logger.info(`send ${JSON.stringify(job)}`);
    const { type, ...args } = job.data;
    let id = 0;
    let earliest = this.mailers[id].nextReady();
    for (let i = 1; i < this.mailers.length; i++) {
      const next = this.mailers[i].nextReady();
      if (next < earliest) {
        earliest = next;
        id = i;
      }
    }

    const mailer = this.mailers[id];
    const { subject } = getTemplate(type);
    await mailer.send(args.receiver, subject, render(type, args));
    return {};
  }

  @OnQueueActive()
  onActive(job: Job) {
    this.logger.debug(`Processing job ${job.id} of type ${job.name}. Data: ${JSON.stringify(job.data)}`);
  }

  @OnQueueCompleted()
  onComplete(job: Job, result: any) {
    this.logger.debug(`Completed job ${job.id} of type ${job.name}. Result: ${JSON.stringify(result)}`);
  }

  @OnQueueFailed()
  onError(job: Job<any>, error: any) {
    this.logger.error(`Failed job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  }
  // @OnQueueWaiting()
  // onWaiting(job: Job<any>, error: any) {
  //   this.logger.error(`Waiting job ${job.id} of type ${job.name}: ${error.message}`, error.stack);
  // }
}
