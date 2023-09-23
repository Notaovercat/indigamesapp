import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'nestjs-prisma';
import { ImagesService } from './images.service';
import { CoverImage, Screenshot } from '@prisma/client';
import { faker } from '@faker-js/faker';

describe('ImagesService', () => {
  let imagesService: ImagesService;
  let prismaMock: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImagesService,
        { provide: PrismaService, useValue: mockDeep<PrismaService>() },
      ],
    }).compile();

    imagesService = module.get(ImagesService);
    prismaMock = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should be defined', () => {
    expect(imagesService).toBeDefined();
  });

  describe('createCoverImage', () => {
    it('Should create a cover', async () => {
      const filename = faker.word.words();
      const gameId = faker.string.uuid();

      const createdCover: CoverImage = {
        id: faker.string.uuid(),
        name: filename,
        gameId: gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.coverImage.findFirst.mockResolvedValue(null);

      prismaMock.coverImage.create.mockResolvedValue(createdCover);

      const cover = await imagesService.createCoverImage(filename, gameId);

      expect(cover).toBe(createdCover);
      expect(prismaMock.coverImage.create).toHaveBeenCalled();
    });

    it('Should replace an existing cover', async () => {
      const delteMock = jest.spyOn(imagesService, 'deleteFile');

      delteMock.mockResolvedValue();

      const filename = faker.word.words();
      const gameId = faker.string.uuid();

      const newCover: CoverImage = {
        id: faker.string.uuid(),
        name: filename,
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const oldCover: CoverImage = {
        id: faker.string.uuid(),
        name: faker.word.words(),
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.coverImage.findFirst.mockResolvedValue(oldCover);

      prismaMock.coverImage.update.mockResolvedValue(newCover);

      const cover = await imagesService.createCoverImage(filename, gameId);

      expect(cover).toBe(newCover);
      expect(prismaMock.coverImage.update).toHaveBeenCalled();
      expect(delteMock).toHaveBeenCalledWith(oldCover.name);
    });
  });

  describe('createScreenshot', () => {
    it('Should create a screenshot', async () => {
      const filename = faker.word.words();
      const gameId = faker.string.uuid();

      const screenshot: Screenshot = {
        id: faker.string.uuid(),
        name: filename,
        gameId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.screenshot.create.mockResolvedValue(screenshot);

      const createdScreen = await imagesService.createScreenshot(
        filename,
        gameId,
      );

      expect(createdScreen).toBe(screenshot);
    });
  });

  describe('deleteScreenshot', () => {
    it('Should delete screenshot', async () => {
      const screenId = faker.string.uuid();

      const screen = {
        id: screenId,
        name: faker.word.words(),
        gameId: faker.string.uuid(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const deleteMock = jest.spyOn(imagesService, 'deleteFile');

      deleteMock.mockResolvedValue();

      prismaMock.screenshot.delete.mockResolvedValue(screen);

      const deletedcreenshot = await imagesService.deleteScreenshot(screenId);

      expect(deletedcreenshot).toBe(screen);
      expect(prismaMock.screenshot.delete).toHaveBeenCalledWith({
        where: { id: screenId },
      });
      expect(deleteMock).toHaveBeenCalled();
    });
  });
});
