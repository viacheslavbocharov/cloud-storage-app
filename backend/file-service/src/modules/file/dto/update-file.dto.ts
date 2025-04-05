import { IsOptional, IsIn, IsString } from 'class-validator';

export class UpdateFileDto {
  @IsOptional()
  @IsString()
  originalName?: string;

  @IsOptional()
  @IsIn(['private', 'public', 'link'])
  access?: 'private' | 'public' | 'link';
}
