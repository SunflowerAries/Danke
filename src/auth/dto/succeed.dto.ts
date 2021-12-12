import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SucceedDto {
  @ApiProperty({
    description: '回复',
    example: '1.验证码已发送至您的邮箱中请注意查收\n2.验证成功\n3.注册成功\n4.邮箱重置成功\n5.密码重置成功',
  })
  @IsString()
  message: string;
}
