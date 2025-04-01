import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { CreateFolderDto } from './dto/create-folder.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
  ) {}

  async create(createFolderDto: CreateFolderDto, ownerId: string) {
    const folder = new this.folderModel({
      ...createFolderDto,
      ownerId,
    });
    return folder.save();
  }

  async findContents(ownerId: string, folderId: string | null) {
    const folders = await this.folderModel.find({
      ownerId,
      parentFolderId: folderId ?? null,
    });

    // файлы можно подтянуть позже через fileService или fileModel

    return {
      folders,
    };
  }
}
