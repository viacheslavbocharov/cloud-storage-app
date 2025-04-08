import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FetchProxyModule } from 'src/common/proxy/fetch-proxy.module';
import { FoldersController } from './folders.controller';
import { SearchController } from './search.controller';


@Module({
  imports: [FetchProxyModule],
  controllers: [FilesController, FoldersController, SearchController],
})
export class FilesModule {}
