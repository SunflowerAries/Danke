import { BadRequestException, Injectable, NotAcceptableException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user';
import { UserService } from 'src/user/user.service';
import { verifyPassword, saltHashPassword } from '../utils/salt';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private readonly jwtService: JwtService) {}

  async validateUser(nameOrMail: string, pass: string): Promise<User> {
    const user = await this.userService.findUserByNameOrMail(nameOrMail);
    if (verifyPassword(pass, user.saltedPassword)) {
      return user;
    }
    throw new NotAcceptableException('密码错误');
  }

  async sign(user: User) {
    // we choose a property name of sub to hold our user.id value to be consistent with JWT standards
    const payload: JwtPayload = { name: user.name, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      email: user.email,
      name: user.name,
    };
  }

  async register(name: string, email: string, password: string) {
    await this.userService.createNewUser(name, email, saltHashPassword(password));
  }

  async resetPassword(userId: number, password: string) {
    await this.userService.updateUserPassword(userId, saltHashPassword(password));
  }

  async changePassword(userId: number, oldPassword: string, newPassowrd: string) {
    const user = await this.userService.findUserById(userId);
    if (verifyPassword(oldPassword, user.saltedPassword)) {
      return this.userService.updateUserPassword(userId, saltHashPassword(newPassowrd));
    }
    throw new BadRequestException('旧密码错误');
  }
}