import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CacheService } from '../../../cache/services/cache.service';
import { PrismaService } from 'nestjs-prisma';
import { IGenre } from '@workspace/shared';
import { faker } from '@faker-js/faker';
import { CreateGenreDto } from '@app/common';

describe('GenresService', () => {
  let genresService: GenresService;
  let cacheService: DeepMocked<CacheService>;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        { provide: CacheService, useValue: createMock<CacheService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    })
      .useMocker(createMock)
      .compile();

    genresService = module.get(GenresService);
    cacheService = module.get(CacheService);
    prismaMock = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(genresService).toBeDefined();
  });

  describe('findAllGenres', () => {
    it('Should return array of genres', async () => {
      const genresArr = [];

      prismaMock.genre.findMany.mockResolvedValue(genresArr);

      const findGenres = await genresService.findAllGenres();

      expect(findGenres).toBe(genresArr);
    });
  });

  describe('findOneGenre', () => {
    it('Should find genre by id', async () => {
      const genre: IGenre = {
        id: faker.string.uuid(),
        name: faker.word.words(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.genre.findFirstOrThrow.mockResolvedValue(genre);

      const foundGenre = await genresService.findOneGenre(genre.id);

      expect(foundGenre).toBe(genre);
    });
  });

  describe('createGenre', () => {
    it('Should create a genre', async () => {
      const spy = jest.spyOn(cacheService, 'deleteCache');

      const name = faker.lorem.word();

      const dto: CreateGenreDto = {
        name,
      };

      const createdGenre: IGenre = {
        id: faker.string.uuid(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.genre.create.mockResolvedValue(createdGenre);

      const createGen = await genresService.createGenre(dto);

      expect(createGen).toBe(createdGenre);
      expect(spy).toHaveBeenCalled();
    });

    it('Should throw an error if genre creation fails', async () => {
      const name = faker.lorem.word();
      const dto: CreateGenreDto = {
        name,
      };
      prismaMock.genre.create.mockRejectedValue(
        new Error('Genre creation failed'),
      );
      await expect(async () => {
        await genresService.createGenre(dto);
      }).rejects.toThrowError('Genre creation failed');
    });
  });

  describe('updateGenre', () => {
    it('Should update a genre', async () => {
      const spy = jest.spyOn(cacheService, 'deleteCache');

      const oldGenre: IGenre = {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = {
        name: faker.lorem.word(),
      };

      const updatedGenre = {
        ...oldGenre,
        name: dto.name,
      };

      prismaMock.genre.update.mockResolvedValue(updatedGenre);

      const updateGen = await genresService.updateGenre(oldGenre.id, dto);

      expect(updateGen).toBe(updatedGenre);
      expect(spy).toHaveBeenCalled();
    });

    it('Should throw an error if genre updating fails', async () => {
      const oldGenre: IGenre = {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = {
        name: faker.lorem.word(),
      };

      prismaMock.genre.update.mockRejectedValue(
        new Error('Genre creation failed'),
      );
      await expect(async () => {
        await genresService.updateGenre(oldGenre.id, dto);
      }).rejects.toThrowError('Genre creation failed');
    });
  });

  describe('deleteGenre', () => {
    it('Should delete a genre', async () => {
      const spy = jest.spyOn(cacheService, 'deleteCache');

      const deletedGenre: IGenre = {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.genre.delete.mockResolvedValue(deletedGenre);

      const deleteGen = await genresService.deleteGenre(deletedGenre.id);

      expect(deleteGen).toBe(deletedGenre);
      expect(spy).toHaveBeenCalled();
    });
  });
});
