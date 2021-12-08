import {
  Controller,
  UseGuards,
  Post,
  Param,
  ValidationPipe,
  Req,
  Get,
  Patch,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import * as winston from 'winston';
import { UserService } from './user.service';
import { GetUserInfoResponse } from './dto/user-info.get.response';
import { PatchUserInfoRequest } from './dto/user-info.patch.request';
import diskStorage from '../utils/disk';
import { AVATAR_IMAGE_SIZE_LIMIT, UPLOAD_LOCATION } from '../utils/config';
import { imageFilter } from '../utils/file-upload';
import { FileService } from '../storage/file.service';

@UseGuards(AuthGuard('jwt'))
@ApiTags('users')
@Controller('users')
export class UserController {
  private readonly logger = winston.loggers.get('customLogger');

  constructor(private readonly user: UserService, private readonly file: FileService) {}

  @Get(':id')
  @ApiParam({
    name: '获取用户个人信息',
    description: "返回个人信息。权限：获取非本人个人信息时，所获取的邮件为空字符串('')。",
  })
  async getUserInfo(@Param('id') id: number, @Req() req) {
    this.logger.info(`{GET users/:id(${id})} from [user:${req.user.id}]`);
    const user = await this.user.findUserById(id);
    if (user.id !== req.user.id) {
      user.email = '';
    }
    const resp: GetUserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickName,
      avatar: user.avatar,
      bio: user.bio,
      fans: 0,
      watchees: 0,
      watchers: 0,
    };
    return resp;
  }

  @Patch()
  @ApiParam({
    name: '修改用户个人信息',
    description: '修改用户个人信息，并返回修改之后的个人信息。权限：只允许修改本人的个人信息。',
  })
  async modifyUserInfo(
    @Body(new ValidationPipe()) patchReq: PatchUserInfoRequest,
    @Req() req,
  ): Promise<GetUserInfoResponse> {
    this.logger.info(`{PATCH users/:id(${req.user.id})} `);
    const user = await this.user.modifyUserInfo(req.user.id, patchReq);
    const resp: GetUserInfoResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      nickname: user.nickName,
      avatar: user.avatar,
      bio: user.bio,
      fans: 0,
      watchees: 0,
      watchers: 0,
    };
    return resp;
  }

  /** @brief upload and change user avatar
   * @param[in] file
   * @return user profile
   *  {
   *    id: INT,
   *    name: string,
   *    email: string,
   *    nickName: string,
   *    avatar: string,
   *    bio: string
   *  }
   * @tutorial https://dev.gkzhb.top/backend/nestjs#%E6%96%87%E4%BB%B6%E4%B8%8A%E4%BC%A0
   */
  @Post('profile/avatar')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: `${UPLOAD_LOCATION}/avatar`,
      }),
      fileFilter: imageFilter,
      limits: {
        fileSize: AVATAR_IMAGE_SIZE_LIMIT, // max file size
      },
    }),
  )
  async uploadAvatar(@UploadedFile() file, @Req() req) {
    // 这里没有在数据库中保存 UPLOAD_LOCATION 考虑到今后如果迁移 UPLOAD_LOCATION，这样不需要修改数据库
    await this.file.uploadFile(req.user.id, `/avatar/${file.filename}`);
    return this.user.setAvatar(req.user.id, `/file/avatar/${file.filename}`);
  }
}
