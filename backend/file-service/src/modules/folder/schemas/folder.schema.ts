import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FolderDocument = HydratedDocument<Folder>;

@Schema()
export class Folder {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ default: null })
  parentFolderId: string | null;

  @Prop({ type: [String], default: [] }) // путь до папки
  path: string[];

  @Prop({ required: true }) // путь в файловой системе или S3
  key: string;

  @Prop({ default: 'private', enum: ['private', 'public', 'link'] })
  access: 'private' | 'public' | 'link';

  @Prop()
  sharedToken?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;

  @Prop({ default: false }) // например, Documents, Music, etc.
  isSystem?: boolean;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);

