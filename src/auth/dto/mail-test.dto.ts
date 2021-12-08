import { IsString, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MailTestDto {
  // @IsString()
  // @MinLength(1)
  // @MaxLength(40940)
  // name: string;
  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(64)
  email: string;
}
