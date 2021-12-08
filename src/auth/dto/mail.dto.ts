import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsEmail, Contains, IsEnum } from 'class-validator';
import { MailTemplateType } from 'src/mail/template';

export class MailDto {
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(64)
  @Contains('@fudan.edu.cn')
  email: string;

  @IsString()
  @IsEnum(MailTemplateType)
  type: MailTemplateType;
}
