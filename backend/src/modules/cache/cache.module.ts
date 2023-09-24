import { Module } from '@nestjs/common';
import { CacheModule as CacheProvider } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import cacheConfig from '../configs/cache.config';
import { CacheService } from './services/cache.service';

@Module({
  imports: [
    CacheProvider.register({
      isGlobal: true,
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
