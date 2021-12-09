import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class JwtRetDto {
  @ApiProperty({
    description: 'jwt token',
    example: 'erysasaxzcxzc',
  })
  @IsString()
  access_token: string;

  @ApiProperty({
    description: '验证邮箱',
    example: '17307130191@fudan.edu.cn',
  })
  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;

  @ApiProperty({
    description: '用户名',
    example: 'pink',
  })
  @IsString()
  @MinLength(1, { message: '用户名太短啦！至少 1 个字符哦！' })
  @MaxLength(30, { message: '用户名太长啦！最多 30 个字符哦！' })
  name: string;
}
