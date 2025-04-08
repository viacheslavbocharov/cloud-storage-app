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


@Controller()
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly proxy: FetchProxyService,
  ) {}

  // 🔹 FILE ROUTES

  @Post('files/upload')
  async uploadFiles(@Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/upload`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Get('files/:id')
  async getFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Get('files/:id/download')
  async downloadFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}/download`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch('files/:id/share')
  async shareFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}/share`;
    return this.proxy.forward('PATCH', url, null, req.headers);
  }

  @Get('files/shared/:token')
  async downloadSharedFile(@Param('token') token: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/shared/${token}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch('files/:id')
  async updateFile(@Param('id') id: string, @Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}`;
    return this.proxy.forward('PATCH', url, body, req.headers);
  }

  @Delete('files/:id')
  async deleteFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}`;
    return this.proxy.forward('DELETE', url, null, req.headers);
  }

  @Post('files/:id/restore')
  async restoreFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}/restore`;
    return this.proxy.forward('POST', url, null, req.headers);
  }

  // 🔹 FOLDER ROUTES

  @Post('folders')
  async createFolder(@Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Get('folders/contents')
  async getFolderContents(@Query('folderId') folderId: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/contents?folderId=${folderId ?? ''}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Get('folders/:id')
  async getFolderById(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch('folders/:id/share')
  async shareFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/share`;
    return this.proxy.forward('PATCH', url, null, req.headers);
  }

  @Post('folders/upload-folder')
  async uploadFolder(@Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/upload-folder`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Get('folders/:id/download')
  async downloadFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/download`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Get('folders/shared/:token')
  async downloadSharedFolder(@Param('token') token: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/shared/${token}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch('folders/:id')
  async updateFolder(@Param('id') id: string, @Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('PATCH', url, body, req.headers);
  }

  @Delete('folders/:id')
  async deleteFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('DELETE', url, null, req.headers);
  }

  @Post('folders/:id/restore')
  async restoreFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/restore`;
    return this.proxy.forward('POST', url, null, req.headers);
  }

  // 🔹 SEARCH ROUTE

  @Get('search')
  async search(@Query('query') query: string, @Query('isDeleted') isDeleted: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/search?query=${query}&isDeleted=${isDeleted}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }
}
