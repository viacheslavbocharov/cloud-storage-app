import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FetchProxyModule } from 'src/common/proxy/fetch-proxy.module';


@Module({
  imports: [FetchProxyModule],
  controllers: [FilesController],
})
export class FilesModule {}
