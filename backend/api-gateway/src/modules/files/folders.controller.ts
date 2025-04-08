import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Query,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FetchProxyService } from 'src/common/proxy/fetch-proxy.service';
import { Request, Response } from 'express';
import * as http from 'http';

@Controller('folders')
export class FoldersController {
  constructor(
    private readonly configService: ConfigService,
    private readonly proxy: FetchProxyService,
  ) {}

  @Post()
  async createFolder(@Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Get('/contents')
  async getFolderContents(@Query('folderId') folderId: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/contents?folderId=${folderId ?? ''}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Get('/:id')
  async getFolderById(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch('/:id/share')
  async shareFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/share`;
    return this.proxy.forward('PATCH', url, null, req.headers);
  }

  @Post('/upload-folder')
  async uploadFolder(@Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/upload-folder`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Get('/:id/download')
  async downloadFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/download`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Get('/shared/:token')
  async downloadSharedFolder(@Param('token') token: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/shared/${token}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch('/:id')
  async updateFolder(@Param('id') id: string, @Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('PATCH', url, body, req.headers);
  }

  @Delete('/:id')
  async deleteFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('DELETE', url, null, req.headers);
  }

  @Post('/:id/restore')
  async restoreFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/restore`;
    return this.proxy.forward('POST', url, null, req.headers);
  }

}
