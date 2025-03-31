import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileUploadInterceptor } from './interceptors/file-upload.interceptor';

@UseGuards(AuthGuard)
@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'file-service' };
  }

  @Post('upload')
  @UseInterceptors(FileUploadInterceptor)
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Req() req) {
    return this.fileService.saveFileMetadata(file, req.user.userId);
  }
}
