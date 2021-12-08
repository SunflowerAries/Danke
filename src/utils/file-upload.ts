import { BadRequestException } from '@nestjs/common';

export const imageFilter = (req, file, cb) => {
  if (file.mimetype.match(/^image\//)) {
    // accept image file
    cb(null, true);
  } else {
    // decline file upload
    cb(new BadRequestException('只能上传图片！'), false);
  }
};
