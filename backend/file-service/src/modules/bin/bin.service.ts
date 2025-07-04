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

  // Восстановление цепочки папок вверх
  async restoreFolderChain(folderId: string, ownerId: string) {
    let currentId: string | null = folderId;
    while (currentId) {
      const folder = await this.folderModel.findOneAndUpdate(
        { _id: currentId, ownerId },
        { isDeleted: false, deletedAt: undefined },
      );
      currentId = folder?.parentFolderId ?? null;
    }
  }

  // Рекурсивное восстановление вниз
  async restoreFolderRecursively(folderId: string, ownerId: string) {
    // Восстанавливаем саму папку
    await this.folderModel.updateOne(
      { _id: folderId, ownerId },
      { isDeleted: false, deletedAt: undefined },
    );

    // Восстанавливаем все файлы в папке
    await this.fileModel.updateMany(
      { folderId, ownerId },
      { isDeleted: false, deletedAt: undefined },
    );

    // Рекурсивно для всех вложенных папок
    const subfolders = await this.folderModel.find({
      parentFolderId: folderId,
      ownerId,
    });

    for (const sub of subfolders) {
      await this.restoreFolderRecursively(sub._id.toString(), ownerId);
    }
  }

  async restoreItems(
    ownerId: string,
    items: { id: string; type: 'file' | 'folder' }[],
  ) {
    for (const item of items) {
      if (item.type === 'file') {
        // Восстанавливаем сам файл
        const file = await this.fileModel.findOneAndUpdate(
          { _id: item.id, ownerId },
          { isDeleted: false, deletedAt: undefined },
        );

        // Восстанавливаем всю цепочку папок вверх
        if (file?.folderId) {
          await this.restoreFolderChain(file.folderId, ownerId);
        }
      }

      if (item.type === 'folder') {
        // Сначала восстанавливаем цепочку вверх
        await this.restoreFolderChain(item.id, ownerId);

        // Потом рекурсивно вниз
        await this.restoreFolderRecursively(item.id, ownerId);
      }
    }
  }
}
