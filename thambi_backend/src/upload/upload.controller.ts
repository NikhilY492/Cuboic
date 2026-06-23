import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileTypeFromFile } from 'file-type';
import { extname, join } from 'path';
import { existsSync, mkdirSync, unlinkSync } from 'fs';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Controller('upload')
@UseGuards(JwtAuthGuard)
export class UploadController {
  @Post('image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: UPLOAD_DIR,
        filename: (_req, file, cb) => {
          const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
          const safeExt = extname(file.originalname) || '.bin';
          cb(null, `${uniqueSuffix}${safeExt}`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          return cb(new BadRequestException('Invalid file type'), false);
        }

        cb(null, true);
      },
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    let type;
    try {
      type = await fileTypeFromFile(file.path);
    } catch {
      unlinkSync(file.path);
      throw new BadRequestException('Unable to verify file type');
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (!type || !allowedTypes.includes(type.mime)) {
      unlinkSync(file.path);
      throw new BadRequestException('Invalid or corrupted image file');
    }

    const baseUrl = process.env.API_BASE_URL ?? 'https://api.thambi.in';

    return {
      url: `${baseUrl}/uploads/${file.filename}`,
    };
  }
}
