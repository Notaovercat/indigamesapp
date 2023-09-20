import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  private logger: Logger = new Logger(CacheService.name);

  constructor(
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  setCache(key: string, value: unknown, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  getCache<T>(key: string) {
    return this.cacheManager.get<T>(key);
  }

  deleteCache(key: string) {
    return this.cacheManager.del(key);
  }

  async clearCacheWithPattern(pattern: string): Promise<void> {
    const allKeys = await this.cacheManager.store.keys();

    const keysToDelete = allKeys.filter((key) => key.includes(pattern));

    for (const key of keysToDelete) {
      this.logger.debug(`Deletenig ${key}`);
      await this.cacheManager.del(key);
    }
  }
}
