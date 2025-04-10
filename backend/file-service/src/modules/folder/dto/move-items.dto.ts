import { IsArray, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class MoveItem {
  @IsString()
  @IsNotEmpty()
  id: string;

  @IsString()
  @IsNotEmpty()
  type: 'file' | 'folder';
}

export class MoveItemsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => MoveItem)
  items: MoveItem[];

  @IsOptional()
  @IsString()
  destinationId: string | null;
}

