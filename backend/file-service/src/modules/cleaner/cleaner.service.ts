import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { File, FileDocument } from '../file/schemas/file.schema';
import { Folder, FolderDocument } from '../folder/schemas/folder.schema';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CleanerService {
  private readonly logger = new Logger(CleanerService.name);

  constructor(
    @InjectModel(File.name) private fileModel: Model<FileDocument>,
    @InjectModel(Folder.name) private folderModel: Model<FolderDocument>,
    private configService: ConfigService,
  ) {}

  @Cron('0 3 * * *') // каждый день в 03:00
  async cleanTrash() {
    this.logger.log('🧹 Starting trash cleanup...');

    const thirtyDaysAgo = new Date(Date.now() - 1000 * 60 * 60 * 24 * 30);

    // Удаляем файлы из файловой системы и базы
    const files = await this.fileModel.find({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo },
    });

    const uploadRoot = this.configService.get<string>('UPLOAD_FOLDER') || './uploads';

    for (const file of files) {
      const filePath = path.join(uploadRoot, file.key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.fileModel.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo },
    });

    // Удаляем папки из базы
    await this.folderModel.deleteMany({
      isDeleted: true,
      deletedAt: { $lte: thirtyDaysAgo },
    });

    this.logger.log(`✅ Trash cleanup complete`);
  }
}
