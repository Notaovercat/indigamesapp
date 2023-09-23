import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMocked, createMock } from '@golevelup/ts-jest';
import { CacheService } from '../../../cache/services/cache.service';
import { PrismaService } from 'nestjs-prisma';
import { faker } from '@faker-js/faker';
import { PlatformsService } from './platforms.service';
import { IPlatform } from '@workspace/shared';
import { CreatePlatformDto } from '@app/common';

describe('PlatformService', () => {
  let platformService: PlatformsService;
  let cacheService: DeepMocked<CacheService>;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlatformsService,
        { provide: CacheService, useValue: createMock<CacheService>() },
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    })
      .useMocker(createMock)
      .compile();

    platformService = module.get(PlatformsService);
    cacheService = module.get(CacheService);
    prismaMock = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(platformService).toBeDefined();
  });

  describe('findAllPlatforms', () => {
    it('Should return array of platforms', async () => {
      const platformsArr = [];

      prismaMock.platform.findMany.mockResolvedValue(platformsArr);

      const findplatforms = await platformService.findAllPlatforms();

      expect(findplatforms).toBe(platformsArr);
    });
  });

  describe('findPlatformById', () => {
    it('Should find platform by id', async () => {
      const platform: IPlatform = {
        id: faker.string.uuid(),
        name: faker.word.words(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.platform.findFirstOrThrow.mockResolvedValue(platform);

      const foundplatform = await platformService.findPlatformById(platform.id);

      expect(foundplatform).toBe(platform);
    });
  });

  describe('createPlatform', () => {
    it('Should create a platform', async () => {
      const spy = jest.spyOn(cacheService, 'deleteCache');

      const name = faker.lorem.word();

      const dto: CreatePlatformDto = {
        name,
      };

      const createdPlatform: IPlatform = {
        id: faker.string.uuid(),
        name,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.platform.create.mockResolvedValue(createdPlatform);

      const createPlat = await platformService.createPlatform(dto);

      expect(createPlat).toBe(createdPlatform);
      expect(spy).toHaveBeenCalled();
    });

    it('Should throw an error if platform creation fails', async () => {
      const name = faker.lorem.word();
      const dto: CreatePlatformDto = {
        name,
      };
      prismaMock.platform.create.mockRejectedValue(
        new Error('Platform creation failed'),
      );
      await expect(async () => {
        await platformService.createPlatform(dto);
      }).rejects.toThrowError('Platform creation failed');
    });
  });

  describe('updatePlatform', () => {
    it('Should update a platform', async () => {
      const spy = jest.spyOn(cacheService, 'deleteCache');

      const oldPlatform: IPlatform = {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = {
        name: faker.lorem.word(),
      };

      const updatedPlatform = {
        ...oldPlatform,
        name: dto.name,
      };

      prismaMock.platform.update.mockResolvedValue(updatedPlatform);

      const updateGen = await platformService.updatePlatform(
        oldPlatform.id,
        dto,
      );

      expect(updateGen).toBe(updatedPlatform);
      expect(spy).toHaveBeenCalled();
    });

    it('Should throw an error if platform updating fails', async () => {
      const oldPlatform: IPlatform = {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const dto = {
        name: faker.lorem.word(),
      };

      prismaMock.platform.update.mockRejectedValue(
        new Error('Platform creation failed'),
      );
      await expect(async () => {
        await platformService.updatePlatform(oldPlatform.id, dto);
      }).rejects.toThrowError('Platform creation failed');
    });
  });

  describe('deletePlatform', () => {
    it('Should delete a platform', async () => {
      const spy = jest.spyOn(cacheService, 'deleteCache');

      const deletedPlatform: IPlatform = {
        id: faker.string.uuid(),
        name: faker.lorem.word(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.platform.delete.mockResolvedValue(deletedPlatform);

      const deleteGen = await platformService.deletePlatform(
        deletedPlatform.id,
      );

      expect(deleteGen).toBe(deletedPlatform);
      expect(spy).toHaveBeenCalled();
    });
  });
});
