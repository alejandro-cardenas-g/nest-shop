import {
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { productFileMimeTypes } from '../constants/acceptedMimeTypes.constant';

export const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file)
    return callback(new BadRequestException('File must not be empty'), false);
  if (!productFileMimeTypes.includes(file.mimetype))
    return callback(
      new UnprocessableEntityException('File must be an image'),
      false,
    );
  return callback(null, true);
};
