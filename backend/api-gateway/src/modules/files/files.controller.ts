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

@Controller('files')
export class FilesController {
  constructor(
    private readonly configService: ConfigService,
    private readonly proxy: FetchProxyService,
  ) {}

  @Post('/upload') //+
  async upload(@Req() req: Request, @Res() res: Response) {
    const proxyReq = http.request(
      {
        method: req.method,
        hostname: this.configService.get('FILE_SERVICE_HOST') || 'file-service',
        port: this.configService.get<number>('FILE_SERVICE_PORT') || 3003,
        path: '/files/upload',
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      res.status(500).json({ message: 'Upload proxy failed' });
    });
  }

  @Get('/:id') //+
  async getFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }

  @Get('/:id/download') //+
  async downloadFile(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const options = {
      method: 'GET',
      hostname: this.configService.get('FILE_SERVICE_HOST') || 'file-service',
      port: this.configService.get<number>('FILE_SERVICE_PORT') || 3003,
      path: `/files/${id}/download`,
      headers: req.headers,
    };

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      console.error('❌ Proxy download error:', err);
      res.status(500).json({ message: 'Download proxy failed' });
    });
  }

  @Patch('/:id/share') //+
  async shareFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}/share`;
    return this.proxy.forward('PATCH', url, null, req.headers);
  }


  @Get('/shared/:token') //+
  async downloadSharedFile(
    @Param('token') token: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const proxyReq = http.request(
      {
        method: req.method,
        hostname: this.configService.get('FILE_SERVICE_HOST') || 'file-service',
        port: this.configService.get<number>('FILE_SERVICE_PORT') || 3003,
        path: `/files/shared/${token}`,
        headers: req.headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode ?? 500, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
      },
    );

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      console.error('❌ Download proxy error:', err);
      res.status(500).json({ message: 'Download proxy failed' });
    });
  }

  @Patch('/:id')//+
  async updateFile(@Param('id') id: string, @Body() body, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}`;
    return this.proxy.forward('PATCH', url, body, req.headers);
  }

  @Delete('/:id') //+
  async deleteFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}`;
    return this.proxy.forward('DELETE', url, null, req.headers);
  }

  @Post('/:id/restore')//+
  async restoreFile(@Param('id') id: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/files/${id}/restore`;
    return this.proxy.forward('POST', url, null, req.headers);
  }
}
