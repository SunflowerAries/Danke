import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, IsEmail, Matches } from 'class-validator';

export class MailActivateDto {
  @ApiProperty({
    description: '验证邮箱（需要学邮）',
    example: '17307130191@fudan.edu.cn',
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  @Matches(/@fudan.edu.cn|@m.fudan.edu.cn/, { message: '邮箱验证需使用复旦学邮' })
  email: string;
}
