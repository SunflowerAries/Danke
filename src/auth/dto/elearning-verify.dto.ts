import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class ElearningVerifyDto {
  @ApiProperty()
  @IsString()
  @MaxLength(64)
  token: string;
}

export class ElearningRespondsDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  login_id: string;
}
