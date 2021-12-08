import {
  Controller,
  Post,
  Request,
  UseGuards,
  ValidationPipe,
  Body,
  Put,
  BadRequestException,
  Patch,
} from '@nestjs/common';
import { MailTemplateType } from 'src/mail/template';
import { MailService } from 'src/mail/mail.service';
import { MAIL_VERIFICATION_ENABLED } from 'src/utils/config';
import { UserService } from 'src/user/user.service';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { DevGuard } from 'src/utils/dev.guard';
import { MailTestDto } from './dto/mail-test.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { MailDto } from './dto/mail.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly mailService: MailService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiParam({
    name: 'mailID',
    description: '这是测试测试',
  })
  async login(@Request() req) {
    // local.strategy.ts handles the login, and authService only needs to sign the JWT
    return this.authService.sign(req.user);
  }

  @Post('mail')
  @ApiParam({
    name: 'mailID',
    description: '这是测试测试',
  })
  async sendMail(@Body(new ValidationPipe()) mail: MailDto) {
    // TODO(zhifeng): 实现 api rate limiter 防止恶意调用
    // requestVerification 已经实现了对于同一个邮箱地址不允许发送过多验证邮件，所以需要限制的是朝不同的邮箱发验证，这个需要结合 ip 地址和 mac 地址来限制
    await this.mailService.requestVerification(mail.type, mail.email);
  }

  @UseGuards(DevGuard)
  @Post('test-mail')
  @ApiParam({
    name: 'mailID',
    description: '这是测试测试',
  })
  async testMail(@Body() payload: MailTestDto) {
    await this.mailService.requestVerification(MailTemplateType.Test, payload.email);
  }

  @Post('register')
  @ApiParam({
    name: 'mailID',
    description: '这是测试测试',
  })
  async register(@Body(new ValidationPipe()) regd: RegisterDto) {
    if (MAIL_VERIFICATION_ENABLED) {
      const success = await this.mailService.verify(regd.email, regd.code.toString());
      if (!success) {
        throw new BadRequestException('验证码错误，或者已经失效');
      }
    }
    await this.authService.register(
      regd.name,
      regd.email,
      regd.password, // 靠HTTPS加密
    );
  }

  // forget password and then change through mail verification
  @Put('password')
  @ApiParam({
    name: 'mailID',
    description: '这是测试测试',
  })
  async resetPassword(@Body(new ValidationPipe()) dto: ResetPasswordDto) {
    const user = await this.userService.findUserByNameOrMail(dto.email);
    if (MAIL_VERIFICATION_ENABLED) {
      const success = await this.mailService.verify(dto.email, dto.code.toString());
      if (!success) {
        throw new BadRequestException('验证码错误，或者已经失效');
      }
    }
    return this.authService.resetPassword(user.id, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('password')
  @ApiParam({
    name: 'mailID',
    description: '这是测试测试',
  })
  async changePassword(@Body(new ValidationPipe()) dto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(req.user.id, dto.oldPassword, dto.newPassword);
  }
}
