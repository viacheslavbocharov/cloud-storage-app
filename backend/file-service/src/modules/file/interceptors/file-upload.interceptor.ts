import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Observable } from 'rxjs';
import * as fs from 'fs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    // Убедимся, что временная папка существует
    const tempDir = './temp';
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const storage = diskStorage({
      destination: tempDir,
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
      },
    });

    const interceptor = new (FileInterceptor('file', { storage }))();
    await interceptor.intercept(context, next);

    return next.handle();
  }
}
