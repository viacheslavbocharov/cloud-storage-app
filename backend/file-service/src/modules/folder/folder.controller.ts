import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  Query,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { CreateFolderDto } from './dto/create-folder.dto';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('folders')
export class FolderController {
  constructor(private readonly folderService: FolderService) {}

  @Post()
  async create(@Body() dto: CreateFolderDto, @Req() req) {
    return this.folderService.create(dto, req.user.userId);
  }

  @Get('contents')
  async getContents(@Req() req, @Query('folderId') folderId: string) {
    return this.folderService.findContents(req.user.userId, folderId ?? null);
  }
}
