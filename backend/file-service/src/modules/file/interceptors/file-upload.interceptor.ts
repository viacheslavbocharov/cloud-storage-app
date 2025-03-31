import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { Observable } from 'rxjs';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  constructor(private readonly configService: ConfigService) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const storage = diskStorage({
      destination: this.configService.get<string>('UPLOAD_FOLDER') || './uploads',
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, `${uuidv4()}${ext}`);
      },
    });

    // ✅ создаём экземпляр интерцептора
    const interceptor = new (FileInterceptor('file', { storage }))();

    // ✅ вызываем его метод intercept
    await interceptor.intercept(context, next);

    return next.handle();
  }
}
