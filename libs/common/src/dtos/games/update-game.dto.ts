import { IsArray, IsOptional, IsString } from 'class-validator';

export class UpdateGameDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  fileId?: string;

  @IsString()
  @IsOptional()
  coverImageId?: string;

  @IsArray()
  @IsOptional()
  platforms?: string[];
}
