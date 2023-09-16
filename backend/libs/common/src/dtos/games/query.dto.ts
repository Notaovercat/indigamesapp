import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class GameQueryDto {
  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  platform?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  take?: number;

  @IsNumber()
  @IsOptional()
  skip?: number;

  @IsBoolean()
  @IsOptional()
  lastUpdated?: boolean;

  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;
}
