import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveTagDto {
  @IsString()
  @IsNotEmpty()
  tagId: string;
}
