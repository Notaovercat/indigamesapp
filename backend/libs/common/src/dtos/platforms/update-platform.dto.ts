import { IsNotEmpty, IsString } from 'class-validator';

export class UpdatePlatformDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
