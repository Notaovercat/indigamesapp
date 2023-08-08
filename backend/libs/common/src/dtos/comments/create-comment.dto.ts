import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  sourceId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
