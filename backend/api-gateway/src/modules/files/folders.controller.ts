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

  @Post() //+
  async createFolder(@Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders`;
    return this.proxy.forward('POST', url, body, req.headers);
  }

  @Get('/contents') //+
  async getFolderContents(@Query('folderId') folderId: string, @Req() req) {
    const baseUrl = `${this.configService.get('FILE_SERVICE_URL')}/folders/contents`;
    const url = folderId ? `${baseUrl}?folderId=${folderId}` : baseUrl;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Get('/:id') //+
  async getFolderById(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Patch('/:id/share') //+
  async shareFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/share`;
    return this.proxy.forward('PATCH', url, null, req.headers);
  }

  @Post('/upload-folder') //+
  async uploadFolder(@Req() req: Request, @Res() res: Response) {
    const proxyReq = http.request(
      {
        method: req.method,
        hostname: this.configService.get('FILE_SERVICE_HOST') || 'file-service',
        port: this.configService.get<number>('FILE_SERVICE_PORT') || 3003,
        path: '/folders/upload-folder',
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      console.error('❌ Upload-folder proxy error:', err);
      res.status(500).json({ message: 'Upload folder proxy failed' });
    });
  }

  @Get('/:id/download') //+
  async downloadFolder(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const proxyReq = http.request(
      {
        method: req.method,
        hostname: this.configService.get('FILE_SERVICE_HOST') || 'file-service',
        port: this.configService.get<number>('FILE_SERVICE_PORT') || 3003,
        path: `/folders/${id}/download`,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      console.error('❌ Folder download proxy error:', err);
      res.status(500).json({ message: 'Folder download proxy failed' });
    });
  }

  @Get('/shared/:token') //+
  async downloadSharedFolder(
    @Param('token') token: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const proxyReq = http.request(
      {
        method: req.method,
        hostname: this.configService.get('FILE_SERVICE_HOST') || 'file-service',
        port: this.configService.get<number>('FILE_SERVICE_PORT') || 3003,
        path: `/folders/shared/${token}`,
        headers: req.headers,
      },
      (proxyRes) => {
        // Устанавливаем заголовок для загрузки
        res.setHeader(
          'Content-Disposition',
          proxyRes.headers['content-disposition'] ||
            'attachment; filename="shared-folder.zip"',
        );
        res.setHeader(
          'Content-Type',
          proxyRes.headers['content-type'] || 'application/zip',
        );

        res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      console.error('❌ Proxy download error:', err);
      res.status(500).json({ message: 'Download proxy failed' });
    });
  }

  @Patch('/:id') //+
  async updateFolder(@Param('id') id: string, @Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('PATCH', url, body, req.headers);
  }

  @Delete('/:id') //+
  async deleteFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}`;
    return this.proxy.forward('DELETE', url, null, req.headers);
  }

  @Post('/:id/restore') //+
  async restoreFolder(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/${id}/restore`;
    return this.proxy.forward('POST', url, null, req.headers);
  }

  @Post('/move')
  async moveItems(@Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/folders/move`;
    return this.proxy.forward('POST', url, body, req.headers);
  }
}
