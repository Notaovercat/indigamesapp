import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveTeamMemberDto {
  @IsString()
  @IsNotEmpty()
  teamMemberId: string;
}
