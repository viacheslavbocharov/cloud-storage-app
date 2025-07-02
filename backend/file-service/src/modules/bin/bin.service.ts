import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../file/schemas/file.schema';
import { Folder, FolderDocument } from '../folder/schemas/folder.schema';
import { Model } from 'mongoose';

@Injectable()
export class BinService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
  ) {}

  async findTrash(ownerId: string, folderId: string | null) {
    let folders: FolderDocument[];
    let files: FileDocument[];

    if (folderId) {
      // Конкретная папка
      folders = await this.folderModel.find({
        ownerId,
        parentFolderId: folderId,
        isDeleted: true,
      });

      files = await this.fileModel.find({
        ownerId,
        folderId: folderId,
        isDeleted: true,
      });
    } else {
      // Вся корзина
      folders = await this.folderModel.find({
        ownerId,
        isDeleted: true,
      });

      files = await this.fileModel.find({
        ownerId,
        isDeleted: true,
      });
    }

    return { folders, files };
  }
}
