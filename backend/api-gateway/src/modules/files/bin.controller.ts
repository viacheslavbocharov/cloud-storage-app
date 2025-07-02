import { Controller, Get, Req, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchProxyService } from 'src/common/proxy/fetch-proxy.service';

@Controller('bin')
export class BinController {
  constructor(
    private readonly proxy: FetchProxyService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  async getBin(
    @Req() req,
    @Query('folderId') folderId?: string,
  ) {
    const fileServiceUrl = this.configService.get('FILE_SERVICE_URL');
    const url = `${fileServiceUrl}/bin${folderId ? `?folderId=${folderId}` : ''}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }
}