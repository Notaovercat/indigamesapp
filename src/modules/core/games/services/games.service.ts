import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateTeamDto,
  UserEntity,
  CreateGameDto,
  GameEntity,
  UpdateGameDto,
} from '@app/common';
import { TeamsService } from '../../teams/services/teams.service';

@Injectable()
export class GamesService {
  constructor(
    private prisma: PrismaService,
    private teamService: TeamsService,
  ) {}

  async createGame(dto: CreateGameDto, user: UserEntity): Promise<GameEntity> {
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

    await this.prisma.game.update({
      where: { id: gameId },
      data: {
        views_count: {
          increment: 1,
        },
      },
    });

    return game;
  }

  async updateGame(gameId: string, dto: UpdateGameDto, user: UserEntity) {
    const game = await this.findGameById(gameId);

    if (!game.team) throw new InternalServerErrorException();

    const checkIsInTeam = this.teamService.checkIfUserInTeam(
      game.team.id,
      user.id,
    );

    if (!checkIsInTeam) throw new ForbiddenException('You are not in the team');

    return this.prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        ...dto,
      },
    });
  }

  deleteGame(gameId: string) {
    return this.prisma.game.delete({ where: { id: gameId } });
  }
}
