import { IsNotEmpty, IsString } from 'class-validator';

export class RemovePlatformDto {
  @IsString()
  @IsNotEmpty()
  platformId: string;
}
