import { BadRequestException, Inject, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user';
import { UserService } from 'src/user/user.service';
import { verifyPassword, saltHashPassword } from '../utils/salt';
import { JwtPayload } from './jwt.strategy';
import { JwtRetDto } from './dto/jwt-ret.dto';
import { RoleType } from '../entities/user';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import axios, { AxiosResponse } from 'axios';
import { ElearningRespondsDto } from './dto/elearning-verify.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly loggerService: Logger,
  ) {}

  async validateUser(nameOrMail: string, pass: string): Promise<User> {
    const user = await this.userService.findUserByNameOrMail(nameOrMail);
    if (verifyPassword(pass, user.saltedPassword)) {
      return user;
    }
    throw new NotAcceptableException('密码错误');
  }

  async sign(user: User) {
    // we choose a property name of sub to hold our user.id value to be consistent with JWT standards
    // add activated to payload
    const payload: JwtPayload = { name: user.name, sub: String(user.id) + Number(user.role === RoleType.Activated) };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
    } as JwtRetDto;
  }

  async register(name: string, email: string, password: string) {
    await this.userService.createNewUser(name, email, saltHashPassword(password));
  }

  async resetPassword(userId: number, password: string) {
    await this.userService.updateUserPassword(userId, saltHashPassword(password));
  }

  async resetMail(userId: number, mail: string) {
    await this.userService.updateUserMail(userId, mail);
  }

  async changePassword(userId: number, oldPassword: string, newPassowrd: string) {
    const user = await this.userService.findUserById(userId);
    if (verifyPassword(oldPassword, user.saltedPassword)) {
      return this.userService.updateUserPassword(userId, saltHashPassword(newPassowrd));
    }
    throw new BadRequestException('旧密码错误');
  }

  async verifyElearning(token: string) {
    const responds = await axios
      .get('https://elearning.fudan.edu.cn/api/v1/users/self/profile', {
        params: {
          access_token: token,
        },
      })
      .then(function (response: AxiosResponse<ElearningRespondsDto>) {
        const data = response.data;
        return {
          real_name: data.name,
          fudan_id: data.login_id,
        };
      })
      .catch(function (error) {
        console.log(error);
      });
    return responds;
  }
}
