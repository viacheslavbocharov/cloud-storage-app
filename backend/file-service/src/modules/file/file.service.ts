import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { Folder, FolderDocument } from '../folder/schemas/folder.schema';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    private configService: ConfigService,
  ) {}

  async buildFolderPath(folderId: string | null): Promise<string> {
    if (!folderId) return '';

    const folderPathSegments: string[] = [];
    let currentFolder = await this.folderModel.findById(folderId);

    while (currentFolder) {
      folderPathSegments.unshift(currentFolder.name);
      currentFolder = currentFolder.parentFolderId
        ? await this.folderModel.findById(currentFolder.parentFolderId)
        : null;
    }

    return folderPathSegments.join('/');
  }

  async saveFileMetadata(
    file: Express.Multer.File,
    ownerId: string,
    folderId: string | null = null,
  ) {
    const folderPath = await this.buildFolderPath(folderId);
    const uploadRoot =
      this.configService.get<string>('UPLOAD_FOLDER') || './uploads';

    const filename = file.filename; // UUID.ext, имя, заданное в FileInterceptor
    const key = folderPath
      ? `${ownerId}/${folderPath}/${filename}`
      : `${ownerId}/${filename}`;

    const fullPath = path.join(uploadRoot, key);
    const sourcePath = file.path; // ← фактический путь к файлу в temp

    // Создаём папки
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    try {
      // Копируем файл из temp → в нужную папку
      fs.copyFileSync(sourcePath, fullPath);

      // Удаляем оригинал из temp
      fs.unlinkSync(sourcePath);
    } catch (error) {
      console.error('File move error:', error);
      throw new InternalServerErrorException('Failed to move uploaded file');
    }

    // Сохраняем метаданные в MongoDB
    const newFile = new this.fileModel({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      ownerId,
      folderId,
      key,
      access: 'private',
    });

    return newFile.save();
  }
}
