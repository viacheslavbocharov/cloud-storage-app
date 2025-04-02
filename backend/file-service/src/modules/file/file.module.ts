import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { FileController } from './file.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { File, FileSchema } from './schemas/file.schema';
import { Folder, FolderSchema } from '../folder/schemas/folder.schema';
import { FileUploadManyInterceptor } from './interceptors/file-upload-many.interceptor';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: File.name, schema: FileSchema },
      { name: Folder.name, schema: FolderSchema },
    ]),
  ],
  controllers: [FileController],
  providers: [FileService, FileUploadManyInterceptor],
})
export class FileModule {}
