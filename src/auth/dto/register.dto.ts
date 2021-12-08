import { IsString, MinLength, MaxLength, IsNumber, Min, Max, IsEmail, Contains, IsAlphanumeric } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: '注册用户名',
  })
  @IsString()
  @IsAlphanumeric()
  @MinLength(1)
  @MaxLength(30)
  name: string;

  @ApiProperty({
    description: '验证码',
  })
  @IsNumber()
  @Min(100000)
  @Max(999999)
  code: number;

  @ApiProperty({
    description: '密码',
  })
  @IsString()
  @MaxLength(32, { message: '密码太长啦！最多 32 个字符哦！' })
  @MinLength(6, { message: '密码太短啦！至少 6 个字符哦！' })
  password: string;

  @ApiProperty({
    description: '邮箱',
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  @Contains('@fudan.edu.cn')
  email: string;
}
