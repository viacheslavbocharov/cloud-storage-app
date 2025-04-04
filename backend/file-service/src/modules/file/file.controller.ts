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
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';
import { FileService } from './file.service';
import { AuthGuard } from '../../guards/auth.guard';
import { FileUploadManyInterceptor } from './interceptors/file-upload-many.interceptor';
import { rawUploadMiddleware } from './middleware/raw-upload.middleware';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Controller('files')
export class FileController {
  constructor(
    private readonly fileService: FileService,
    private configService: ConfigService,
  ) {}

  // @Get('health')
  // healthCheck() {
  //   return { status: 'ok', service: 'file-service' };
  // }

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

  // @UseGuards(AuthGuard)
  // @Post('upload-folder')
  // async uploadFolder(@Req() req, @Res() res) {
  //   rawUploadMiddleware(req, res, async () => {
  //     const userId = req.user?.sub;
  //     const folderId =
  //       req.body.folderId && req.body.folderId !== 'null'
  //         ? req.body.folderId
  //         : null;
  //     const files = req.files;

  //     const result = await this.fileService.handleFolderUpload(
  //       files,
  //       userId,
  //       folderId,
  //     );

  //     res.json(result);
  //   });
  // }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Req() req, @Param('id') id: string) {
    const ownerId = req.user?.sub;
    return this.fileService.findById(id, ownerId);
  }

  @UseGuards(AuthGuard)
  @Get(':id/download')
  async downloadFile(@Req() req, @Res() res, @Param('id') id: string) {
    const userId = req.user?.sub;
    const file = await this.fileService.findById(id, userId);

    const uploadRoot =
      this.configService.get<string>('UPLOAD_FOLDER') || './uploads';
    const fullPath = path.join(uploadRoot, file.key);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    return res.download(fullPath, file.originalName);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/share')
  async shareFile(@Param('id') id: string, @Req() req) {
    const ownerId = req.user?.sub;
    return this.fileService.shareFile(id, ownerId);
  }

  @Get('shared/:token')
  async downloadSharedFile(@Param('token') token: string, @Res() res) {
    const file = await this.fileService.findBySharedToken(token);

    const uploadRoot =
      this.configService.get<string>('UPLOAD_FOLDER') || './uploads';
    const fullPath = path.join(uploadRoot, file.key);

    if (!fs.existsSync(fullPath)) {
      throw new NotFoundException('File not found');
    }

    return res.download(fullPath, file.originalName);
  }

  // @UseGuards(AuthGuard)
  // @Get('/folders/:id/download')
  // async downloadFolder(@Param('id') id: string, @Req() req, @Res() res) {
  //   const ownerId = req.user?.sub;
  //   return this.fileService.downloadFolderAsZip(id, ownerId, res);
  // }

  // @Get('/folders/shared/:token')
  // async downloadSharedFolder(@Param('token') token: string, @Res() res) {
  //   const folder = await this.folderModel.findOne({ sharedToken: token });
  //   if (!folder || folder.access !== 'link') {
  //     throw new BadRequestException('Invalid or expired link');
  //   }

  //   return this.fileService.downloadFolderAsZip(
  //     folder._id.toString(),
  //     folder.ownerId,
  //     res,
  //   );
  // }
}
