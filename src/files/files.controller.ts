import {
  Controller,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
} from '@nestjs/common';
import {
  Get,
  Param,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common/decorators';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { productFileMimeTypes } from './constants/acceptedMimeTypes.constant';
import { FilesService } from './files.service';
import { fileFilter } from './utils';
import { fileNamer } from './utils/fileNamer.util';
import { FileTypesValidator } from './validators/mimeTypes.validator';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './static/uploads',
        filename: fileNamer,
      }),
      fileFilter: fileFilter,
    }),
  )
  uploadFile(
    @UploadedFile()
    file: // new ParseFilePipe({
    //   validators: [
    //     new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
    //     new FileTypesValidator({
    //       acceptedTypes: productFileMimeTypes,
    //       errorMessage: 'Unsoported Format. File must be an image',
    //     }),
    //   ],
    //   fileIsRequired: true,
    //   errorHttpStatusCode: 400,
    // }),
    Express.Multer.File,
  ) {
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${
      file.filename
    }`;
    return { secureUrl };
  }

  @Get('product/:imageName')
  findProductImage(
    @Param('imageName') imageName: string,
    @Res() res: Response,
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    return res.status(200).sendFile(path);
  }
}
