import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';
import { File, FileSchema } from '../file/schemas/file.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Folder.name, schema: FolderSchema },
      { name: File.name, schema: FileSchema },
    ]),
  ],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService], // если ты будешь использовать в FileService
})
export class FolderModule {}
