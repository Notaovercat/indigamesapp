import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateTeamMemberDto } from '@app/common';

export class CreateGameDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  fileId?: string;

  @IsString()
  @IsOptional()
  coverImageId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTeamMemberDto)
  team: CreateTeamMemberDto[];

  @IsArray()
  @IsNotEmpty()
  platforms: string[];
}
