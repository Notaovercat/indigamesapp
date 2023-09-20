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
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
