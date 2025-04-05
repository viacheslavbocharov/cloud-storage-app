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

  @Prop({ default: 'private', enum: ['private', 'public', 'link'] })
  access: 'private' | 'public' | 'link';

  @Prop()
  sharedToken?: string;

  @Prop()
  key?: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop()
  deletedAt?: Date;
}

export const FolderSchema = SchemaFactory.createForClass(Folder);
