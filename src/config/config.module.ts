import { Module } from '@nestjs/common';
import { ConfigService, ConfigModule as NestConfig } from '@nestjs/config';

@Module({
  imports: [
    NestConfig.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
