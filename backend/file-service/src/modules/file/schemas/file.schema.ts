import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop({ required: true }) // имя файла на диске (uuid + ext)
  filename: string;

  @Prop({ required: true }) // оригинальное имя от пользователя
  originalName: string;

  @Prop() // опциональное имя, заданное вручную (например, переименование)
  customName?: string;

  @Prop()
  mimeType: string;

  @Prop()
  size: number;

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ default: 'private' })
  access: 'private' | 'public' | 'link';

  @Prop()
  sharedToken?: string;

  @Prop({ default: null })
  folderId: string | null;

  @Prop({ required: true }) // путь для S3 или файловой системы
  key: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);
