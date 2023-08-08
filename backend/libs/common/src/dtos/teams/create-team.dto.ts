import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateTeamMemberDto } from './create-teammember.dto';
import { Type } from 'class-transformer';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  authorId: string;

  @ValidateNested()
  @Type(() => CreateTeamMemberDto)
  teamMembers: CreateTeamMemberDto[];

  @IsString()
  @IsNotEmpty()
  gameId: string;
}
