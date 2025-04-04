import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { CreateFolderDto } from './dto/create-folder.dto';
import { File, FileDocument } from '../file/schemas/file.schema';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
  ) {}

  async create(dto: CreateFolderDto, ownerId: string) {
    const existing = await this.folderModel.findOne({
      name: dto.name,
      parentFolderId: dto.parentFolderId ?? null,
      ownerId,
    });

    if (existing) {
      throw new BadRequestException(
        'Folder with this name already exists in this directory',
      );
    }

    const folder = new this.folderModel({
      ...dto,
      ownerId,
    });
    return folder.save();
  }

  async findContents(ownerId: string, folderId: string | null) {
    const folders = await this.folderModel.find({
      ownerId,
      parentFolderId: folderId ?? null,
    });

    const files = await this.fileModel.find({
      ownerId,
      folderId: folderId ?? null,
      isDeleted: { $ne: true }, // если поддерживаешь корзину
    });

    return { folders, files };
  }


  async findById(id: string, ownerId: string) {
    const folder = await this.folderModel.findOne({ _id: id, ownerId });
  
    if (!folder) {
      throw new BadRequestException('Folder not found');
    }
  
    return folder;
  }
  
  
}
