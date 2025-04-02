import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileUploadManyInterceptor } from './interceptors/file-upload-many.interceptor';

@Controller('files')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok', service: 'file-service' };
  }

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileUploadManyInterceptor)
  async uploadMany(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('folderId') folderId: string,
    @Req() req,
  ) {
    const userId = req.user?.sub;
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    const results = await Promise.all(
      files.map((file) =>
        this.fileService.saveFileMetadata(file, userId, folderId),
      ),
    );

    return results;
  }
}
