import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
  Body,
  BadRequestException,
  Param,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileUploadManyInterceptor } from './interceptors/file-upload-many.interceptor';
import { rawUploadMiddleware } from './middleware/raw-upload.middleware';

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

  @UseGuards(AuthGuard)
  @Post('upload-folder')
  async uploadFolder(@Req() req, @Res() res) {
    rawUploadMiddleware(req, res, async () => {
      const userId = req.user?.sub;
      const folderId =
        req.body.folderId && req.body.folderId !== 'null'
          ? req.body.folderId
          : null;
      const files = req.files;

      const result = await this.fileService.handleFolderUpload(
        files,
        userId,
        folderId,
      );

      res.json(result);
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Req() req, @Param('id') id: string) {
    const ownerId = req.user?.sub;
    return this.fileService.findById(id, ownerId);
  }
}
