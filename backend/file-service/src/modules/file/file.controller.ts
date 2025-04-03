import {
  Controller,
  Get,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileUploadManyInterceptor } from './interceptors/file-upload-many.interceptor';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { rawMulter } from './middleware/raw-multer.middleware';
import { rawUploadMiddleware } from './middleware/raw-upload.middleware';
import { Request, Response } from 'express';

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
}


//   async uploadFolder(
//     @UploadedFiles() files: Express.Multer.File[],
//     @Req() req,
//     @Body('folderId') folderId: string,
//   ) {
//     const userId = req.user?.sub;

//     return this.fileService.handleFolderUpload(
//       files,
//       userId,
//       folderId ?? null,
//     );
//   }
// }
