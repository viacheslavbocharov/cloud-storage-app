import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Body,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileUploadInterceptor } from './interceptors/file-upload.interceptor';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'file-service' };
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileUploadInterceptor)
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req,
    @Body('folderId') folderId: string,
  ) {
    const userId = req.user?.sub;
    return this.fileService.saveFileMetadata(file, userId, folderId);
  }
}
