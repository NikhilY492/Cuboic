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
import { fileTypeFromBuffer } from 'file-type';
import { readFileSync } from 'fs';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const UPLOAD_DIR = join(process.cwd(), 'uploads');

// Ensure the uploads directory exists at startup
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
          cb(null, `${uniqueSuffix}$`);
        },
      }),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
      fileFilter: (_req, file, cb) => {
  const allowedMimeTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return cb(new BadRequestException('Invalid file type'), false);
  }

  cb(null, true);
},
    }),
  )
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
  if (!file) throw new BadRequestException('No file provided');

  const buffer = readFileSync(file.path);
  const type = await fileTypeFromBuffer(buffer);

  const allowed = ['image/jpeg', 'image/png', 'image/webp'];

  if (!type || !allowed.includes(type.mime)) {
    throw new BadRequestException('Invalid or corrupted image file');
  }

  const baseUrl = process.env.API_BASE_URL ?? 'https://api.thambi.in';
  return { url: `${baseUrl}/uploads/${file.filename}` };
}
}
