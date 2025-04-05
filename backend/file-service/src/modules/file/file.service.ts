import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from './schemas/file.schema';
import { Folder, FolderDocument } from '../folder/schemas/folder.schema';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';
import { nanoid } from 'nanoid';
import { UpdateFileDto } from './dto/update-file.dto';

@Injectable()
export class FileService {
  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    private configService: ConfigService,
  ) {}

  async buildFolderPath(folderId: string | null): Promise<string | null> {
    if (!folderId) return null;

    const pathParts: string[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.folderModel.findById(currentId).lean();
      if (!folder) break;

      pathParts.unshift(folder.name);
      currentId = folder.parentFolderId ?? null;
    }

    console.log('[📁 BUILD PATH]', { folderId, pathParts });

    return pathParts.join('/');
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

    console.log('[📂 FILE DEBUG]', {
      folderPath,
      key,
      fullPath,
    });

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

  async findById(id: string, ownerId: string) {
    const file = await this.fileModel.findOne({
      _id: id,
      ownerId,
      isDeleted: { $ne: true },
    });

    if (!file) {
      throw new BadRequestException('File not found');
    }

    return file;
  }

  async findBySharedToken(token: string) {
    const file = await this.fileModel.findOne({
      sharedToken: token,
      isDeleted: { $ne: true },
    });

    if (!file || file.access !== 'link') {
      throw new BadRequestException('Invalid or expired link');
    }

    return file;
  }

  async shareFile(id: string, ownerId: string) {
    const file = await this.fileModel.findOne({
      _id: id,
      ownerId,
      isDeleted: { $ne: true },
    });

    if (!file) {
      throw new NotFoundException('File not found');
    }

    file.access = 'link';
    file.sharedToken = nanoid(16);

    await file.save();

    return {
      sharedUrl: `/files/shared/${file.sharedToken}`,
    };
  }

  async updateFile(id: string, ownerId: string, dto: UpdateFileDto) {
    const file = await this.fileModel.findOne({
      _id: id,
      ownerId,
      isDeleted: { $ne: true },
    });

    if (!file) throw new NotFoundException('File not found');

    if (dto.originalName) file.originalName = dto.originalName;
    if (dto.access) file.access = dto.access;

    await file.save();
    return file;
  }
}
