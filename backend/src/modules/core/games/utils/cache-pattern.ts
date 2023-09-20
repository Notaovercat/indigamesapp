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

  async clearCacheWithPattern(pattern: string): Promise<void> {
    // Step 1: Retrieve all keys from the cache
    const allKeys = await this.cacheManager.store.keys();

    // Step 2: Filter keys based on the pattern
    const keysToDelete = allKeys.filter((key) => key.includes(pattern));

    // Step 3: Delete the matching keys
    for (const key of keysToDelete) {
      this.logger.debug(`Deletenig ${key}`);
      await this.cacheManager.del(key);
    }
  }
}
