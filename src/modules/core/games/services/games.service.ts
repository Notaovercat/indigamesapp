import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateGameDto } from '../dtos/create-game.dto';
import { CreateTeamDto, UserEntity } from '@app/common';
import { TeamsService } from '../../teams/services/teams.service';
import { GameEntity } from '../entities/game.entity';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private teamService: TeamsService,
  ) {}

  async createGame(
    dto: CreateGameDto,
    user: UserEntity, // : Promise<GameEntity>
  ) {
    const { team, ...createGameDto } = dto;

    const game = await this.prisma.game.create({
      data: { ...createGameDto },
    });

    try {
      const teamMembers: CreateTeamDto = {
        authorId: user.id,
        teamMembers: team,
        gameId: game.id,
      };
      await this.teamService.createTeam(teamMembers);
    } catch (err) {
      console.log(err);
      this.deleteGame(game.id);
    }

    return game;
  }

  findAllGames(): Promise<GameEntity[]> {
    return this.prisma.game.findMany();
  }

  async findGameById(gameId: string) {
    const game = await this.prisma.game.findUniqueOrThrow({
      where: {
        id: gameId,
      },
      include: {
        team: {
          include: {
            team_members: true,
          },
        },
      },
    });
    return game;
  }

  deleteGame(gameId: string) {
    return this.prisma.game.delete({ where: { id: gameId } });
  }
}
