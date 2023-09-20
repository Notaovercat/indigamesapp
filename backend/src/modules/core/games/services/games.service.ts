import {
  ForbiddenException,
  Inject,
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
import { IGame, IGamePreview } from '@workspace/shared';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { CacheService } from '../utils/cache-pattern';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
    private prisma: PrismaService,
    private teamService: TeamsService,
    private imagesService: ImagesService,
    private cacheService: CacheService,
  ) {}

  // create a game
  async createGame(dto: CreateGameDto, user: UserEntity): Promise<GameEntity> {
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
        authorId: user.id,
        teamMembers: team,
        gameId: game.id,
      } as CreateTeamDto;

      // calling the team service to create team
      await this.teamService.createTeam(teamMembers);
    } catch (err) {
      // if an error occures in the team servise, deleting the game
      this.deleteGame(game.id);
    }

    // clear cache
    await this.cacheService.clearCacheWithPattern('games');

    return game;
  }

  // return all games
  async findAllGames(query: GameQueryDto): Promise<IGamePreview[]> {
    const queryKey = JSON.stringify(query);
    const cachedData = await this.cacheManager.get<IGamePreview[]>(
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

    await this.cacheManager.set(`games:${queryKey}`, games, 3600 * 1000);
    this.logger.debug(`Caching games:${queryKey}`);

    return games;
  }

  /* 
   find game by id
   if game is not visible, return 404,
   */
  async findGameById(
    gameId: string,
    userId?: string,
    isManage = false,
  ): Promise<IGame> {
    if (isManage && !userId)
      throw new ForbiddenException('You are not allowed');
    if (isManage && userId)
      await this.teamService.checkIsUserIsAuthor(gameId, userId);

    const game = await this.prisma.game.findFirstOrThrow({
      where: {
        id: gameId,
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

    // check if game is visible
    // if not visble and not user id provided - return 403
    if (!game.isVisible && !userId) throw new NotFoundException('No such game');
    // if (!game.isVisible) throw new NotFoundException('No such game');

    // if userid provided, check if user is author
    if (!game.isVisible && userId) {
      await this.isUserAuthor(game.id, userId);
      return game;
    }

    /*  
    await this.prisma.game.update({
      where: { id: gameId },
      data: {
        views_count: {
          increment: 1,
        },
      },
    });
    */
    if (userId !== game.team?.author?.id) {
      await this.prisma.$queryRaw`
      UPDATE "Game"
      SET "views_count" = "views_count" + 1
      WHERE "id" = ${gameId}
    `;
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

  // async removePlatformFromGame(
  //   gameId: string,
  //   platformId: string,
  //   userId: string,
  // ) {
  //   // check if user author
  //   await this.isUserAuthor(gameId, userId);

  //   const game = await this.prisma.game.findUniqueOrThrow({
  //     where: {
  //       id: gameId,
  //     },
  //   });

  //   return this.prisma.game.update({
  //     where: {
  //       id: game.id,
  //     },
  //     data: {
  //       platforms: {
  //         disconnect: {
  //           id: platformId,
  //         },
  //       },
  //     },
  //   });
  // }

  // async removeTagFromGame(gameId: string, tagId: string, userId: string) {
  //   // check if user author
  //   await this.isUserAuthor(gameId, userId);

  //   const game = await this.prisma.game.findUniqueOrThrow({
  //     where: {
  //       id: gameId,
  //     },
  //   });

  //   return this.prisma.game.update({
  //     where: {
  //       id: game.id,
  //     },
  //     data: {
  //       tags: {
  //         disconnect: {
  //           id: tagId,
  //         },
  //       },
  //     },
  //   });
  // }

  // upload cover for the game
  async uploadCover(gameId: string, userId: string, file: Express.Multer.File) {
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
  ) {
    // check if user author
    await this.isUserAuthor(gameId, userId);

    return this.imagesService.createScreenshot(file.filename, gameId);
  }

  // delete cover from game
  // async deleteCover(gameId: string, userId: string, coverId: string) {
  //   // check if user author
  //   await this.isUserAuthor(gameId, userId);
  //   const deltedCover = await this.imagesService.deleteCover(coverId);

  //   // deleting from folder
  //   if (!deltedCover) throw new ServiceUnavailableException();

  //   const imagePath = path.join(
  //     __dirname,
  //     '../uploads/images',
  //     deltedCover.name,
  //   );

  //   this.logger.debug(imagePath);

  //   return unlink(imagePath);
  // }

  // delete screenshot from game
  async deleteScreenshot(gameId: string, userId: string, screenId: string) {
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
      this.logger.debug('creating');
      await this.prisma.rating.create({
        data: {
          userId,
          gameId,
          rate,
        },
      });
    } else {
      this.logger.debug('updating');
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
