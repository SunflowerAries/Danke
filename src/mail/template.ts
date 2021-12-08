import * as hbs from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';

export enum MailTemplateType {
  Test = 'test',
  Register = 'register',
  ResetPassword = 'reset',
}

export interface MailTemplate {
  type: MailTemplateType;
  subject: string;
  template: any;
  defaultArgs: object;
}

function makeTemplate(tp: MailTemplateType, subject: string, defaultArgs: object): MailTemplate {
  const templateStr = fs.readFileSync(join(__dirname, '..', '..', 'views', 'mail', `${tp}.hbs`)).toString();
  const template = hbs.compile(templateStr);
  return {
    type: tp,
    template,
    subject,
    defaultArgs,
  };
}

const templates = new Map([
  [
    MailTemplateType.Test,
    makeTemplate(MailTemplateType.Test, 'An email from fdxk.info', { code: 123456, receiver: 'test' }),
  ],
  [
    MailTemplateType.Register,
    makeTemplate(MailTemplateType.Register, 'Welcome to fdxk.info', { code: 123456, receiver: 'test' }),
  ],
  [
    MailTemplateType.ResetPassword,
    makeTemplate(
      MailTemplateType.ResetPassword,
      'Reset password on fdxk.info',

      {
        code: 123456,
        receiver: 'test',
      },
    ),
  ],
]);

export function getTemplate(tp: MailTemplateType): MailTemplate {
  return templates.get(tp);
}

export function render(tp: MailTemplateType, args?: object): string {
  const template = templates.get(tp);
  return template.template(args || template.defaultArgs);
}
