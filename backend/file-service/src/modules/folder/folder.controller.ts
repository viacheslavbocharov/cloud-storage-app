import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  Res,
  UseGuards,
  Query,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { AuthGuard } from '../../guards/auth.guard';
import { rawUploadMiddleware } from './middleware/raw-upload.middleware';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateFolderDto, @Req() req) {
    const userId = req.user?.sub;
    return this.folderService.create(dto, userId);
  }

  @UseGuards(AuthGuard)
  @Get('contents')
  async getContents(@Req() req, @Query('folderId') folderId: string) {
    return this.folderService.findContents(req.user?.sub, folderId ?? null);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async getById(@Req() req, @Param('id') id: string) {
    const ownerId = req.user?.sub;
    return this.folderService.findById(id, ownerId);
  }

  @UseGuards(AuthGuard)
  @Patch(':id/share')
  async shareFolder(@Param('id') id: string, @Req() req) {
    const ownerId = req.user?.sub;
    return this.folderService.shareFolder(id, ownerId);
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

      const result = await this.folderService.handleFolderUpload(
        files,
        userId,
        folderId,
      );

      res.json(result);
    });
  }

  @UseGuards(AuthGuard)
  @Get(':id/download')
  async downloadFolder(@Param('id') id: string, @Req() req, @Res() res) {
    const ownerId = req.user?.sub;
    return this.folderService.downloadFolderAsZip(id, ownerId, res);
  }

  @Get('shared/:token')
  async downloadSharedFolder(@Param('token') token: string, @Res() res) {
    return this.folderService.downloadSharedFolder(token, res);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updateFolder(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: UpdateFolderDto,
  ) {
    const ownerId = req.user?.sub;
    return this.folderService.updateFolder(id, ownerId, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteFolder(@Param('id') id: string, @Req() req) {
    const ownerId = req.user?.sub;
    return this.folderService.softDeleteFolder(id, ownerId);
  }

  @UseGuards(AuthGuard)
  @Post(':id/restore')
  async restoreFolder(@Param('id') id: string, @Req() req) {
    const ownerId = req.user?.sub;
    return this.folderService.restoreFolder(id, ownerId);
  }
}
