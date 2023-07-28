import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { TeamsService } from '../services/teams.service';
import {
  CreateTeamMemberDto,
  CurrentUser,
  JwtGuard,
  RoleGuard,
  Roles,
  UserEntity,
} from '@app/common';

@Controller('teams')
export class TeamController {
  constructor(private teamsService: TeamsService) {}

  @Get('game/:id')
  getTeamByGAmeId(@Param('id') gameId: string) {
    return this.teamsService.getTeamByGameId(gameId);
  }

  // @Roles('author')
  // @UseGuards(RoleGuard)
  @UseGuards(JwtGuard)
  @Post('game/:id')
  addUserToTheTeam(
    @Param('id') gameId: string,
    @Body() dto: CreateTeamMemberDto,
    @CurrentUser() user: UserEntity,
  ) {
    return this.teamsService.addUserToTheTeam(gameId, dto, user.id);
  }
}
