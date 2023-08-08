import {
  ForbiddenException,
  Injectable,
  // Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import {
  CreateTeamDto,
  UserEntity,
  CreateGameDto,
  GameEntity,
  UpdateGameDto,
  ChangeVisibilityDto,
  RemovePlatformDto as RemovePlatformDto,
  RemoveTagDto,
} from '@app/common';
import { TeamsService } from '../../teams/services/teams.service';
import { ImagesService } from '../../images/services/images.service';

@Injectable()
export class GamesService {
  // private readonly logger = new Logger(GamesService.name);

  constructor(
    private prisma: PrismaService,
    private teamService: TeamsService,
    private imagesService: ImagesService,
  ) {}

  async createGame(dto: CreateGameDto, user: UserEntity): Promise<GameEntity> {
    const { team, tags, platforms, genres, ...createGameDto } = dto;

    const game = await this.prisma.game.create({
      data: {
        ...createGameDto,
        platforms: {
          connect: platforms.map((platformId) => ({ id: platformId })),
        },
        tags: {
          connectOrCreate: tags.map((tag) => ({
            where: { name: tag },
            create: { name: tag },
          })),
        },
        genres: {
          connect: genres.map((genreId) => ({ id: genreId })),
        },
      },
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

  findAllGames(
    isFeatured?: boolean,
    lastUpdated?: boolean,
  ): Promise<GameEntity[]> {
    return this.prisma.game.findMany({
      where: {
        isFeatured: isFeatured ? true : undefined,
        isVisible: true,
      },
      orderBy: {
        updatedAt: lastUpdated ? 'desc' : undefined,
      },
    });
  }

  async findGameById(gameId: string, userId?: string) {
    const game = await this.prisma.game.findUniqueOrThrow({
      where: {
        id: gameId,
      },
      include: {
        team: {
          select: {
            id: true,
            author: {
              select: {
                id: true,
                email: true,
                username: true,
              },
            },
            team_members: {
              select: {
                id: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  },
                },
                role: true,
              },
            },
          },
        },
        platforms: true,
        tags: true,
        genres: true,
        coverImage: true,
        screenshots: true,
      },
    });

    if (!game.isVisible && !userId) throw new NotFoundException('No such game');

    if (!game.isVisible && userId) {
      await this.isUserAuthor(game.id, userId);
      return game;
    }

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

  async updateGame(gameId: string, dto: UpdateGameDto, userId: string) {
    await this.isUserAuthor(gameId, userId);

    const { platforms, tags, genres, ...updateGameData } = dto;

    return this.prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        ...updateGameData,
        platforms: platforms
          ? {
              connect: platforms.map((platformId) => ({ id: platformId })),
            }
          : undefined,
        tags: tags
          ? {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            }
          : undefined,
        genres: genres
          ? {
              connect: genres.map((genreId) => ({ id: genreId })),
            }
          : undefined,
      },
      include: {
        platforms: true,
        tags: true,
        genres: true,
      },
    });
  }

  async changeVisibility(dto: ChangeVisibilityDto, userId: string) {
    await this.isUserAuthor(dto.gameId, userId);

    return this.prisma.game.update({
      where: {
        id: dto.gameId,
      },
      data: {
        isVisible: dto.isVisible,
      },
    });
  }

  deleteGame(gameId: string) {
    return this.prisma.game.delete({ where: { id: gameId } });
  }

  async isUserAuthor(gameId: string, userId: string) {
    const checkIsInTeam = await this.teamService.checkIsUserIsAuthor(
      gameId,
      userId,
    );

    if (!checkIsInTeam) throw new ForbiddenException('You are not in the team');
    return;
  }

  async findMyGames(userId: string) {
    return this.prisma.game.findMany({
      where: {
        team: {
          authorId: userId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async removePlatformFromGame(
    gameId: string,
    dto: RemovePlatformDto,
    userId: string,
  ) {
    await this.isUserAuthor(gameId, userId);

    const game = await this.prisma.game.findUniqueOrThrow({
      where: {
        id: gameId,
      },
    });

    return this.prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        platforms: {
          disconnect: {
            id: dto.platformId,
          },
        },
      },
    });
  }

  async removeTagFromGame(gameId: string, dto: RemoveTagDto, userId: string) {
    await this.isUserAuthor(gameId, userId);

    const game = await this.prisma.game.findUniqueOrThrow({
      where: {
        id: gameId,
      },
    });

    return this.prisma.game.update({
      where: {
        id: game.id,
      },
      data: {
        tags: {
          disconnect: {
            id: dto.tagId,
          },
        },
      },
    });
  }

  async uploadCover(gameId: string, userId: string, file: Express.Multer.File) {
    await this.isUserAuthor(gameId, userId);

    return this.imagesService.createCoverImage(file.filename, gameId);
  }

  async uploadScreenshot(
    gameId: string,
    userId: string,
    file: Express.Multer.File,
  ) {
    await this.isUserAuthor(gameId, userId);

    return this.imagesService.createScreenshot(file.filename, gameId);
  }

  async deleteCover(gameId: string, userId: string, coverId: string) {
    await this.isUserAuthor(gameId, userId);
    return this.imagesService.deleteCover(coverId);
  }

  async deleteScreenshot(gameId: string, userId: string, screenId: string) {
    await this.isUserAuthor(gameId, userId);
    return this.imagesService.deleteScreenshot(screenId);
  }
}
