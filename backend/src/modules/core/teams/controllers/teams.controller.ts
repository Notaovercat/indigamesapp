import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import {
  CreateTeamMemberDto,
  CurrentUser,
  JwtGuard,
  RemoveTeamMemberDto,
  UserEntity,
} from '@app/common';

@Controller('teams')
export class TeamController {
  constructor(private teamsService: TeamsService) {}

  @Get('game/:id')
  getTeamByGAmeId(@Param('id') gameId: string) {
    return this.teamsService.getTeamByGameId(gameId);
  }

  @UseGuards(JwtGuard)
  @Post('game/:id')
  addUserToTheTeam(
    @Param('id') gameId: string,
    @Body() dto: CreateTeamMemberDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.teamsService.addUserToTheTeam(gameId, dto, user.id);
  }

  @UseGuards(JwtGuard)
  @Delete('game/:id')
  removeUserFromTeam(
    @Param('id') gameId: string,
    @Body() dto: RemoveTeamMemberDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.teamsService.removeUserFromTeam(gameId, dto, user.id);
  }
}
