import { Test } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { createMock } from '@golevelup/ts-jest';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

describe('CacheService', () => {
  let cacheService: CacheService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: {
            set: jest.fn(),
            get: jest.fn(),
            del: jest.fn(),
          },
        },
      ],
    }).compile();

    cacheService = module.get(CacheService);
  });

  it('Should be defined', () => {
    expect(cacheService).toBeDefined();
  });
});
