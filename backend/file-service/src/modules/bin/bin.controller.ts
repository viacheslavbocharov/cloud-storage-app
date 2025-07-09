import {
  Controller,
  Get,
  Query,
  Req,
  UseGuards,
  Post,
  Body,
} from '@nestjs/common';
import { BinService } from './bin.service';
import { AuthGuard } from '../../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('bin')
export class BinController {
  constructor(private readonly binService: BinService) {}

  @Get()
  async getTrash(@Req() req, @Query('folderId') folderId?: string) {
    const ownerId = req.user?.sub;
    return this.binService.findTrash(ownerId, folderId ?? null);
  }

  @Post('restore')
  async restore(
    @Req() req,
    @Body() body: { items: { id: string; type: 'file' | 'folder' }[] },
  ) {
    const ownerId = req.user?.sub;
    await this.binService.restoreItems(ownerId, body.items);
    return { success: true };
  }
}
