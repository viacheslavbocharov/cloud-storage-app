import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { File, FileDocument } from '../file/schemas/file.schema';
import { Folder, FolderDocument } from '../folder/schemas/folder.schema';
import { Model } from 'mongoose';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
  ) {}

  async search(ownerId: string, query: string, isDeleted: boolean) {
    const regex = new RegExp(query, 'i');

    const files = await this.fileModel.find({
      ownerId,
      isDeleted,
      originalName: regex,
    });

    const folders = await this.folderModel.find({
      ownerId,
      isDeleted,
      name: regex,
    });

    return { files, folders };
  }
}
