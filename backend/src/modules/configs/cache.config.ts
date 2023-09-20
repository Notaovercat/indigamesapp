import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService, registerAs } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';

export default registerAs(
  'cache.config',
  (): CacheModuleAsyncOptions => ({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      store: redisStore,
      host: configService.get<string>('REDIS_HOST'),
      port: configService.get<number>('REDIS_PORT'),
    }),
  }),
);
