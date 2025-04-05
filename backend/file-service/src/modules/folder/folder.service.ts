import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Folder, FolderDocument } from './schemas/folder.schema';
import { CreateFolderDto } from './dto/create-folder.dto';
import { File, FileDocument } from '../file/schemas/file.schema';
import { nanoid } from 'nanoid';
import * as fs from 'fs';
import * as path from 'path';
import * as archiver from 'archiver';
import { ConfigService } from '@nestjs/config';
import { UpdateFolderDto } from './dto/update-folder.dto';

@Injectable()
export class FolderService {
  constructor(
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    private configService: ConfigService,
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

  async shareFolder(id: string, ownerId: string) {
    const folder = await this.folderModel.findOne({ _id: id, ownerId });
    if (!folder) throw new NotFoundException('Folder not found');

    folder.access = 'link';
    folder.sharedToken = nanoid(16);

    await folder.save();
    return {
      sharedUrl: `/folders/shared/${folder.sharedToken}`,
    };
  }

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

  async buildFolderPathParts(folderId: string): Promise<string[]> {
    const parts: string[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.folderModel.findById(currentId).lean();
      if (!folder) break;

      parts.unshift(folder.name);
      currentId = folder.parentFolderId ?? null;
    }

    return parts;
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

  async findOrCreateFolderPath(
    pathParts: string[],
    ownerId: string,
    folderId: string | null = null,
  ): Promise<string | null> {
    let currentParentId = folderId;

    for (const name of pathParts) {
      let folder = await this.folderModel.findOne({
        name,
        ownerId,
        parentFolderId: currentParentId,
      });

      if (!folder) {
        folder = new this.folderModel({
          name,
          ownerId,
          parentFolderId: currentParentId,
        });
        await folder.save();
      }

      currentParentId = folder._id.toString();
    }

    return currentParentId;
  }

  async handleFolderUpload(
    files: Express.Multer.File[],
    ownerId: string,
    folderId: string | null = null,
  ) {
    const results = [];

    interface FileWithRelativePath extends Express.Multer.File {
      relativePath?: string;
    }

    for (const file of files as FileWithRelativePath[]) {
      const relativePath = file.relativePath || file.originalname;
      const pathParts = relativePath.split('/');
      console.log('[🧠 RELATIVE PATH]', relativePath);

      const fileName = pathParts.pop(); // имя файла
      const folderParts = pathParts;

      const basePath = folderId
        ? await this.buildFolderPathParts(folderId)
        : [];

      const fullFolderPath = [...basePath, ...folderParts];

      const targetFolderId = await this.findOrCreateFolderPath(
        fullFolderPath,
        ownerId,
        null,
      );

      file.originalname = fileName;

      console.log('[➡️ TO SAVE]', {
        fileName,
        relativePath,
        fullFolderPath,
        targetFolderId,
      });

      const saved = await this.saveFileMetadata(file, ownerId, targetFolderId);
      results.push(saved);
    }

    return results;
  }

  async downloadFolderAsZip(folderId: string, ownerId: string, res: any) {
    const folder = await this.folderModel.findOne({ _id: folderId, ownerId });
    if (!folder) throw new NotFoundException('Folder not found');

    const uploadRoot =
      this.configService.get<string>('UPLOAD_FOLDER') || './uploads';

    const archive = archiver('zip', { zlib: { level: 9 } });
    archive.on('error', (err) => {
      throw err;
    });

    res.attachment(`${folder.name}.zip`);
    archive.pipe(res);

    // 🔁 Рекурсивно собрать все папки и файлы
    await this.addFolderToArchive(archive, folderId, ownerId, '', uploadRoot);

    await archive.finalize();
  }

  private async addFolderToArchive(
    archive: archiver.Archiver,
    folderId: string,
    ownerId: string,
    currentPath: string,
    uploadRoot: string,
  ) {
    // Найти подпапки
    const folders = await this.folderModel.find({
      ownerId,
      parentFolderId: folderId,
    });

    for (const folder of folders) {
      const folderPathInZip = path.join(currentPath, folder.name);
      await this.addFolderToArchive(
        archive,
        folder._id.toString(),
        ownerId,
        folderPathInZip,
        uploadRoot,
      );
    }

    // Найти файлы
    const files = await this.fileModel.find({
      ownerId,
      folderId,
      isDeleted: { $ne: true },
    });

    for (const file of files) {
      const fullPath = path.join(uploadRoot, file.key); // путь к uuid-файлу
      const filePathInZip = path.join(currentPath, file.originalName); // путь с оригинальным именем

      if (fs.existsSync(fullPath)) {
        archive.file(fullPath, { name: filePathInZip });
      }
    }
  }

  async downloadSharedFolder(token: string, res: any) {
    const folder = await this.folderModel.findOne({ sharedToken: token });

    if (!folder || folder.access !== 'link') {
      throw new BadRequestException('Invalid or expired link');
    }

    return this.downloadFolderAsZip(folder._id.toString(), folder.ownerId, res);
  }

  async updateFolder(id: string, ownerId: string, dto: UpdateFolderDto) {
    const folder = await this.folderModel.findOne({ _id: id, ownerId });
    if (!folder) throw new NotFoundException('Folder not found');
  
    folder.name = dto.name;
    await folder.save();
    return folder;
  }
  
}
