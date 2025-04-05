// src/modules/cleaner/cleaner.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CleanerService } from './cleaner.service';
import { File, FileSchema } from '../file/schemas/file.schema';
import { Folder, FolderSchema } from '../folder/schemas/folder.schema';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
  ],
  providers: [CleanerService],
})
export class CleanerModule {}
