import {
    Controller, Post, UploadedFile, UseInterceptors, UseGuards, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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
                    cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
                },
            }),
            limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB max
            fileFilter: (_req, file, cb) => {
                const allowed = /jpeg|jpg|png|webp/;
                const ext = extname(file.originalname).toLowerCase().slice(1);
                if (allowed.test(ext)) {
                    cb(null, true);
                } else {
                    cb(new BadRequestException('Only JPEG, PNG, and WebP images are allowed'), false);
                }
            },
        }),
    )
    uploadImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) throw new BadRequestException('No file provided');
        const baseUrl = process.env.API_BASE_URL ?? 'https://api.thambi.in';
        return { url: `${baseUrl}/uploads/${file.filename}` };
    }
}
