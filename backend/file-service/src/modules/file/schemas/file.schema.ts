import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type FileDocument = HydratedDocument<File>;

@Schema()
export class File {
  @Prop({ default: null })
  folderId: string | null;

  @Prop({ required: true })
  key: string; // path: userId/folder1/folder2/filename.jpg

  @Prop({ required: true })
  filename: string;

  @Prop()
  originalName: string;

  @Prop()
  mimeType: string;

  @Prop()
  size: number;

  @Prop({ default: Date.now })
  uploadedAt: Date;

  @Prop({ required: true })
  ownerId: string;

  @Prop({ default: 'private', enum: ['private', 'public', 'link'] })
  access: 'private' | 'public' | 'link';

  @Prop()
  sharedToken?: string;
}

export const FileSchema = SchemaFactory.createForClass(File);
