import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Folder, FolderSchema } from './schemas/folder.schema';
import { FolderService } from './folder.service';
import { FolderController } from './folder.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Folder.name, schema: FolderSchema }]),
  ],
  controllers: [FolderController],
  providers: [FolderService],
  exports: [FolderService], // если ты будешь использовать в FileService
})
export class FolderModule {}
