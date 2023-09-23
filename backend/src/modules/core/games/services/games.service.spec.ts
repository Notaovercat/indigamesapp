import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { GamesService } from './games.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'nestjs-prisma';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { TeamsService } from '../../teams/services/teams.service';
import { ImagesService } from '../../images/services/images.service';
import { CacheService } from '../../../cache/services/cache.service';
import {
  CreateGameDto,
  CreateTeamDto,
  CreateTeamMemberDto,
  GameEntity,
  UpdateGameDto,
} from '@app/common';
import { faker } from '@faker-js/faker';
import { Rating } from '@prisma/client';
import { ForbiddenException } from '@nestjs/common';

describe('GameService', () => {
  let prismaMock: DeepMockProxy<PrismaService>;

  let gamesService: GamesService;
  let teamService: DeepMocked<TeamsService>;
  let imagesService: DeepMocked<ImagesService>;
  let cacheService: DeepMocked<CacheService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GamesService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep(PrismaService))
      .useMocker(createMock)
      .compile();

    gamesService = module.get(GamesService);
    teamService = module.get(TeamsService);
    imagesService = module.get(ImagesService);
    cacheService = module.get(CacheService);
    prismaMock = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(gamesService).toBeDefined();
  });

  describe('createGame', () => {
    const authorId = faker.string.uuid();

    const teamDtoArr: CreateTeamMemberDto[] = [
      {
        userId: faker.string.uuid(),
        role: faker.word.words(1),
      },
    ];

    const gameDto: CreateGameDto = {
      title: faker.word.words(1),
      description: faker.word.words(10),
      team: teamDtoArr,
      platforms: [faker.string.uuid()],
      tags: [faker.word.words(1), faker.word.words(1)],
      genres: [faker.string.uuid()],
    };

    const game: GameEntity = {
      id: faker.string.uuid(),
      title: gameDto.title,
      description: gameDto.description,
      status: 'InDevelopment',
      rating: 0,
      views_count: 0,
      isFeatured: false,
      isVisible: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const teamMembers: CreateTeamDto = {
      authorId,
      teamMembers: teamDtoArr,
      gameId: game.id,
    };
    it('Should create a game', async () => {
      const createTeamMock = jest.spyOn(teamService, 'createTeam');

      prismaMock.game.create.mockResolvedValue(game);

      const createdGame = await gamesService.createGame(gameDto, authorId);

      expect(createdGame).toBe(game);
      expect(createTeamMock).toHaveBeenCalledWith(teamMembers);
    });

    it('Should delete game on team service error', async () => {
      prismaMock.game.create.mockResolvedValue(game);

      jest.spyOn(teamService, 'createTeam').mockRejectedValue(new Error());

      await gamesService.createGame(gameDto, authorId);

      expect(prismaMock.game.delete).toHaveBeenCalledWith({
        where: { id: game.id },
      });
    });
  });

  describe('findAllGames', () => {
    const games: GameEntity[] = [
      {
        id: faker.string.uuid(),
        title: faker.word.words(1),
        description: faker.word.words(5),
        status: 'InDevelopment',
        rating: 0,
        views_count: 0,
        isFeatured: false,
        isVisible: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    it('Should return games array and cache it', async () => {
      cacheService.getCache.mockResolvedValue(undefined);

      prismaMock.game.findMany.mockResolvedValue(games);

      const setCacheMock = jest.spyOn(cacheService, 'setCache');

      const foundGames = await gamesService.findAllGames({});

      expect(foundGames).toBe(games);
      expect(setCacheMock).toHaveBeenCalled();
    });

    it('Should return cache', async () => {
      cacheService.getCache.mockResolvedValue([]);
      const foundGames = await gamesService.findAllGames({});
      expect(foundGames).toBe([]);
    });
  });

  describe('findGameById', () => {
    it('Should find visible game and increment views', async () => {
      const gameid = faker.string.uuid();
      const game: GameEntity = {
        id: gameid,
        title: faker.word.words(1),
        description: faker.word.words(5),
        status: 'InDevelopment',
        rating: 0,
        views_count: 0,
        isFeatured: false,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.game.findFirstOrThrow.mockResolvedValue(game);

      const foundGame = await gamesService.findGameById(gameid);

      expect(foundGame).toBe(game);
      expect(prismaMock.game.update).toHaveBeenCalled();
    });

    it('Should return game without increment views', async () => {
      const gameid = faker.string.uuid();
      const userId = faker.string.uuid();
      const game = {
        id: gameid,
        title: faker.word.words(1),
        description: faker.word.words(5),
        status: 'InDevelopment',
        rating: 0,
        views_count: 0,
        isFeatured: false,
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        team: {
          author: {
            id: userId,
          },
        },
      };

      const updateMock = jest.spyOn(prismaMock.game, 'update');

      (prismaMock.game.findFirstOrThrow as jest.Mock).mockResolvedValue(game);

      const foundGame = await gamesService.findMyGameById(gameid, userId);

      expect(foundGame).toBe(game);
      expect(updateMock).not.toHaveBeenCalledWith();
    });
  });

  describe('isUserAuthor', () => {
    it('Should do nothing', async () => {
      const gameId = faker.string.uuid();
      const userId = faker.string.uuid();
      teamService.checkIsUserIsAuthor.mockResolvedValue(true);

      expect(gamesService.isUserAuthor(gameId, userId)).resolves.toBe(
        undefined,
      );
    });

    it('Should throw 403 error', async () => {
      const gameId = faker.string.uuid();
      const userId = faker.string.uuid();
      teamService.checkIsUserIsAuthor.mockResolvedValue(false);

      expect(gamesService.isUserAuthor(gameId, userId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('updateGame', () => {
    it('Should upgate the game', async () => {
      teamService.checkIsUserIsAuthor.mockResolvedValue(true);
      const cacheMock = jest.spyOn(cacheService, 'clearCacheWithPattern');

      const gameId: string = faker.string.uuid();
      const dto: UpdateGameDto = {
        title: faker.word.words(1),
        description: faker.word.words(6),
      };
      const userId: string = faker.string.uuid();
      const game: GameEntity = {
        id: faker.string.uuid(),
        title: faker.word.words(1),
        description: faker.word.words(5),
        status: 'InDevelopment',
        rating: 0,
        views_count: 0,
        isFeatured: false,
        isVisible: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedGame = Object.assign(game, dto);

      prismaMock.game.update.mockResolvedValue(updatedGame);

      const gameUpdate = await gamesService.updateGame(gameId, dto, userId);

      expect(gameUpdate).toBe(updatedGame);
      expect(cacheMock).toHaveBeenCalled();
    });
  });
});
