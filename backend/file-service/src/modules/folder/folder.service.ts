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

  // async create(dto: CreateFolderDto, ownerId: string) {
  //   const existing = await this.folderModel.findOne({
  //     name: dto.name,
  //     parentFolderId: dto.parentFolderId ?? null,
  //     ownerId,
  //   });

  //   if (existing) {
  //     throw new BadRequestException(
  //       'Folder with this name already exists in this directory',
  //     );
  //   }

  //   const folderPathParts = [];

  //   if (dto.parentFolderId) {
  //     folderPathParts.push(
  //       ...(await this.buildFolderPathParts(dto.parentFolderId)),
  //     );
  //   }

  //   folderPathParts.push(dto.name);

  //   const folder = new this.folderModel({
  //     ...dto,
  //     ownerId,
  //     key: `${ownerId}/${folderPathParts.join('/')}`,
  //   });

  //   return folder.save();
  // }

  async create(dto: CreateFolderDto, ownerId: string, isSystem = false) {
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

    const path: string[] = [];

    if (dto.parentFolderId) {
      path.push(...(await this.getParentPathIds(dto.parentFolderId)));
    }

    const key = dto.parentFolderId
      ? `${ownerId}/${await this.buildFolderPath(dto.parentFolderId)}/${dto.name}`
      : `${ownerId}/${dto.name}`;

    const folder = new this.folderModel({
      ...dto,
      ownerId,
      path,
      key,
      isSystem,
    });

    return folder.save();
  }

  private async getParentPathIds(folderId: string): Promise<string[]> {
    const path: string[] = [];
    let currentId: string | null = folderId;

    while (currentId) {
      const folder = await this.folderModel.findById(currentId).lean();
      if (!folder) break;
      path.unshift(folder._id.toString());
      currentId = folder.parentFolderId;
    }

    return path;
  }

  async findContents(ownerId: string, folderId: string | null) {
    const folders = await this.folderModel.find({
      ownerId,
      parentFolderId: folderId ?? null,
      isDeleted: { $ne: true },
    });

    const files = await this.fileModel.find({
      ownerId,
      folderId: folderId ?? null,
      isDeleted: { $ne: true }, // если поддерживаешь корзину
    });

    return { folders, files };
  }

  async findById(id: string, ownerId: string) {
    const folder = await this.folderModel.findOne({
      _id: id,
      ownerId,
      isDeleted: { $ne: true },
    });

    if (!folder) {
      throw new BadRequestException('Folder not found');
    }

    return folder;
  }

  async shareFolder(id: string, ownerId: string) {
    const folder = await this.folderModel.findOne({
      _id: id,
      ownerId,
      isDeleted: { $ne: true },
    });

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
      const folder = await this.folderModel
        .findOne({ _id: currentId, isDeleted: { $ne: true } })
        .lean();
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
      const folder = await this.folderModel
        .findOne({ _id: currentId, isDeleted: { $ne: true } })
        .lean();
      if (!folder) break;

      parts.unshift(folder.name);
      currentId = folder.parentFolderId ?? null;
    }

    return parts;
  }

  // async saveFileMetadata(
  //   file: Express.Multer.File,
  //   ownerId: string,
  //   folderId: string | null = null,
  // ) {
  //   const folderPath = await this.buildFolderPath(folderId);
  //   const uploadRoot =
  //     this.configService.get<string>('UPLOAD_FOLDER') || './uploads';

  //   const filename = file.filename; // UUID.ext, имя, заданное в FileInterceptor
  //   const key = folderPath
  //     ? `${ownerId}/${folderPath}/${filename}`
  //     : `${ownerId}/${filename}`;

  //   const fullPath = path.join(uploadRoot, key);

  //   console.log('[📂 FILE DEBUG]', {
  //     folderPath,
  //     key,
  //     fullPath,
  //   });

  //   const sourcePath = file.path; // ← фактический путь к файлу в temp

  //   // Создаём папки
  //   fs.mkdirSync(path.dirname(fullPath), { recursive: true });

  //   try {
  //     // Копируем файл из temp → в нужную папку
  //     fs.copyFileSync(sourcePath, fullPath);

  //     // Удаляем оригинал из temp
  //     fs.unlinkSync(sourcePath);
  //   } catch (error) {
  //     console.error('File move error:', error);
  //     throw new InternalServerErrorException('Failed to move uploaded file');
  //   }

  //   // Сохраняем метаданные в MongoDB
  //   const newFile = new this.fileModel({
  //     filename,
  //     originalName: file.originalname,
  //     mimeType: file.mimetype,
  //     size: file.size,
  //     ownerId,
  //     folderId,
  //     key,
  //     access: 'private',
  //   });

  //   return newFile.save();
  // }

  async saveFileMetadata(
    file: Express.Multer.File,
    ownerId: string,
    folderId: string | null = null,
  ) {
    const folderPath = await this.buildFolderPath(folderId); // путь типа: Projects/ReactApp
    const pathIds: string[] = [];

    if (folderId) {
      pathIds.push(...(await this.getParentPathIds(folderId)));
      pathIds.push(folderId); // добавляем текущую папку
    }

    const uploadRoot =
      this.configService.get<string>('UPLOAD_FOLDER') || './uploads';

    const filename = file.filename; // UUID.ext
    const key = folderPath
      ? `${ownerId}/${folderPath}/${filename}`
      : `${ownerId}/${filename}`;

    const fullPath = path.join(uploadRoot, key);

    console.log('[📂 FILE DEBUG]', {
      folderPath,
      key,
      fullPath,
      pathIds,
    });

    const sourcePath = file.path;

    fs.mkdirSync(path.dirname(fullPath), { recursive: true });

    try {
      fs.copyFileSync(sourcePath, fullPath);
      fs.unlinkSync(sourcePath);
    } catch (error) {
      console.error('File move error:', error);
      throw new InternalServerErrorException('Failed to move uploaded file');
    }

    const newFile = new this.fileModel({
      filename,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      ownerId,
      folderId,
      path: pathIds,
      key,
      access: 'private',
    });

    return newFile.save();
  }

  // async findOrCreateFolderPath(
  //   pathParts: string[],
  //   ownerId: string,
  //   folderId: string | null = null,
  // ): Promise<string | null> {
  //   let currentParentId = folderId;

  //   for (const name of pathParts) {
  //     let folder = await this.folderModel.findOne({
  //       name,
  //       ownerId,
  //       parentFolderId: currentParentId,
  //       isDeleted: { $ne: true },
  //     });

  //     if (!folder) {
  //       folder = new this.folderModel({
  //         name,
  //         ownerId,
  //         parentFolderId: currentParentId,
  //       });
  //       await folder.save();
  //     }

  //     currentParentId = folder._id.toString();
  //   }

  //   return currentParentId;
  // }

  async findOrCreateFolderPath(
    pathParts: string[],
    ownerId: string,
    folderId: string | null = null,
  ): Promise<string | null> {
    let currentParentId = folderId;
    let currentKey = '';

    if (folderId) {
      const parentFolder = await this.folderModel.findById(folderId).lean();
      if (parentFolder?.key) {
        currentKey = parentFolder.key;
      }
    } else {
      currentKey = ownerId;
    }

    for (const name of pathParts) {
      let folder = await this.folderModel.findOne({
        name,
        ownerId,
        parentFolderId: currentParentId,
        isDeleted: { $ne: true },
      });

      if (!folder) {
        const fullKey = `${currentKey}/${name}`; // ← новый путь

        folder = new this.folderModel({
          name,
          ownerId,
          parentFolderId: currentParentId,
          key: fullKey,
        });

        await folder.save();
      }

      currentParentId = folder._id.toString();
      currentKey = folder.key; // обновляем путь на следующую итерацию
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
      isDeleted: { $ne: true },
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
    const folder = await this.folderModel.findOne({
      sharedToken: token,
      isDeleted: { $ne: true }, // 👈 добавить
    });

    if (!folder || folder.access !== 'link') {
      throw new BadRequestException('Invalid or expired link');
    }

    return this.downloadFolderAsZip(folder._id.toString(), folder.ownerId, res);
  }

  async updateFolder(id: string, ownerId: string, dto: UpdateFolderDto) {
    const folder = await this.folderModel.findOne({
      _id: id,
      ownerId,
      isDeleted: { $ne: true }, // 👈 добавить
    });

    if (!folder) throw new NotFoundException('Folder not found');

    folder.name = dto.name;
    await folder.save();
    return folder;
  }

  async softDeleteFolder(id: string, ownerId: string) {
    const folder = await this.folderModel.findOne({
      _id: id,
      ownerId,
      isDeleted: { $ne: true },
    });
    if (!folder) throw new NotFoundException('Folder not found');

    // Рекурсивно удалить вложенные папки и файлы
    await this._recursiveSoftDelete(id, ownerId);

    return { message: 'Folder and contents soft-deleted successfully' };
  }

  private async _recursiveSoftDelete(folderId: string, ownerId: string) {
    // Помечаем текущую папку
    await this.folderModel.updateOne(
      { _id: folderId, ownerId },
      { isDeleted: true, deletedAt: new Date() },
    );

    // Помечаем все файлы в этой папке
    await this.fileModel.updateMany(
      { folderId, ownerId, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() },
    );

    // Находим вложенные папки
    const subfolders = await this.folderModel.find({
      parentFolderId: folderId,
      ownerId,
      isDeleted: { $ne: true },
    });

    for (const sub of subfolders) {
      await this._recursiveSoftDelete(sub._id.toString(), ownerId);
    }
  }

  async restoreFolder(id: string, ownerId: string) {
    const folder = await this.folderModel.findOne({
      _id: id,
      ownerId,
      isDeleted: true,
    });

    if (!folder) throw new NotFoundException('Folder not found or not deleted');

    // восстанавливаем цепочку вверх
    if (folder.parentFolderId) {
      await this._restoreFolderChain(folder.parentFolderId, ownerId);
    }

    // восстанавливаем саму папку и вложения
    await this._recursiveRestore(id, ownerId);

    return { message: 'Folder and contents restored successfully' };
  }

  private async _restoreFolderChain(folderId: string, ownerId: string) {
    const stack: string[] = [];

    let currentId: string | null = folderId;

    // собираем цепочку вверх
    while (currentId) {
      const folder = await this.folderModel.findById(currentId).lean();
      if (!folder) break;
      stack.unshift(currentId);
      currentId = folder.parentFolderId ?? null;
    }

    // по очереди восстанавливаем (снизу вверх)
    for (const id of stack) {
      await this.folderModel.updateOne(
        { _id: id, ownerId, isDeleted: true },
        { isDeleted: false, deletedAt: undefined },
      );
    }
  }

  private async _recursiveRestore(folderId: string, ownerId: string) {
    // восстанавливаем папку
    await this.folderModel.updateOne(
      { _id: folderId, ownerId },
      { isDeleted: false, deletedAt: undefined },
    );

    // восстанавливаем все файлы
    await this.fileModel.updateMany(
      { folderId, ownerId, isDeleted: true },
      { isDeleted: false, deletedAt: undefined },
    );

    // вложенные папки
    const subfolders = await this.folderModel.find({
      parentFolderId: folderId,
      ownerId,
      isDeleted: true,
    });

    for (const sub of subfolders) {
      await this._recursiveRestore(sub._id.toString(), ownerId);
    }
  }

  async moveItems(
    items: { id: string; type: 'file' | 'folder' }[],
    destinationId: string | null,
    ownerId: string,
  ) {
    const updated = {
      folders: 0,
      files: 0,
    };

    const pathIds: string[] = [];

    // if (destinationId) {
    //   pathIds.push(...(await this.getParentPathIds(destinationId)));
    //   pathIds.push(destinationId);
    // }

    // 🛡 Проверка: destinationId не должен быть файлом
    if (destinationId) {
      const destinationFolder = await this.folderModel.findOne({
        _id: destinationId,
        ownerId,
        isDeleted: { $ne: true },
      });

      if (!destinationFolder) {
        throw new BadRequestException(
          'Destination folder does not exist or is not a folder',
        );
      }

      pathIds.push(...(await this.getParentPathIds(destinationId)));
      pathIds.push(destinationId);
    }

    const basePath = await this.buildFolderPath(destinationId);
    const baseKey = basePath ? `${ownerId}/${basePath}` : `${ownerId}`;

    for (const item of items) {
      if (item.type === 'folder') {
        // 🛡 Проверка: нельзя переместить саму папку в себя
        if (item.id === destinationId) {
          throw new BadRequestException('Cannot move a folder into itself');
        }

        // 🛡 Проверка: нельзя переместить папку в одного из её потомков
        const destinationPath = destinationId
          ? [...pathIds, destinationId]
          : [];

        const isNestedInItself = destinationPath.includes(item.id);
        if (isNestedInItself) {
          throw new BadRequestException(
            'Cannot move a folder into its subfolder',
          );
        }

        await this._moveFolder(
          item.id,
          ownerId,
          destinationId,
          pathIds,
          baseKey,
        );
        updated.folders++;
      }

      if (item.type === 'file') {
        await this._moveFile(item.id, ownerId, destinationId, pathIds, baseKey);
        updated.files++;
      }
    }

    return {
      message: 'Items moved successfully',
      updated,
    };
  }

  private async _moveFolder(
    folderId: string,
    ownerId: string,
    newParentId: string | null,
    newPath: string[],
    baseKey: string,
  ) {
    const folder = await this.folderModel.findOne({
      _id: folderId,
      ownerId,
      isDeleted: { $ne: true },
    });

    if (!folder) return;

    folder.parentFolderId = newParentId;
    folder.path = [...newPath];
    folder.key = `${baseKey}/${folder.name}`;
    await folder.save();

    // рекурсивно обновляем вложенные папки и файлы
    const subfolders = await this.folderModel.find({
      parentFolderId: folderId,
      ownerId,
      isDeleted: { $ne: true },
    });

    for (const sub of subfolders) {
      await this._moveFolder(
        sub._id.toString(),
        ownerId,
        folder._id.toString(),
        [...folder.path, folder._id.toString()],
        `${folder.key}`,
      );
    }

    const files = await this.fileModel.find({
      folderId: folderId,
      ownerId,
      isDeleted: { $ne: true },
    });

    for (const file of files) {
      file.path = [...folder.path, folder._id.toString()];
      file.key = `${folder.key}/${file.filename}`;
      await file.save();
    }
  }

  private async _moveFile(
    fileId: string,
    ownerId: string,
    newFolderId: string | null,
    pathIds: string[],
    baseKey: string,
  ) {
    const file = await this.fileModel.findOne({
      _id: fileId,
      ownerId,
      isDeleted: { $ne: true },
    });

    if (!file) return;

    file.folderId = newFolderId;
    file.path = [...pathIds];
    file.key = `${baseKey}/${file.filename}`;
    await file.save();
  }
}
