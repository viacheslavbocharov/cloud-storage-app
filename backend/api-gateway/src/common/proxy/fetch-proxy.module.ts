// src/common/proxy/proxy.module.ts
import { Module } from '@nestjs/common';
import { FetchProxyService } from './fetch-proxy.service';

@Module({
  providers: [FetchProxyService],
  exports: [FetchProxyService],
})
export class FetchProxyModule {}
