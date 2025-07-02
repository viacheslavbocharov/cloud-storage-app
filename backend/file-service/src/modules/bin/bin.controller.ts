import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
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
}
