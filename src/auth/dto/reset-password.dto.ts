import { IsString, MaxLength, IsNumber, Min, Max, IsEmail, Contains } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsNumber()
  @Min(100000)
  @Max(999999)
  code: number;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  @IsEmail()
  @MaxLength(64)
  @Contains('@fudan.edu.cn')
  email: string;
}
