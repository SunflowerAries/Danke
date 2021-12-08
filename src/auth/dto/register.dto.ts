import { IsString, MinLength, MaxLength, IsEmail, IsAlphanumeric } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: '注册用户名',
    example: 'pink',
  })
  @IsString()
  @IsAlphanumeric()
  @MinLength(1, { message: '用户名太短啦！至少 1 个字符哦！' })
  @MaxLength(30, { message: '用户名太长啦！最多 30 个字符哦！' })
  name: string;

  // @ApiProperty({
  //   description: '验证码',
  // })
  // @IsNumber()
  // @Min(100000)
  // @Max(999999)
  // code: number;

  @ApiProperty({
    description: '密码',
    example: 'fdupink',
  })
  @IsString()
  @MinLength(6, { message: '密码太短啦！至少 6 个字符哦！' })
  @MaxLength(32, { message: '密码太长啦！最多 32 个字符哦！' })
  password: string;

  @ApiProperty({
    description: '邮箱',
    example: 'pink@fdpink.com',
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;
}
