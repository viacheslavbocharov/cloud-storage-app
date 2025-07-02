import { Module } from '@nestjs/common';
import { BinService } from './bin.service';
import { BinController } from './bin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from '../file/schemas/file.schema';
import { Folder, FolderSchema } from '../folder/schemas/folder.schema';

@Module({
  imports: [
      MongooseModule.forFeature([
        { name: File.name, schema: FileSchema },
        { name: Folder.name, schema: FolderSchema },
      ]),
    ],
  providers: [BinService],
  controllers: [BinController]
})
export class BinModule {}
