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
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DevGuard } from 'src/utils/dev.guard';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { AuthService } from './auth.service';
import { MailActivateDto } from './dto/mail-activate.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { HttpStatus } from '@nestjs/common';

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
  async login(@Request() req) {
    // local.strategy.ts handles the login, and authService only needs to sign the JWT
    return this.authService.sign(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Post('mail')
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '1.该邮箱地址申请了太多验证码，请检查邮箱或者耐心等待邮件\n2.系统繁忙中，请稍后再试',
  })
  @ApiBody({ description: '邮箱验证', type: MailActivateDto })
  async sendMail(@Body(new ValidationPipe()) mail: MailActivateDto) {
    // TODO(zhifeng): 实现 api rate limiter 防止恶意调用
    // requestVerification 已经实现了对于同一个邮箱地址不允许发送过多验证邮件，所以需要限制的是朝不同的邮箱发验证，这个需要结合 ip 地址和 mac 地址来限制
    await this.mailService.requestVerification(MailTemplateType.Activate, mail.email);
  }

  @UseGuards(DevGuard)
  @Post('test-mail')
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: '1.该邮箱地址申请了太多验证码，请检查邮箱或者耐心等待邮件\n2.系统繁忙中，请稍后再试',
  })
  @ApiBody({ description: '邮箱验证测试', type: MailActivateDto })
  async testMail(@Body(new ValidationPipe()) mail: MailActivateDto) {
    await this.mailService.requestVerification(MailTemplateType.Test, mail.email);
  }

  @Post('register')
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '用户名或邮箱已经被占用',
  })
  @ApiBody({ description: '用户注册', type: RegisterDto })
  async register(@Body(new ValidationPipe()) regd: RegisterDto) {
    // if (MAIL_VERIFICATION_ENABLED) {
    //   const success = await this.mailService.verify(regd.email, regd.code.toString());
    //   if (!success) {
    //     throw new BadRequestException('验证码错误，或者已经失效');
    //   }
    // }
    await this.authService.register(
      regd.name,
      regd.email,
      regd.password, // 靠HTTPS加密
    );
  }

  // forget password and then change through mail verification
  @Put('password')
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
  async changePassword(@Body(new ValidationPipe()) dto: ChangePasswordDto, @Request() req) {
    return this.authService.changePassword(req.user.id, dto.oldPassword, dto.newPassword);
  }
}
