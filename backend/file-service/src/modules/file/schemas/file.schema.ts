import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop({ required: true })
  filename: string;

  @Prop({ required: true })
  originalName: string;

  @Prop()
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

  @Prop({ default: null })
  sharedToken: string | null;

  @Prop({ default: null })
  folderId: string | null;

  @Prop({ type: [String], default: [] }) // путь до файла
  path: string[];

  @Prop({ required: true }) // путь в файловой системе или S3
  key: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const FileSchema = SchemaFactory.createForClass(File);

