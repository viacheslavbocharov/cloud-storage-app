import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { FetchProxyModule } from 'src/common/proxy/fetch-proxy.module';

@Module({
  imports: [FetchProxyModule],
  controllers: [AuthController],
})
export class AuthModule {}
