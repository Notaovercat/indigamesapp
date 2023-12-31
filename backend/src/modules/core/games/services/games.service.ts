import {
  ForbiddenException,
  Injectable,
  Logger,
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
  GameQueryDto,
} from '@app/common';
import { TeamsService } from '../../teams/services/teams.service';
import { ImagesService } from '../../images/services/images.service';
import { STATUS } from '@prisma/client';
import { IGame, IGamePreview, IImage } from '@workspace/shared';
import { CacheService } from '../../../cache/services/cache.service';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    private prisma: PrismaService,
    private teamService: TeamsService,
    private imagesService: ImagesService,
    private cacheService: CacheService,
  ) {}

  // create a game
  async createGame(dto: CreateGameDto, userId: string): Promise<GameEntity> {
    const { team, tags, platforms, genres, ...createGameDto } = dto;

    const game = await this.prisma.game.create({
      data: {
        ...createGameDto,
        platforms: {
          // connecting platforms to the game by id
          connect: platforms.map((platformId) => ({ id: platformId })),
        },
        tags: {
          // connect or create tags by name
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

    // trying to create team
    try {
      const teamMembers = {
        authorId: userId,
        teamMembers: team,
        gameId: game.id,
      } as CreateTeamDto;

      // calling the team service to create team
      await this.teamService.createTeam(teamMembers);
    } catch (err) {
      // if an error occures in the team servise, deleting the game
      return this.prisma.game.delete({ where: { id: game.id } });
    }

    // clear cache
    // await this.cacheService.clearCacheWithPattern('games');

    return game;
  }

  // return all games
  async findAllGames(query: GameQueryDto): Promise<IGamePreview[]> {
    const queryKey = JSON.stringify(query);
    const cachedData = await this.cacheService.getCache<IGamePreview[]>(
      `games:${queryKey}`,
    );

    if (cachedData) return cachedData;

    const { genre, platform, tags, take, skip, lastUpdated, isFeatured } =
      query;

    const games = await this.prisma.game.findMany({
      where: {
        isVisible: true,
        isFeatured: isFeatured ? true : undefined,
        genres: genre
          ? {
              some: {
                name: genre,
              },
            }
          : undefined,

        platforms: platform
          ? {
              some: {
                name: platform,
              },
            }
          : undefined,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take,
      skip,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        rating: true,
        views_count: true,
        isFeatured: true,
        isVisible: true,
        coverImage: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    await this.cacheService.setCache(`games:${queryKey}`, games, 3600 * 1000);
    this.logger.debug(`Caching games:${queryKey}`);

    return games;
  }

  /* 
   find game by id
   if game is not visible, return 404,
   */
  async findGameById(gameId: string, userId?: string): Promise<IGame> {
    const game = await this.prisma.game.findFirstOrThrow({
      where: {
        id: gameId,
        isVisible: true,
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        rating: true,
        views_count: true,
        isFeatured: true,
        isVisible: true,
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
                role: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        platforms: true,
        tags: true,
        genres: true,
        coverImage: true,
        screenshots: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            rated: true,
          },
        },
      },
    });

    if (userId !== game.team?.author.id) {
      await this.prisma.game.update({
        where: { id: gameId },
        data: {
          views_count: {
            increment: 1,
          },
        },
      });
    }

    return game;
  }

  async updateGame(gameId: string, dto: UpdateGameDto, userId: string) {
    // check if user author
    await this.isUserAuthor(gameId, userId);

    const { platforms, tags, genres, ...updateGameData } = dto;

    // if dto has tags, disconnect the old ones
    if (tags && tags.length > 0) {
      const currentGame = await this.prisma.game.findUnique({
        where: {
          id: gameId,
        },
        select: {
          tags: {
            select: {
              id: true,
            },
          },
        },
      });

      await this.prisma.game.update({
        where: {
          id: gameId,
        },
        data: {
          tags: {
            disconnect: currentGame?.tags,
          },
        },
      });
    }

    // clear cache
    await this.cacheService.clearCacheWithPattern('game');

    return this.prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        ...updateGameData,
        status: updateGameData.status as STATUS,
        genres: genres
          ? {
              set: genres.map((genresId) => ({ id: genresId })),
            }
          : undefined,
        platforms: platforms
          ? {
              set: platforms.map((platformId) => ({ id: platformId })),
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
      },
      include: {
        platforms: true,
        tags: true,
        genres: true,
      },
    });
  }

  // for game author only
  // change visibility of the game
  async changeVisibility(dto: ChangeVisibilityDto, userId: string) {
    await this.isUserAuthor(dto.gameId, userId);

    // clear cache
    await this.cacheService.clearCacheWithPattern('game');

    return this.prisma.game.update({
      where: {
        id: dto.gameId,
      },
      data: {
        isVisible: dto.isVisible,
      },
    });
  }

  async deleteGame(gameId: string) {
    // clear cache
    await this.cacheService.clearCacheWithPattern('game');

    return this.prisma.game.delete({ where: { id: gameId } });
  }

  // check if user is author of the game
  async isUserAuthor(gameId: string, userId: string) {
    // calling the team service
    const checkIsInTeam = await this.teamService.checkIsUserIsAuthor(
      gameId,
      userId,
    );

    if (!checkIsInTeam) throw new ForbiddenException('You are not in the team');
    return;
  }

  // find games created by user
  findMyGames(userId: string): Promise<IGamePreview[]> {
    return this.prisma.game.findMany({
      where: {
        team: {
          authorId: userId,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        rating: true,
        views_count: true,
        isFeatured: true,
        isVisible: true,
        coverImage: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          select: { id: true, name: true },
        },
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // find game created by user by id
  findMyGameById(gameId: string, userId: string) {
    return this.prisma.game.findFirstOrThrow({
      where: {
        id: gameId,
        team: {
          authorId: userId,
        },
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        rating: true,
        views_count: true,
        isFeatured: true,
        isVisible: true,
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
                role: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
        platforms: true,
        tags: true,
        genres: true,
        coverImage: true,
        screenshots: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            rated: true,
          },
        },
      },
    });
  }

  async uploadCover(
    gameId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<IImage> {
    // check if user author
    await this.isUserAuthor(gameId, userId);

    // clear cache
    await this.cacheService.clearCacheWithPattern('game');

    return this.imagesService.createCoverImage(file.filename, gameId);
  }

  // upload screensghot for the game
  async uploadScreenshot(
    gameId: string,
    userId: string,
    file: Express.Multer.File,
  ): Promise<IImage> {
    // check if user author
    await this.isUserAuthor(gameId, userId);

    return this.imagesService.createScreenshot(file.filename, gameId);
  }

  // delete screenshot from game
  async deleteScreenshot(
    gameId: string,
    userId: string,
    screenId: string,
  ): Promise<IImage> {
    // check if user author
    await this.isUserAuthor(gameId, userId);

    return this.imagesService.deleteScreenshot(screenId);
  }

  async rateGame(gameId: string, userId: string, rate: number) {
    // upsert isnt working
    const rating = await this.prisma.rating.findFirst({
      where: {
        userId,
        gameId,
      },
    });

    if (!rating) {
      await this.prisma.rating.create({
        data: {
          userId,
          gameId,
          rate,
        },
      });
    } else {
      await this.prisma.rating.update({
        where: {
          id: rating.id,
        },
        data: {
          rate,
        },
      });
    }

    const ratesArr = await this.prisma.rating.findMany({
      where: {
        gameId,
      },
    });

    const newRating =
      ratesArr.reduce((acc, rating) => rating.rate + acc, 0) / ratesArr.length;

    await this.prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        rating: newRating,
      },
      select: {
        rating: true,
      },
    });

    return newRating;
  }
}
