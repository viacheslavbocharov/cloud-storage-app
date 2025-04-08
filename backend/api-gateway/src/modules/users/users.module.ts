import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { FetchProxyModule } from 'src/common/proxy/fetch-proxy.module';


@Module({
  imports: [FetchProxyModule],
  controllers: [UsersController],
})
export class UsersModule {}
