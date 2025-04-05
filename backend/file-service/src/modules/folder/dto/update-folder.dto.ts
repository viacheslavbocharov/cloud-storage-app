import { IsString } from 'class-validator';

export class UpdateFolderDto {
  @IsString()
  name: string;
}
