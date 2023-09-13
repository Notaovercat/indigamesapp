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
} from '@app/common';
import { TeamsService } from '../../teams/services/teams.service';
import { ImagesService } from '../../images/services/images.service';
import { STATUS } from '@prisma/client';

@Injectable()
export class GamesService {
  private readonly logger = new Logger(GamesService.name);

  constructor(
    private prisma: PrismaService,
    private teamService: TeamsService,
    private imagesService: ImagesService,
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
      console.log(err);
      this.deleteGame(game.id);
    }

    return game;
  }

  // return all games
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
        updatedAt: lastUpdated ? 'desc' : 'asc',
      },
      include: {
        coverImage: {
          select: {
            id: true,
            name: true,
          },
        },
        genres: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  /* 
   find game by id
   if game is not visible, return 404,
   if user requseting his game, return if userid provided 
   */
  async findGameById(gameId: string, userId?: string, isManage = false) {
    if (isManage && !userId) throw new ForbiddenException('No such game');
    if (isManage && userId)
      await this.teamService.checkIsUserIsAuthor(gameId, userId);

    const game = await this.prisma.game.findFirstOrThrow({
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

    // check if game is visible
    // if not visble and not user id provided - return 403
    if (!game.isVisible && !userId) throw new NotFoundException('No such game');

    // if userid provided, check if user is author
    if (!game.isVisible && userId) {
      await this.isUserAuthor(game.id, userId);
      return game;
    }

    // REDO THIS LATER
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

    return this.prisma.game.update({
      where: {
        id: gameId,
      },
      data: {
        ...updateGameData,
        status: updateGameData.status as STATUS,
        team: {},
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

  // for game author only
  // change visibility of the game
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
    platformId: string,
    userId: string,
  ) {
    // check if user author
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
            id: platformId,
          },
        },
      },
    });
  }

  async removeTagFromGame(gameId: string, tagId: string, userId: string) {
    // check if user author
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
            id: tagId,
          },
        },
      },
    });
  }

  // upload cover for the game
  async uploadCover(gameId: string, userId: string, file: Express.Multer.File) {
    // check if user author
    await this.isUserAuthor(gameId, userId);

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
  async deleteCover(gameId: string, userId: string, coverId: string) {
    // check if user author
    await this.isUserAuthor(gameId, userId);
    return this.imagesService.deleteCover(coverId);
    // const deletedCover = await this.imagesService.deleteCover(coverId);

    // deleting from folder
    // const filePath =
    //   path.join(__dirname, '../uploads/images/') + deletedCover.name;
    // return fs.unlink(filePath, (err) => console.log(err));
  }

  // delete screenshot from game
  async deleteScreenshot(gameId: string, userId: string, screenId: string) {
    // check if user author
    await this.isUserAuthor(gameId, userId);
    return this.imagesService.deleteScreenshot(screenId);
  }
}
