import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { PrismaModule } from 'nestjs-prisma';

@Module({
  imports: [ConfigModule, PrismaModule.forRoot()],
})
export class AppModule {}
