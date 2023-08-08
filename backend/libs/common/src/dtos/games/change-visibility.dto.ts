import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class ChangeVisibilityDto {
  @IsString()
  @IsNotEmpty()
  gameId: string;

  @IsBoolean()
  @IsNotEmpty()
  isVisible: boolean;
}
