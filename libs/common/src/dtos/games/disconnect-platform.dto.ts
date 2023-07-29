import { IsNotEmpty, IsString } from 'class-validator';

export class DisconnectPlatformDto {
  @IsString()
  @IsNotEmpty()
  platformId: string;
}
