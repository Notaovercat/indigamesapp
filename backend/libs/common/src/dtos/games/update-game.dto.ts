import { STATUS } from '@prisma/client';
import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';

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

  @IsEnum(STATUS)
  @IsOptional()
  status?: string;

  @IsArray()
  @IsOptional()
  platforms?: string[];

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsArray()
  @IsOptional()
  genres?: string[];
}
