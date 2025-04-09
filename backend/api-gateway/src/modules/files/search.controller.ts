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

@Controller('search')
export class SearchController {
  constructor(
    private readonly configService: ConfigService,
    private readonly proxy: FetchProxyService,
  ) {}


  @Get() //+
  async search(@Query('query') query: string, @Query('isDeleted') isDeleted: string, @Req() req) {
    const url = `${this.configService.get('FILE_SERVICE_URL')}/search?query=${query}&isDeleted=${isDeleted}`;
    return this.proxy.forward('GET', url, null, req.headers);
  }
}
